/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRef, useLayoutEffect, useState} from 'react'
import './App.scss'

import { Contract } from "ethers";
import abi from "./assets/abi.json";

//import WebApp from '@twa-dev/sdk'
import {usePrivy, useWallets} from '@privy-io/react-auth';
import truncateEthAddress from 'truncate-eth-address';

import WalletIcon from './assets/wallet_icon.svg';
import SlotMachine from './SlotMachine.svelte';

import CookieConsent, { getCookieConsentValue } from "react-cookie-consent";

function App() {
  const {ready, user, login, logout, authenticated} = usePrivy();
  const [isCookiesEnabled, setCookiesEnabled] = useState(false);

  const [isSpinning, setIsSpinning] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  
  const { wallets } = useWallets();
  const w0 = wallets[0];
  if (w0) {
    w0.switchChain(9090);
  }
  
  const [wheel1, setWheel1] = useState(0);
  const [wheel2, setWheel2] = useState(0);
  const [wheel3, setWheel3] = useState(0);

  const walletAddress = truncateEthAddress(user?.wallet?.address || "");

  const getRandomNumber = async (): Promise<number> => {

    w0.address
    const provider = await w0?.getEthersProvider();
    const signer = await provider?.getSigner();

    const contract = new Contract('0x211422B33119e8E1d713A11eDEfd470e16E83064', abi, signer);
    const res = await contract.spin();

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
    setIsSpinning(true);
    setIsStopping(true);
  }

  const onSpinFinished = (c1: number, c2: number, c3: number) => {
    setIsSpinning(false);
    setIsStopping(false);
    setWheel1(c1);
    setWheel2(c2);
    setWheel3(c3);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const svelteRef = useRef<any>();

  useLayoutEffect(() => {
    setCookiesEnabled(getCookieConsentValue("cookieConsent") === "true");

    while (svelteRef.current.firstChild) {
      svelteRef.current.removeChild(svelteRef.current.firstChild);
    }
    
    new SlotMachine({
      target: svelteRef.current as Element,
      props: {
        onSpin: spin,
        onSpinFinished: onSpinFinished,
        isSpinning: isSpinning,
        isStopping: isStopping,
        col1TargetID: wheel1,
        col2TargetID: wheel2,
        col3TargetID: wheel3,
        getRandomNumber: getRandomNumber
      }
    })
  }, [isSpinning, isStopping, wheel1, wheel2, wheel3])

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
          ready && isCookiesEnabled?
              !authenticated ?
              <button className="LoginButton" onClick={login}>
                    Login to Play
              </button>
              :
              <button className="SpinButton" onClick={spin} disabled={isSpinning || !user?.wallet}>
                    {isSpinning ? "Spinning..." : "Spin"}
              </button>
          :
          undefined
        }
        </div>

        <CookieConsent
          overlay
          location="bottom"
          buttonText="Accept"
          cookieName="cookieConsent"
          style={{ background: "var(--tg-theme-bg-color)", borderTopLeftRadius: "1.5em", borderTopRightRadius: "1.5em", }}
          buttonStyle={{ background: "var(--tg-theme-button-color)", color: "var(--tg-theme-button-text-color)", fontSize: "13px" }}
          expires={150}
          onAccept={(_) => {
            setCookiesEnabled(true);
          }}
        >
          <div className="CookieConsent">This mini app uses cookies to enhance user experience.</div>
        </CookieConsent>
      </div>
    </>
  )
}

export default App
