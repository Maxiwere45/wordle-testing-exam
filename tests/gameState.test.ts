import {describe, expect, test} from 'vitest'
import WordleGame from "../src/modules/WordleGame"

describe('GameState', () => {
    const dictionary = {
        loadDictionaryWords: async () => ['pomme', 'poire', 'banane']
    };

    test('Reduce the number of attempts after each play', async () => {
        // Arrange
        const game = new WordleGame({ loadWordle: async () => 'pomme' }, dictionary.loadDictionaryWords());
        await game.loadWordle();

        // Act
        game.play('tuile');

        // Assert
        expect(game.getAttemptsRemaining()).toBe(4);
    });

    test('Detect a continuation if the word is not found', async () => {
        // Arrange
        const game = new WordleGame({ loadWordle: async () => 'pomme' }, dictionary.loadDictionaryWords());
        await game.loadWordle();

        // Act
        const result = game.play('banane');

        // Assert
        expect(result).toBe(0);
    });

    test('Detect a won if the word is found', async () => {
        // Arrange
        const game = new WordleGame({ loadWordle: async () => 'pomme' }, dictionary.loadDictionaryWords());
        await game.loadWordle();

        // Act
        const result = game.play('pomme');

        // Assert
        expect(result).toBe(1);
        expect(game.isGameWon()).toBe(true);
        expect(game.isGameOver()).toBe(false);
    })

    test('Detect the game over after 6 attempts', async () => {
        // Arrange
        const game = new WordleGame({ loadWordle: async () => 'pomme' }, dictionary.loadDictionaryWords());
        await game.loadWordle();

        // Act
        for (let i = 0; i < 4; i++) {
            game.play('tigre');
        }

        const result = game.play('tigre');

        // Assert
        expect(result).toBe(-1);
        expect(game.isGameOver()).toBe(true);
        expect(game.isGameWon()).toBe(false);
    });

    test('Block the game after 6 attempts', async () => {
        // Arrange
        const game = new WordleGame({ loadWordle: async () => 'pomme' }, dictionary.loadDictionaryWords());
        await game.loadWordle();

        // Act
        for (let i = 0; i < 6; i++) {
            game.play('tigre');
        }

        const result = game.play('tigre');

        // Assert
        expect(result).toBe(-2);
        expect(game.isGameOver()).toBe(true);
        expect(game.isGameWon()).toBe(false);
    });
});