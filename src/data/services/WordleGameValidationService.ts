export type WordleGameValidationRule = (word: string[]) => boolean;
type Rule = WordleGameValidationRule;

export const WordleGameValidationRules = {
    // should only have maxLen letters
    exactlen: (word: string[]) => word.length == 5,
    // should only have letters
    onlyletters: (word: string[]) => word.every(char => /^[a-zA-Z]$/.test(char)),
    // should not have spaces
    noSpace: (word: string[]) => !word.includes(' '),
}

export class WordleGameValidationService {
    constructor(private rules: Rule[] = []) {}

    validate(word: string[]) {
        for (const rule of this.rules) {
            if (!rule(word)) {
                return false;
            }
        }
        return true;
    }
}