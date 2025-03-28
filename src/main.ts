import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
import {WordleGame} from "./data/modules/WordleGame.ts";
import Player from "./data/modules/Player.ts";

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`;

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!);

// Main game
let player = new Player("Amdjad");
let wordleGame = new WordleGame({ loadWordle: async () => ['p', 'o', 'm', 'm', 'e'] }, 'normal', player);

(async () => {
    await wordleGame.loadWordle();

    wordleGame.play(['p', 'o', 'm', 'm', 'e']);
    console.log(player.getAttempts());
})();

let wordleGame2 = new WordleGame({ loadWordle: async () => ['t', 'u', 'i', 'l', 'e'] }, 'normal', player);
(async () => {
    await wordleGame2.loadWordle();

    wordleGame2.play(['p', 'e', 'u', 'e', 'e']);
    console.log(wordleGame2.getColorsChecking());
    wordleGame2.play(['t', 'u', 'i', 'l', 'e']);
    console.log(wordleGame2.getColorsChecking());
    console.log(player.getAttempts());
    console.log(player.getStreaks());
    console.log(player.getScore());
})();




