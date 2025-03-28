import { describe, test, expect, beforeEach } from "vitest";
import { WordleGame } from "../data/modules/WordleGame.ts";

describe('Unit: WordValidator', () => {
    let game: WordleGame;

    beforeEach(async () => {
        game = new WordleGame({ loadWordle: async () => ['t', 'u', 'i', 'l', 'e'] });
        await game.loadWordle();
    });

    describe('Length Validation', () => {
        test('accepts 5-letter words', () => {
            const result = game.isValidWord(['t', 'u', 'i', 'l', 'e']);
            expect(result).toEqual(true);
        });

        test('rejects words longer than 5 letters', () => {
            expect(() => game.isValidWord(['t', 'u', 'i', 'l', 'e', 's']))
                .toThrow('Word should only have 5 letters');
        });

        test('rejects words shorter than 5 letters', () => {
            expect(() => game.isValidWord(['l', 'i', 't']))
                .toThrow('Word should only have 5 letters');
        });
    });

    describe('Content Validation', () => {
        test('rejects words with numbers', () => {
            expect(() => game.isValidWord(['t', 'u', 'i', 'l', '3']))
                .toThrow('Word should only have letters');
        });

        test('rejects words with spaces', () => {
            expect(() => game.isValidWord(['t', 'u', 'i', 'l', ' ']))
                .toThrow('Word should not have spaces');
        });
    });
});