import { describe, test, expect, beforeEach } from "vitest";
import { WordleGame } from "../data/modules/WordleGame.ts";

// Fonction utilitaire pour jouer une tentative et récupérer le résultat et les couleurs
const playAndCheck = (game: WordleGame, word: string[]) => {
    const result = game.play(word);
    const colors = game.getColorsChecking();
    return { result, colors };
};

describe('Unit: WordleGame Logic', () => {
    let game: WordleGame;

    beforeEach(async () => {
        game = new WordleGame({ loadWordle: async () => ['p', 'o', 'm', 'm', 'e'] });
        await game.loadWordle();
    });

    describe('Color Logic', () => {
        test('colors all green for correct word', () => {
            game.getRightLetterRightPosition(['p', 'o', 'm', 'm', 'e']);
            expect(game.getColorsChecking()).toEqual(['green', 'green', 'green', 'green', 'green']);
        });

        test('colors yellow for right letter in wrong position', () => {
            game.getRightLetterRightPosition(['t', 'u', 'i', 'l', 'e']);
            game.getIncludedLettersInWrongPosition(['t', 'r', 'o', 'n', 'e']);
            expect(game.getColorsChecking()).toEqual(['gray', 'gray', 'yellow', 'gray', 'green']);
        });

        test('colors correctly with included letters', () => {
            const { colors } = playAndCheck(game, ['o', 'm', 'i', 's', 'e']);
            expect(colors).toEqual(['yellow', 'yellow', 'gray', 'gray', 'green']);
        });

        test('handles letter duplication in colors', () => {
            const { colors } = playAndCheck(game, ['e', 'm', 'i', 's', 'e']);
            expect(colors).toEqual(['gray', 'yellow', 'gray', 'gray', 'green']);
        });
    });

    describe('Game Result Logic', () => {
        test('returns 1 for correct word on first try', () => {
            const { result } = playAndCheck(game, ['p', 'o', 'm', 'm', 'e']);
            expect(result).toEqual(1);
            expect(game.getColorsChecking()).toEqual(['green', 'green', 'green', 'green', 'green']);
        });

        test('returns 0 with partial colors on wrong first try', () => {
            const { result, colors } = playAndCheck(game, ['p', 'o', 'i', 'r', 'e']);
            expect(result).toEqual(0);
            expect(colors).toEqual(['green', 'green', 'gray', 'gray', 'green']);
        });

        test('returns 1 after two wrong tries', () => {
            playAndCheck(game, ['w', 'a', 'g', 'o', 'n']);
            playAndCheck(game, ['v', 'e', 's', 't', 'e']);
            const { result, colors } = playAndCheck(game, ['p', 'o', 'm', 'm', 'e']);
            expect(result).toEqual(1);
            expect(colors).toEqual(['green', 'green', 'green', 'green', 'green']);
        });
    });
});