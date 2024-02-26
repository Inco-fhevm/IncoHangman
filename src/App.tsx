/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRef, useLayoutEffect, useState, useEffect} from 'react'
import './App.scss'

import { Contract } from "ethers";
import factoryABI from "./assets/factory_abi.json";
import gameABI from "./assets/game_abi.json";

//import WebApp from '@twa-dev/sdk'
import {usePrivy, useWallets} from '@privy-io/react-auth';
import truncateEthAddress from 'truncate-eth-address';

import WalletIcon from './assets/wallet_icon.svg';

import Game from './Game.svelte';
import {Web3Provider} from '@ethersproject/providers';

import WebApp from '@twa-dev/sdk'

import 'regenerator-runtime/runtime';

const GAME_FACTORY_ADDR = "0x746eD964A6B0ECF7Ab765Dfd831Bf4a715Ac33af";

async function fundWallet(walletAddress: string): Promise<boolean> {
  console.info("Funding wallet");
  const response = await fetch('https://faucet.testnet.inco.org/api/get-faucet', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      address: walletAddress
    })
  });

  return response.ok;
}


function App() {
  const {ready, user, login, logout, authenticated} = usePrivy();

  const [isFunded, setIsFunded] = useState(false);
  const [isInGame, setIsInGame] = useState(false);

  const [letter, setLetter] = useState("");
  const [gameAddress, setGameAddress] = useState("");
  const [wordReveal, setWordReveal] = useState("____");
  const [nOfLives, setNOfLives] = useState(11);
  const [hasWon, setHasWon] = useState(false);
  const [wrongGuesses, setWrongGuesses] = useState<Array<string>>([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLetterInput = (e: any) => {
    // Here we are checking if the length is equal to 10
    if (e.target.value.length == 1 || e.target.value.length == 4) {
      setLetter(e.target.value);
    }
  };

  const handleOnKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === 8) {
      setLetter("");
    }
  };
  
  const { wallets } = useWallets();
  const w0 = wallets[0];

  /*
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();
  */


  useEffect(() => {
    w0?.getEthersProvider().then(async (provider) => {
      const network = await provider.getNetwork();
      if (network.chainId != 9090) {
        await addNetwork();
      }
      
      await w0.switchChain(9090);
  
      w0?.getEthersProvider().then(async (provider) => {
        const balance = await getBalance(provider);
        if (!isFunded && balance?.lte(100000000000000)) {
          const funded = await fundWallet(w0.address);
          if (funded) {
            setIsFunded(true);
          } else {
            WebApp.showPopup({
              title: "Error",
              message: "Could not fund wallet",
            });
          }
        } else {
          setIsFunded(true);
        }
      });
    })
  }, [w0, authenticated])
  

  const walletAddress = truncateEthAddress(user?.wallet?.address || "");

  //Get user balance
  async function getBalance(provider: Web3Provider) {
    const network = await provider.getNetwork();
    if (network.chainId != 9090) {
      await addNetwork();
    }

    await w0.switchChain(9090);

    const signer = await provider?.getSigner();
    const balance = await signer?.getBalance();
    return balance;
  }

  async function addNetwork() {
    console.info("Adding network");
    const provider = await w0?.getEthersProvider();
    //Request to add Inco chain
    await provider?.send("wallet_addEthereumChain", [
      {
        chainId: "0x2382", //9090
        chainName: "Inco Gentry",
        nativeCurrency: {
          name: "IncoToken",
          symbol: "INCO",
          decimals: 18,
        },
        rpcUrls: ["https://testnet.inco.org/"],
        blockExplorerUrls: ["https://explorer.inco.org/"],
      },
    ]);
  }

  const createGame = async () => {
    console.info("Creating Game");
    const gameAddr = await createNewGame(() => setIsInGame(true));
    setGameAddress(gameAddr);
    setIsInGame(true);

    //Reset state
    setLetter("");
    setWordReveal("____");
    setNOfLives(11);
    setHasWon(false);
    setWrongGuesses([]);
    console.info("Game created");
    console.info(gameAddr);
  }


  const guess = async () => {
    console.info("Making a guess");
    const correctGuess = await guessLetter(letter, () => {
      setLetter("");
    });
    console.info("Guessed correctly?:");
    console.info(correctGuess);
    if (correctGuess) {
      const revealedWord = await showWord();
      console.info("Word:");
      console.info(revealedWord);
      setWordReveal(revealedWord);
      //Search revealed word for underscores
      if (revealedWord.indexOf("_") === -1) {
        setHasWon(true);
      }
    } else {
      console.info("Updating wrong guess list:")
      setWrongGuesses(wrongGuesses.concat([letter]));
      console.info(wrongGuesses);
    }
  }


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createNewGame = async ( hook : () => any ): Promise<string> => {
    const provider = await w0?.getEthersProvider();
    const network = await provider.getNetwork();
    if (network.chainId != 9090) {
      addNetwork();
    }

    const signer = await provider?.getSigner();
    const address = await signer?.getAddress();

    const factoryContract = new Contract(GAME_FACTORY_ADDR, factoryABI, signer);
    const res = await factoryContract.CreateGame(address);

    hook();

    const receipt = await res.wait();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const event = receipt.events.find((event: any) => event.event === 'GameCreated');
    const [playerAddr, gameAddr] = event.args; 
    console.info("playerAddr:", playerAddr);  
    return gameAddr;
  }


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const guessLetter = async ( letter: string, hook : () => any ): Promise<boolean> => {
    const provider = await w0?.getEthersProvider();
    const network = await provider.getNetwork();
    if (network.chainId != 9090) {
      addNetwork();
    }

    const signer = await provider?.getSigner();

    const gameContract = new Contract(gameAddress, gameABI, signer);

    console.info("Before estimate gas")
    //const gasEstimated = await gameContract.estimateGas.guessLetter(letter);

    const res = await gameContract.guessLetter(letter/*, {
      gasLimit: 300000000
    }*/);

    hook();

    const receipt = await res.wait();
    
    /*
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const event = receipt.events.find((event: any) => event.event === 'GuessedCorrectly' || event.event === 'GuessedIncorrectly');
    if (event) {
      console.info("Guessed event:");
      console.info(event);
      const [retLetter] = event.args;   
      return retLetter;
    }
    */

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const guessedCorrectlyEvent = receipt.events.find((event: any) => event.event === 'GuessedCorrectly');
    if (guessedCorrectlyEvent) {
      console.info("Guessed correctly!!");
      const [correctLetter] = guessedCorrectlyEvent.args;
      console.info("correctLetter:");
      console.info(correctLetter);
      return true;
    }
    else {
      if (nOfLives > 0) {
        setNOfLives(nOfLives - 1);
      }
      return false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const showWord = async (): Promise<string> => {
    const provider = await w0?.getEthersProvider();
    const network = await provider.getNetwork();
    if (network.chainId != 9090) {
      addNetwork();
    }

    const gameContract = new Contract(gameAddress, gameABI, provider);

    const res = await gameContract.showWord();
    return res;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const svelteRef = useRef<any>();

  useLayoutEffect(() => {
    while (svelteRef.current.firstChild) {
      svelteRef.current.removeChild(svelteRef.current.firstChild);
    }
    
    new Game({
      target: svelteRef.current as Element,
      props: {
        wrongGuesses: [...wrongGuesses],
        lives: nOfLives,
        currentWord: wordReveal,
        hasWon: hasWon
      }
    })
  }, [nOfLives, wordReveal, wrongGuesses, hasWon])

  return (
    <>
      <div className="Fill"></div>
      <div className="Game">
        <div className="Profile">
          {
            authenticated ?
            <div className="Wallet">
              <img className="WalletIcon" src={WalletIcon} alt="Wallet Icon"></img>
              <p>{walletAddress}</p>
              <button className="LogoutButton" onClick={logout}>
                Logout
              </button>
            </div>
            :
            <div className="Wallet">
              <p>No wallet connected</p>
            </div>
          }
        </div>
        <div ref={svelteRef}></div>

        <br></br>
        <br></br>

        <div className="ActionButtons">
        {
          ready?
              !authenticated ?
              <button className="LoginButton" onClick={login}>
                    Login to Play
              </button>
              :
              
              <div> {
                isInGame && nOfLives > 0 && !hasWon ?
                <div className="LetterInputForm">
                  
                  <input className="LetterInput" type="text" maxLength={4} placeholder="A - Z" value={letter} onChange={handleLetterInput} onKeyDown={handleOnKeyDown}></input>
                  <button className="LoginButton" onClick={guess}>
                      Guess {nOfLives}
                  </button>
                </div>
                :
                <button className="CreateButton" onClick={createGame}>
                      New Game
                </button>
                }
              </div>
          :
          undefined
        }
        </div>
      </div>
    </>
  )
}

export default App
