import {describe, expect, test} from "vitest";
import WordleGame from "../src/modules/WordleGame";
import Player from "../src/entites/Player";

describe('PlayerGameLogic', () => {

    test('Should reject the word is not 5 letters long on play', async () => {
        // Arrange
        const player = new Player("testPlayer");
        const game = new WordleGame(
            {loadWordle: async () => 'pomme'},
            {
                loadDictionary: async () => ['pomme', 'poire', 'banane', 'tuile', 'tigre', 'femme'],
            },
            player
        );
        await game.loadWordle();

        // Act & Assert
        await expect(game.play('deux')).rejects.toThrow('Le mot doit avoir 5 lettres !');
    });

    test('Should reject the word contains non-letter characters on play', async () => {
        // Arrange
        const player = new Player("testPlayer");
        const game = new WordleGame(
            {loadWordle: async () => 'pomme'},
            {
                loadDictionary: async () => ['pomme', 'poire', 'banane', 'tuile', 'tigre', 'femme'],
            },
            player
        );
        await game.loadWordle();

        // Act & Assert
        await expect(game.play('jaun1')).rejects.toThrow('Le mot doit uniquement contenir des lettres !');
    });

    test('Should reject the word is not in the dictionary on play', async () => {
        // Arrange
        const player = new Player("testPlayer");
        const game = new WordleGame(
            {loadWordle: async () => 'pomme'},
            {
                loadDictionary: async () => ['pomme', 'poire', 'banane', 'tuile', 'tigre', 'femme'],
            },
            player
        );
        await game.loadWordle();

        // Act & Assert
        await expect(game.play('jaune')).rejects.toThrow('Le mot n\'est pas dans le dictionnaire !');
    });

    test("Player's wins should be updated after a win", async () => {
        // Arrange
        const player = new Player("testPlayer");
        const game = new WordleGame(
            {loadWordle: async () => 'pomme'},
            {
                loadDictionary: async () => ['pomme', 'poire', 'banane', 'tuile', 'tigre', 'femme'],
            },
            player
        );
        await game.loadWordle();

        // Act
        await game.play('pomme');

        // Assert
        expect(player.getWins()).toEqual(1);
    });

    test("Player's losses should be updated after a loss", async () => {
        // Arrange
        const player = new Player("testPlayer");
        const game = new WordleGame(
            {loadWordle: async () => 'pomme'},
            {
                loadDictionary: async () => ['pomme', 'poire', 'banane', 'tuile', 'tigre', 'femme'],
            },
            player
        );
        await game.loadWordle();

        // Act
        for (let i = 0; i < 6; i++) {
            await game.play('tigre');
        }

        // Assert
        expect(player.getLosses()).toEqual(1);
    });

    test("Player's total games should be updated after a game", async () => {
        // Arrange
        const player = new Player("testPlayer");
        const game = new WordleGame(
            {loadWordle: async () => 'pomme'},
            {
                loadDictionary: async () => ['pomme', 'poire', 'banane', 'tuile', 'tigre', 'femme'],
            },
            player
        );
        await game.loadWordle();

        // Act
        await game.play('pomme');

        // Assert
        expect(player.getGamesPlayed().length).toEqual(1);
    });

    test("Player's average attempts should be updated after a game", async () => {
        // Arrange
        const player = new Player("testPlayer");
        const game = new WordleGame(
            {loadWordle: async () => 'pomme'},
            {
                loadDictionary: async () => ['pomme', 'poire', 'banane', 'tuile', 'tigre', 'femme'],
            },
            player
        );
        await game.loadWordle();

        // Act
        await game.play('pomme');

        // Assert
        expect(player.getAverageAttempts()).toEqual(1);
    });

    test("Player's win rate should be updated after a game", async () => {
        // Arrange
        const player = new Player("testPlayer");
        const game = new WordleGame(
            {loadWordle: async () => 'pomme'},
            {
                loadDictionary: async () => ['pomme', 'poire', 'banane', 'tuile', 'tigre', 'femme'],
            },
            player
        );
        await game.loadWordle();

        // Act
        await game.play('pomme');

        // Assert
        expect(player.getWinRate()).toEqual(100);
    });

    test("Player's streak should be updated to 1 after 2 wins", async () => {
        // Arrange
        const player = new Player("testPlayer");
        expect(player.getStreaks()).toEqual(0);

        // Game 1
        const game1 = new WordleGame(
            {loadWordle: async () => 'pomme'},
            {
                loadDictionary: async () => ['pomme', 'poire', 'banane', 'tuile', 'tigre', 'femme'],
            },
            player
        );
        await game1.loadWordle();

        // Act & Assert game 1
        await game1.play('pomme');
        expect(player.getWins()).toEqual(1);
        expect(player.getStreaks()).toEqual(0);

        // Game 2
        const game2 = new WordleGame(
            {loadWordle: async () => 'poire'},
            {
                loadDictionary: async () => ['pomme', 'poire', 'banane', 'tuile', 'tigre', 'femme'],
            },
            player
        );
        await game2.loadWordle();

        // Act & Assert game 2
        await game2.play('poire');
        expect(player.getWins()).toEqual(2);
        expect(player.getStreaks()).toEqual(1);
    });

    test("Player's score should be updated after a game", async () => {
        // Arrange
        const player = new Player("testPlayer");
        const game = new WordleGame(
            {loadWordle: async () => 'pomme'},
            {
                loadDictionary: async () => ['pomme', 'poire', 'banane', 'tuile', 'tigre', 'femme'],
            },
            player
        );
        await game.loadWordle();

        // Act
        await game.play('pomme');

        // Assert
        expect(player.getScore()).toEqual(100);
    });
});
