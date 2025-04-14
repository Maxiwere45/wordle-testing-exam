export type WordValidationRule = (word: string, dictionaryWord?: string[]) => boolean;
type Rule = WordValidationRule;

export const WordValidationRules = {
    // should only have 5 letters
    exactlen: (word: string) => word.length == 5,
    // should only have letters
    onlyletters: (word: string) => /^[a-zA-Z]+$/.test(word),
    // Should be in the dictionary
    inDictionary: (word: string, dictionaryWord?: string[]) => {
        return Array.isArray(dictionaryWord) && dictionaryWord.includes(word);
    }
}

interface DictionaryWord {
    loadDictionaryWords: () => Promise<string[]>;
}

export class WordValidationService {
    private dictionary: string[] = [];
    constructor(private rules: Rule[] = [], private dictionaryWord?: DictionaryWord) {}

    async validate(word: string) {
        if (this.dictionaryWord) {
            this.dictionary = await this.dictionaryWord.loadDictionaryWords();
        }

        for (const rule of this.rules) {
            if (!rule(word, this.dictionary)) {
                return false;
            }
        }
        return true;
    }
}