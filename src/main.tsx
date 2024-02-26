import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
//import eruda from 'eruda'

import { type Chain } from '@wagmi/chains';

//New chain

const incoChain: Chain = {
 id: 9090,
 network: "Inco Network",
 name: "Inco",
 nativeCurrency: {
     name: "IncoEther",
     symbol: "INCO",
     decimals: 18,
  },
 rpcUrls: {
     default: {
         http: ["https://testnet.inco.org/"],
      },
     public: {
         http: ["https://testnet.inco.org/"],
      },
  },
 blockExplorers: {
     default: {
         name: "Explorer",
         url: "https://explorer.inco.org/",
      },
  },
};

import WebApp from '@twa-dev/sdk';

import {PrivyProvider} from '@privy-io/react-auth';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleLogin = (user: any) => {
  console.log(`User ${user.id} logged in!`)
}

WebApp.ready();
//eruda.init();

let loginMethods = ['sms', 'email', 'discord'];

if (WebApp.platform === "weba" || WebApp.platform === "webk") {
  loginMethods = ['google', ...loginMethods];
}
if (WebApp.platform !== "android" && WebApp.platform !== "ios") {
  loginMethods = ['wallet', ...loginMethods];
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <PrivyProvider
        appId="clpyhx1kt00zhky0g7hyv24g1"
        onSuccess={handleLogin}
        config={{
          loginMethods: loginMethods as ("sms" | "email" | "discord" | "wallet" | "google" | "twitter" | "github" | "linkedin" | "tiktok" | "apple")[],
          appearance: {
            theme: 'light',
            accentColor: '#676FFF',
            logo: 'https://your-logo-url',
          },
          supportedChains: [incoChain],
        }}>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </PrivyProvider>,
)
