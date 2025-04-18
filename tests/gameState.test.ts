import {describe, expect, test} from 'vitest'
import WordleGame from "../src/modules/WordleGame"

describe('GameState', () => {
    const dictionaryService = {
        loadDictionary: async () => ['pomme', 'poire', 'menus', 'tuile', 'tigre', 'femme'],
    };

    test('Should block the game if the word is not loaded', async () => {
        // Arrange
        const game = new WordleGame({loadWordle: async () => 'pomme'}, dictionaryService);

        // Act & Assert
        await expect(game.play('pomme')).rejects.toThrow('Wordle not loaded');
    });

    test('Should reject the word is not five letters long on load', async () => {
        // Arrange
        const game = new WordleGame({loadWordle: async () => 'pomm'}, dictionaryService);

        // Act & Assert
        await expect(game.loadWordle()).rejects.toThrow('Le mot doit avoir 5 lettres !');
    });

    test('Should reject the word is not alphabetic on load', async () => {
        // Arrange
        const game = new WordleGame({loadWordle: async () => 'p0mme'}, dictionaryService);

        // Act & Assert
        await expect(game.loadWordle()).rejects.toThrow('Le mot doit uniquement contenir des lettres !');
    });

    test('Should reject the word is not in the dictionary on load', async () => {
        // Arrange
        const game = new WordleGame({loadWordle: async () => 'jaune'}, dictionaryService);

        // Act & Assert
        await expect(game.loadWordle()).rejects.toThrow('Le mot n\'est pas dans le dictionnaire !');
    });

    test('Reduce the number of attempts after each attempt', async () => {
        // Arrange
        const game = new WordleGame({loadWordle: async () => 'pomme'}, dictionaryService);
        await game.loadWordle();

        // Act
        await game.play('tuile');

        // Assert
        expect(game.getAttemptsRemaining()).toBe(4);
    });

    test('Detect a continuation if the word is not found', async () => {
        // Arrange
        const game = new WordleGame({loadWordle: async () => 'poire'}, dictionaryService);
        await game.loadWordle();

        // Act
        const result = await game.play('menus');

        // Assert
        expect(result).toBe(0);
    });

    test('Detect a won if the word is found', async () => {
        // Arrange
        const game = new WordleGame({loadWordle: async () => 'pomme'}, dictionaryService);
        await game.loadWordle();

        // Act
        const result = await game.play('pomme');

        // Assert
        expect(result).toBe(1);
        expect(game.isGameWon()).toBe(true);
        expect(game.isGameOver()).toBe(false);
    })

    test('Detect the game over after 6 attempts', async () => {
        // Arrange
        const game = new WordleGame({loadWordle: async () => 'poire'}, dictionaryService);
        await game.loadWordle();

        // Act
        for (let i = 0; i < 4; i++) {
            await game.play('tigre');
        }

        const result = await game.play('tigre');

        // Assert
        expect(result).toBe(-1);
        expect(game.isGameOver()).toBe(true);
        expect(game.isGameWon()).toBe(false);
    });

    test('Block the game after 6 attempts', async () => {
        // Arrange
        const game = new WordleGame({loadWordle: async () => 'pomme'}, dictionaryService);
        await game.loadWordle();

        // Act
        for (let i = 0; i < 6; i++) {
            await game.play('tigre');
        }

        const result = await game.play('tigre');

        // Assert
        expect(result).toBe(-2);
        expect(game.isGameOver()).toBe(true);
        expect(game.isGameWon()).toBe(false);
    });

    test('Reset the game state', async () => {
        // Arrange
        const game = new WordleGame({loadWordle: async () => 'tigre'}, dictionaryService);
        await game.loadWordle();

        // Act
        await game.play('tigre');
        await game.resetGame({loadWordle: async () => 'poire'}, dictionaryService);

        // Assert
        expect(game.getWordle()).toBe('poire');
        expect(game.getAttemptsRemaining()).toBe(5);
        expect(game.isGameOver()).toBe(false);
        expect(game.isGameWon()).toBe(false);
    });
});