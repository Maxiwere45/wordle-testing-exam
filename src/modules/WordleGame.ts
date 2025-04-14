import {WordValidationRules, WordValidationService} from "./services/WordValidatorService.ts";
import {checkGuess} from "./services/GameLogicService.ts";
import {arraysEqual} from "./utils/ArrayUtils.ts";
import Player from "../entites/Player.ts";


interface WordleWord {
    loadWordle: () => Promise<string>;
}

/**
 * WordleGame class
 */
class WordleGame {
    private readonly game_mode: string = 'normal';
    private maxAttempts = 5;
    private attemptRemaining = 5;
    private wordle: string|null = null;
    private gameOver: boolean = false;
    private gameWon: boolean = false;

    constructor(
        private wordleWords: WordleWord,
        private dictionnaryWords: Promise<string[]>,
        private player?: Player,
        game_mode?: string,
        maxAttempts?: number
    ) {
        this.game_mode = game_mode || 'normal';
        this.maxAttempts = maxAttempts || 5;
        this.attemptRemaining = this.maxAttempts;
    }

    /**
     * Check if the word validate all rules
     * @param word
     */
    public isValidWord(word: string) {
        //! le lenService ne fonctionnera pas si le mot est > 5 (à fixer)
        const lenService = new WordValidationService([WordValidationRules.exactlen]);
        const letterService = new WordValidationService([WordValidationRules.onlyletters]);
        const dictService = new WordValidationService([WordValidationRules.inDictionary], { loadDictionaryWords: async () => this.dictionnaryWords });

        if (!lenService.validate(word)) {
            throw new Error('Word should only have 5 letters');
        }

        if (!letterService.validate(word)) {
            throw new Error('Word should only have letters');
        }

        if (!dictService.validate(word)) {
            throw new Error('Word should be in the dictionary');
        }

        return true;
    }

    /**
     * Load the wordle word
     */
    async loadWordle(): Promise<void> {
        const word = await this.wordleWords.loadWordle();
        if (word && this.isValidWord(word)) {
            this.wordle = word;
            this.maxAttempts = word.length;
            this.attemptRemaining = this.maxAttempts;
        } else {
            throw new Error('Failed to load wordle');
        }
    }

    /**
     * Play the game
     * @param word - The word to guess
     */
    play(word: string) {
        if (!this.wordle) {
            throw new Error('Wordle not loaded');
        }

        if (this.attemptRemaining <= 0) {
            this.gameOver = true;
            return -2; // No attempts remaining
        }

        this.attemptRemaining--;

        // if (checkGuess(word, this.wordle) === Array(this.wordle.length).fill('green')) {
        if (arraysEqual(checkGuess(word, this.wordle), Array(this.wordle.length).fill('green')))  {
            this.gameWon = true;
            this.player?.addWin(this.attemptRemaining, this.wordle);
            return 1; // Win
        } else if (this.attemptRemaining === 0) {
            this.gameOver = true;
            this.player?.addLoss(this.wordle);
            return -1; // Lose
        } else {
            return 0; // Continue
        }
    }

    getWordle() {
        return this.wordle;
    }

    getMaxAttempts() {
        return this.maxAttempts;
    }

    getGameMode() {
        return this.game_mode;
    }

    getAttemptsRemaining() {
        return this.attemptRemaining;
    }

    isGameOver() {
        return this.gameOver;
    }

    isGameWon() {
        return this.gameWon;
    }
}

export default WordleGame;