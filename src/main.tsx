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
         http: ["https://evm-rpc.inco.network/"],
      },
     public: {
         http: ["https://evm-rpc.inco.network/"],
      },
  },
 blockExplorers: {
     default: {
         name: "Explorer",
         url: "https://explorer.inco.network/",
      },
  },
};

import WebApp from '@twa-dev/sdk'

import {PrivyProvider} from '@privy-io/react-auth';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleLogin = (user: any) => {
  console.log(`User ${user.id} logged in!`)
}

WebApp.ready();
//eruda.init();


ReactDOM.createRoot(document.getElementById('root')!).render(
  <PrivyProvider
        appId="clnkryb030404jr0f78yjv56n"
        onSuccess={handleLogin}
        config={{
          loginMethods: ['wallet', 'email', 'google', 'discord'],
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
