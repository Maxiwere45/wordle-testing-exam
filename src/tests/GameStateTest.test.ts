import { describe, test, expect, beforeEach } from "vitest";
import { WordleGame } from "../data/modules/WordleGame.ts";

// Fonction utilitaire pour jouer plusieurs tentatives perdantes
const playMultipleAttempts = (game: WordleGame, attempts: string[][]) => {
    attempts.forEach(attempt => game.play(attempt));
};

describe('Unit: WordleGame State', () => {
    let game: WordleGame;

    beforeEach(async () => {
        game = new WordleGame({ loadWordle: async () => ['p', 'o', 'm', 'm', 'e'] });
        await game.loadWordle();
    });

    test('starts with counter at 0', () => {
        expect(game.getCounter()).toEqual(0);
    });

    test('increments counter to 1 after first wrong attempt', () => {
        game.play(['p', 'o', 'i', 'r', 'e']);
        expect(game.getCounter()).toEqual(1);
    });

    test('reaches counter 5 after five wrong attempts', () => {
        const wrongAttempts = [
            ['p', 'o', 'i', 'r', 'e'],
            ['w', 'a', 'g', 'o', 'n'],
            ['v', 'e', 's', 't', 'e'],
            ['t', 'o', 't', 'e', 'm'],
            ['c', 'r', 'e', 'm', 'e'],
        ];
        playMultipleAttempts(game, wrongAttempts);
        expect(game.getCounter()).toEqual(5);
    });

    test('returns -2 when forcing play after five attempts', () => {
        const wrongAttempts = [
            ['w', 'a', 'g', 'o', 'n'],
            ['v', 'e', 's', 't', 'e'],
            ['t', 'o', 't', 'e', 'm'],
            ['c', 'r', 'e', 'm', 'e'],
            ['c', 'r', 'e', 'm', 'e'],
        ];
        playMultipleAttempts(game, wrongAttempts);
        const result = game.play(['p', 'o', 'i', 'r', 'e']);
        expect(result).toEqual(-2);
    });
});