import {describe, expect, test} from "vitest";
import WordleGame from "../src/modules/WordleGame";
import Player from "../src/entites/Player";

describe('PlayerGameLogic', () => {
    const dictionary = {
        loadDictionaryWords: async () => ['pomme', 'poire', 'banane', 'tuile', 'tigre', 'femme'],
    };

    test("Player's wins should be updated after a win", async () => {
        // Arrange
        const player = new Player("testPlayer");
        const game = new WordleGame(
            { loadWordle: async () => 'pomme' },
            dictionary.loadDictionaryWords(),
            player
        );
        await game.loadWordle();

        // Act
        game.play('pomme');

        // Assert
        expect(player.getWins()).toEqual(1);
    });

    test("Player's losses should be updated after a loss", async () => {
        // Arrange
        const player = new Player("testPlayer");
        const game = new WordleGame(
            { loadWordle: async () => 'pomme' },
            dictionary.loadDictionaryWords(),
            player
        );
        await game.loadWordle();

        // Act
        for (let i = 0; i < 6; i++) {
            game.play('tigre');
        }

        // Assert
        expect(player.getLosses()).toEqual(1);
    });

    test("Player's total games should be updated after a game", async () => {
        // Arrange
        const player = new Player("testPlayer");
        const game = new WordleGame(
            { loadWordle: async () => 'pomme' },
            dictionary.loadDictionaryWords(),
            player
        );
        await game.loadWordle();

        // Act
        game.play('pomme');

        // Assert
        expect(player.getGamesPlayed().length).toEqual(1);
    });

    test("Player's average attempts should be updated after a game", async () => {
        // Arrange
        const player = new Player("testPlayer");
        const game = new WordleGame(
            { loadWordle: async () => 'pomme' },
            dictionary.loadDictionaryWords(),
            player
        );
        await game.loadWordle();

        // Act
        game.play('pomme');

        // Assert
        expect(player.getAverageAttempts()).toEqual(1);
    });

    test("Player's win rate should be updated after a game", async () => {
        // Arrange
        const player = new Player("testPlayer");
        const game = new WordleGame(
            { loadWordle: async () => 'pomme' },
            dictionary.loadDictionaryWords(),
            player
        );
        await game.loadWordle();

        // Act
        game.play('pomme');

        // Assert
        expect(player.getWinRate()).toEqual(100);
    });

    test("Player's streak should be updated to 1 after 2 wins", async () => {
        // Arrange
        const player = new Player("testPlayer");
        const game1 = new WordleGame(
            { loadWordle: async () => 'pomme' },
            dictionary.loadDictionaryWords(),
            player
        );
        await game1.loadWordle();
        const game2 = new WordleGame(
            { loadWordle: async () => 'poire' },
            dictionary.loadDictionaryWords(),
            player
        );
        await game2.loadWordle();

        // Act
        game1.play('pomme');
        game2.play('poire');

        // Assert
        expect(player.getStreaks()).toEqual(1);
    });

    test("Player's score should be updated after a game", async () => {
        // Arrange
        const player = new Player("testPlayer");
        const game = new WordleGame(
            { loadWordle: async () => 'pomme' },
            dictionary.loadDictionaryWords(),
            player
        );
        await game.loadWordle();

        // Act
        game.play('pomme');

        // Assert
        expect(player.getScore()).toEqual(100);
    });
});
