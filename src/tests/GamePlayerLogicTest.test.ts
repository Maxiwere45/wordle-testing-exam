import { describe, test, expect, beforeEach } from "vitest";
import { WordleGame } from "../data/modules/WordleGame.ts";
import Player from "../data/modules/Player.ts";

// Fonction utilitaire pour simuler une partie gagnée
const playWinningGame = async (game: WordleGame, word: string[]) => {
    await game.loadWordle();
    game.play(word);
};

// Fonction utilitaire pour simuler une partie perdue
const playLosingGame = async (game: WordleGame, wrongWord: string[]) => {
    await game.loadWordle();
    for (let i = 0; i < 5; i++) game.play(wrongWord); // 5 tentatives perdantes
};

describe('Unit: WordleGame Player Logic', () => {
    describe('Score', () => {
        let game: WordleGame;
        let player: Player;

        beforeEach(async () => {
            player = new Player("scoreTester");
            game = new WordleGame({ loadWordle: async () => ['p', 'o', 'm', 'm', 'e'] }, 'normal', player);
        });

        test('computes score correctly for a single win', async () => {
            await playWinningGame(game, ['p', 'o', 'm', 'm', 'e']);
            expect(player.getScore()).toEqual(140);
        });
    });

    describe('Streak', () => {
        test('increments streak after two consecutive wins', async () => {
            const player = new Player("streakTester");
            const game1 = new WordleGame({ loadWordle: async () => ['t', 'u', 'i', 'l', 'e'] }, 'normal', player);
            await game1.loadWordle();
            const game2 = new WordleGame({ loadWordle: async () => ['p', 'o', 'm', 'm', 'e'] }, 'normal', player);
            await game2.loadWordle();

            await playWinningGame(game1, ['t', 'u', 'i', 'l', 'e']);
            await playWinningGame(game2, ['p', 'o', 'm', 'm', 'e']);

            expect(player.getStreaks()).toEqual(1); // Supposant que la logique de streak est cumulative
        });
    });

    describe('Attempts', () => {
        test('tracks attempts correctly for a single win', async () => {
            const player = new Player("attemptsTester");
            const game = new WordleGame({ loadWordle: async () => ['p', 'o', 'm', 'm', 'e'] }, 'normal', player);

            await playWinningGame(game, ['p', 'o', 'm', 'm', 'e']);
            expect(player.getAttempts()).toEqual([1]);
        });
    });

    describe('Win Rate', () => {
        test('calculates 100% win rate for two wins', async () => {
            const player = new Player("winRateTester");
            const game1 = new WordleGame({ loadWordle: async () => ['t', 'u', 'i', 'l', 'e'] }, 'normal', player);
            await game1.loadWordle();
            const game2 = new WordleGame({ loadWordle: async () => ['p', 'o', 'm', 'm', 'e'] }, 'normal', player);
            await game2.loadWordle();

            await playWinningGame(game1, ['t', 'u', 'i', 'l', 'e']);
            await playWinningGame(game2, ['p', 'o', 'm', 'm', 'e']);

            expect(player.getWinRate()).toEqual(100);
        });
    });

    describe('Games Played', () => {
        test('logs played games correctly', async () => {
            const player = new Player("gamesPlayedTester");
            const game = new WordleGame({ loadWordle: async () => ['p', 'o', 'm', 'm', 'e'] }, 'normal', player);

            await playWinningGame(game, ['p', 'o', 'm', 'm', 'e']);
            expect(player.getGamesPlayed()).toEqual([['p', 'o', 'm', 'm', 'e']]);
        });
    });

    describe('Games Won', () => {
        test('logs won games correctly', async () => {
            const player = new Player("gamesWonTester");
            const game = new WordleGame({ loadWordle: async () => ['p', 'o', 'm', 'm', 'e'] }, 'normal', player);

            await playWinningGame(game, ['p', 'o', 'm', 'm', 'e']);
            expect(player.getGamesWon()).toEqual([['p', 'o', 'm', 'm', 'e']]);
        });
    });

    describe('Average Attempts', () => {
        test('computes average attempts across multiple games', async () => {
            const player = new Player("avgAttemptsTester");
            const game1 = new WordleGame({ loadWordle: async () => ['t', 'u', 'i', 'l', 'e'] }, 'normal', player);
            const game2 = new WordleGame({ loadWordle: async () => ['p', 'o', 'm', 'm', 'e'] }, 'normal', player);
            const game3 = new WordleGame({ loadWordle: async () => ['p', 'l', 'u', 'm', 'e'] }, 'normal', player);

            await playWinningGame(game1, ['t', 'u', 'i', 'l', 'e']); // 1 tentative
            await playWinningGame(game2, ['p', 'o', 'm', 'm', 'e']); // 1 tentative
            await game3.loadWordle();
            game3.play(['p', 'o', 'm', 'm', 'e']); // Mauvaise tentative
            game3.play(['p', 'l', 'u', 'm', 'e']); // Bonne, 2 tentatives

            expect(player.computeAverageAttempts()).toBeCloseTo(1.33, 2); // (1 + 1 + 2) / 3 ≈ 1.33
        });
    });

    describe('Games Lost', () => {
        test('logs lost games correctly', async () => {
            const player = new Player("gamesLostTester");
            const game1 = new WordleGame({ loadWordle: async () => ['t', 'u', 'i', 'l', 'e'] }, 'normal', player);
            const game2 = new WordleGame({ loadWordle: async () => ['p', 'o', 'm', 'm', 'e'] }, 'normal', player);

            await playLosingGame(game1, ['p', 'o', 'm', 'm', 'e']);
            await playLosingGame(game2, ['t', 'u', 'i', 'l', 'e']);

            expect(player.getGamesLost()).toEqual([['p', 'o', 'm', 'm', 'e'], ['t', 'u', 'i', 'l', 'e']]);
        });
    });
});