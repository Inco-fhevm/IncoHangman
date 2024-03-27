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
## Frontend
First, install cloudflared:
```bash
npm i -g cloudflared
```
Then run:
```bash
cloudflared tunnel --url http://localhost:5173
```
This will give you a temporary URL pointing to your local server, hold on to it for now and keep the terminal window open.

To run the project locally, run the following commands:
```bash
npm install
npm start
```

## Setup the telegram bot
Open telegram and search for the BotFather and initiate chat with it. Create a new bot:
```
[You] - Accept

[You] - /newbot
... complete the steps until BotFather responds with the following:
[BotFather] - Done! Congratulations on your new bot. You will find it at t.me/<Bot Username>. 

Then do the following:
/mybots
... BotFather will respond with a list of all your bots.
Choose your newly created bot then press
Bot Settings -> Menu Button -> Edit Menu Button URL

Now respond with the URL provided to you by cloudflared.
```
Your bot should now be playable. Go to your bot, press "start" and play the game.


# How to deploy
## Frontend
This project is deployed on GitHub Pages. To deploy, install github CLI
```bash
npm install -g gh
```
Then run

```bash
npm run deploy
```

Go to your github repository settings and enable GitHub Pages. Set the source to gh-pages branch.
Your game should now be live at https://<username>.github.io/<repo-name>


## Setup the telegram bot
Open telegram and search for the BotFather and initiate chat with it. Create a new bot:
```
[You] - Accept

[You] - /newbot
... complete the steps until BotFather responds with the following:
[BotFather] - Done! Congratulations on your new bot. You will find it at t.me/<Bot Username>. 

Then do the following:
/mybots
... BotFather will respond with a list of all your bots.
Choose your newly created bot then press
Bot Settings -> Menu Button -> Edit Menu Button URL

Now respond with the URL pointing to your repos github page https://<username>.github.io/<repo-name>.
```
Your bot should now be playable. Go to your bot, press "start" and play the game.

