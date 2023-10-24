/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRef, useLayoutEffect, useState, useEffect} from 'react'
import './App.scss'

import { Contract } from "ethers";
import abi from "./assets/abi.json";

//import WebApp from '@twa-dev/sdk'
import {usePrivy, useWallets} from '@privy-io/react-auth';
import truncateEthAddress from 'truncate-eth-address';

import WalletIcon from './assets/wallet_icon.svg';
import SlotMachine from './SlotMachine.svelte';
import {Web3Provider} from '@ethersproject/providers';

import WebApp from '@twa-dev/sdk'

async function fundWallet(walletAddress: string): Promise<boolean> {
  const response = await fetch('https://faucet.inco.network/api/get-faucet', {
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

  const [isFetching, setIsFetching] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [isFunded, setIsFunded] = useState(false);
  
  const { wallets } = useWallets();
  const w0 = wallets[0];

  useEffect(() => {
    w0?.getEthersProvider().then(async (provider) => {
      const network = await provider.getNetwork();
      if (network.chainId != 9090) {
        await addNetwork();
      }
      
      await w0.switchChain(9090);
  
      w0?.getEthersProvider().then(async (provider) => {
        const balance = await getBalance(provider);
        if (balance?.lte(100000000000000)) {
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
  }, [w0])
  
  const [wheel1, setWheel1] = useState(0);
  const [wheel2, setWheel2] = useState(0);
  const [wheel3, setWheel3] = useState(0);

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
        chainName: "Inco Network",
        nativeCurrency: {
          name: "IncoToken",
          symbol: "INCO",
          decimals: 18,
        },
        rpcUrls: ["https://evm-rpc.inco.network/"],
        blockExplorerUrls: ["https://explorer.inco.network/"],
      },
    ]);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getRandomNumber = async ( hook : () => any ): Promise<number> => {
    const provider = await w0?.getEthersProvider();
    const network = await provider.getNetwork();
    if (network.chainId != 9090) {
      addNetwork();
    }

    const signer = await provider?.getSigner();

    const contract = new Contract('0x211422B33119e8E1d713A11eDEfd470e16E83064', abi, signer);
    const res = await contract.spin();

    hook();

    const receipt = await res.wait();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const event = receipt.events.find((event: any) => event.event === 'RandomNumber');
    const [randomNumber] = event.args;   
    return randomNumber;

    /* For testing purposes
    const rn2 = Math.floor(Math.random() * 65535);
    return rn2;
    */
  }

  const spin = async () => {
    setIsFetching(true);
    setIsStopping(true);
  }

  const onSpinFinished = (c1: number, c2: number, c3: number) => {
    setIsFetching(false);
    setIsStopping(false);
    setWheel1(c1);
    setWheel2(c2);
    setWheel3(c3);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const svelteRef = useRef<any>();

  useLayoutEffect(() => {
    while (svelteRef.current.firstChild) {
      svelteRef.current.removeChild(svelteRef.current.firstChild);
    }
    
    new SlotMachine({
      target: svelteRef.current as Element,
      props: {
        onSpin: spin,
        onSpinFinished: onSpinFinished,
        isFetching: isFetching,
        isStopping: isStopping,
        col1TargetID: wheel1,
        col2TargetID: wheel2,
        col3TargetID: wheel3,
        getRandomNumber: getRandomNumber
      }
    })
  }, [isFetching, isStopping, wheel1, wheel2, wheel3])

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
              <button className="SpinButton" onClick={spin} disabled={!isFunded || isFetching || !user?.wallet}>
                    {isFetching ? "Spinning..." : (isFunded ? "Spin" : "Funding...")}
              </button>
          :
          undefined
        }
        </div>
      </div>
    </>
  )
}

export default App
