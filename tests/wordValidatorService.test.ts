import {describe, expect, test} from 'vitest'
import {WordValidationRules, WordValidationService} from '../src/modules/services/WordValidatorService.ts'

describe('WordValidatorService', () => {
    const rules = WordValidationRules;

    test('Word should be 5 letter long', async () => {
        // Arrange
        const wrongWord = "Banane";
        const rightWord = "Pomme";
        const service = new WordValidationService([rules.exactLen]);

        // Act
        const wrongResult = await service.validate(wrongWord);
        const rightResult = await service.validate(rightWord);

        // Assert
        expect(wrongResult).toBe(false);
        expect(rightResult).toBe(true);
    });

    test('Word should be alphanumeric', async () => {
        // Arrange
        const wrongWord = "spel5";
        const rightWord = "Pomme";
        const service = new WordValidationService([rules.onlyLetters]);

        // Act
        const wrongResult = await service.validate(wrongWord);
        const rightResult = await service.validate(rightWord);

        // Assert
        expect(wrongResult).toBe(false);
        expect(rightResult).toBe(true);
    });

    test('World should be in the dictionary', async () => {
        // Arrange
        const wrongWord = "Banane";
        const rightWord = "Pomme";
        const service = new WordValidationService([rules.inDictionary], { loadDictionary: async () => ['Pomme', 'Poire'] });

        // Act
        const wrongResult = await service.validate(wrongWord);
        const rightResult = await service.validate(rightWord);

        // Assert
        expect(wrongResult).toBe(false);
        expect(rightResult).toBe(true);
    });
});