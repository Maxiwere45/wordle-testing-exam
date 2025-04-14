import {describe, expect, test} from 'vitest'
import { checkGuess } from '../src/modules/services/GameLogicService.ts'

describe('GameLogic', () => {
    test('Guess the correct letters at the correct positions (green)', () => {
        // Arrange
        const guess = 'pomme';
        const word = 'pomme';

        // Act
        const result = checkGuess(guess, word);

        // Assert
        expect(result).toEqual(['green', 'green', 'green', 'green', 'green']);
    })

    test('Guess correct letters at the wrong positions (yellow)', () => {
        // Arrange
        const guess = 'tuile';
        const word = 'huile';

        // Act
        const result = checkGuess(guess, word);

        // Assert
        expect(result).toEqual(['gray', 'green', 'green', 'green', 'green']);
    })

    test('Guess wrong letters (gray)', () => {
        // Arrange
        const guess = 'caler';
        const word = 'puits';

        // Act
        const result = checkGuess(guess, word);

        // Assert
        expect(result).toEqual(['gray', 'gray', 'gray', 'gray', 'gray']);
    });

    test('handle duplicated letter efficiently', () => {
        // Arrange
        const guess = 'pomme';
        const word = 'femme';

        // Act
        const result = checkGuess(guess, word);

        // Assert
        expect(result).toEqual(['gray', 'gray', 'green', 'green', 'green']);
    })
})