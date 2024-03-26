# IncoHangman

Play a classical Hangman game on Inco - a privacy focused blockchain with fully homomorphic encryption and on-chain randomness. Rules are simple: guess a 4 letter word one letter at a time before the picture completes after 11 wrong guesses.

Written with React + Svelte.


# Dependencies
The project uses the following dependencies:

- [@privy-io/react-auth](https://www.npmjs.com/package/@privy-io/react-auth) for the Privy overlay
- [@twa-dev/sdk](https://www.npmjs.com/package/@twa-dev/sdk) for Telegram Web API

# How it works
The game is written using two frameworks:
- React for the Privy overlay.
- Svelte for the game UI.

App.tsx is managing state, using Privy hooks, connects to Inco and sends transactions, makes calls to faucet, etc.
Game.svelte is rendering the game graphics and animations.

# How to run locally
To run the project locally, run the following commands:
```bash
npm install
npm start
```

# How to deploy
This project is deployed on GitHub Pages. To deploy, install github CLI
```bash
npm install -g gh
```
Then run

```bash
npm run deploy
```
