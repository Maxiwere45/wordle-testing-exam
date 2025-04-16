import './style.css';
import WordleGame from './modules/WordleGame.ts';
import {checkGuess} from "./modules/services/GameLogicService.ts";
import Player from "./entites/Player.ts";
import {DictionaryApiService} from "./modules/repositories/DictionnaryApiService.ts";
import {WordleApiService} from "./modules/repositories/WordleApiService.ts";


const dictionaryService = DictionaryApiService();
const wordleService = WordleApiService();
let username: string | null = null;
let player: Player;
let game: WordleGame;

window.addEventListener('load', async () => {
    username = window.prompt("Nom d'utilisateur:");
    if (username) {
        alert(`Bienvenue, ${username}!`);
    } else {
        alert("Aucun nom d'utilisateur fourni. Utilisation de 'Anonymous'.");
        username = 'Anonymous';
    }

    player = new Player(username);
    game = new WordleGame(wordleService, dictionaryService, player);

    await game.loadWordle();
});

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="container">
    <header class="header">
      <h1 class="title">WORDLE</h1>
      <button id="statsBtn" class="stats-button">📊</button>
    </header>
    <div class="input-row">
      <input maxlength="1" class="letter-input" type="text" />
      <input maxlength="1" class="letter-input" type="text" />
      <input maxlength="1" class="letter-input" type="text" />
      <input maxlength="1" class="letter-input" type="text" />
      <input maxlength="1" class="letter-input" type="text" />
    </div>
    <button id="submitBtn" hidden="hidden">Submit</button>
    <button id="resetBtn" class="reset-button" hidden="hidden">Nouvelle partie</button>
    <div id="feedback"></div>
  </div>
  <footer>
  Wordle Testing Exam crée par ANRIFOU Amdjad &copy; 2025
</footer>
`;

document.getElementById('statsBtn')?.addEventListener('click', () => {
    const statsWindow = window.open('', '_blank', 'width=500,height=600');
    if (statsWindow) {
        const historyRows = player.getGamesPlayed()
            .map(game => `<tr><td>${game.word}</td><td>${game.attempts}</td><td>${game.result ? '✅' : '❌'}</td></tr>`)
            .join('');

        statsWindow.document.write(`
      <html lang="fr">
        <head>
          <title>Stats de ${player.getUsername()}</title>
          <style>
            body { font-family: sans-serif; background: #121213; color: white; padding: 20px; }
            h1 { color: #e3c436; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #444; padding: 8px; text-align: center; }
            th { background-color: #222; }
          </style>
        </head>
        <body>
          <h1>Stats de ${player.getUsername()}</h1>
          <p>🏆 Victoires : ${player.getWins()}</p>
          <p>💀 Défaites : ${player.getLosses()}</p>
          <p>🔥 Streak : ${player.getStreaks()}</p>
          <p>📊 Taux de victoire : ${player.getWinRate().toFixed(1)}%</p>
          <p>🎯 Tentatives moyennes : ${player.getAverageAttempts().toFixed(2)}</p>
          <p>💯 Score : ${player.getScore()}</p>
          <h2>Historique des parties</h2>
          <table>
            <thead><tr><th>Mot</th><th>Tentatives</th><th>Résultat</th></tr></thead>
            <tbody>${historyRows}</tbody>
          </table>
        </body>
      </html>
    `);
    }
});

const inputs = document.querySelectorAll<HTMLInputElement>('.letter-input');
const submitBtn = document.getElementById('submitBtn')!;
const feedbackDiv = document.getElementById('feedback')!;
const resetBtn = document.getElementById('resetBtn')!;

inputs.forEach((input, i) => {
    input.addEventListener('input', () => {
        if (!/^[a-zA-Z]$/.test(input.value)) {
            input.value = '';
            return;
        }

        if (input.value && i < inputs.length - 1) {
            inputs[i + 1].focus();
        }
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !input.value && i > 0) {
            inputs[i - 1].focus();
        }
    });
});

// Effectuer la vérification de la saisie après le click sur ENTER du clavier
inputs.forEach((input) => {
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            submitBtn.click();
        }
    });
});

submitBtn.addEventListener('click', async () => {
    const guess = Array.from(inputs).map(i => i.value.toLowerCase()).join('');
    try {
        await game.isValidWord(guess);
    } catch (e: any) {
        alert(e.message);
        return;
    }

    const result = game.play(guess);
    const feedback = checkGuess(guess, game.getWordle()!);

    feedback.forEach((status, i) => {
        const input = inputs[i];
        input.classList.remove('green', 'yellow', 'gray');
        input.classList.add(status);
    });

    if (result === 1) {
        feedbackDiv.textContent = '🎉 Bravo ! Tu as gagné !';
        submitBtn.setAttribute('disabled', 'true');
        document.getElementById('resetBtn')!.removeAttribute('hidden');
    } else if (result === -1) {
        feedbackDiv.textContent = `❌ Perdu ! Le mot était "${game.getWordle()}"`;
        document.getElementById('resetBtn')!.removeAttribute('hidden');
    } else if (result === -2) {
        feedbackDiv.textContent = `⚠️ Plus de tentatives !`;
        submitBtn.setAttribute('disabled', 'true');
    } else {
        feedbackDiv.textContent = `Il te reste ${game.getAttemptsRemaining()} tentatives.`;
        inputs.forEach(input => input.value = '');
        inputs[0].focus();
    }
});

resetBtn.addEventListener('click', async () => {
    await game.resetGame(wordleService, dictionaryService);
    inputs.forEach(input => {
        input.value = '';
        input.classList.remove('green', 'yellow', 'gray');
    });
    feedbackDiv.textContent = '';
    resetBtn.setAttribute('hidden', 'hidden');
    submitBtn.removeAttribute('disabled');
});

