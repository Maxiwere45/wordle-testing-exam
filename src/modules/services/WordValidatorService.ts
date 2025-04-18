export type WordValidationRule = (word: string, dictionaryWord?: string[]) => boolean;
type Rule = WordValidationRule;

/**
 * Worldle validation rules
 * @description Rules to validate a word
 */
export const WordValidationRules = {
    // should only have 5 letters
    exactlen: (word: string): boolean => word.length == 5,
    // should only have letters
    onlyletters: (word: string): boolean => /^[a-zA-Z]+$/.test(word),
    // Should be in the dictionary
    inDictionary: (word: string, dictionaryWord?: string[]): boolean => {
        return Array.isArray(dictionaryWord) && dictionaryWord.includes(word);
    }
}

/**
 * @module WordValidationService
 */
export class WordValidationService {
    private dictionary: string[] = [];
    constructor(private rules: Rule[] = [], private dictionaryWord?: any) {}

    async validate(word: string) {
        if (this.dictionaryWord) {
            this.dictionary = await this.dictionaryWord.loadDictionary();
        }

        for (const rule of this.rules) {
            if (!rule(word, this.dictionary)) {
                return false;
            }
        }
        return true;
    }
}