import {WordValidationRules, WordValidationService} from "./services/WordValidatorService.ts";
import {checkGuess} from "./services/GameLogicService.ts";
import {arraysEqual} from "./utils/utils.ts";
import Player from "../entites/Player.ts";
import {WordleApiService} from "./services/repositories/WordleApiService.ts";
import {DictionaryApiService} from "./services/repositories/DictionnaryApiService.ts";


/**
 * Class representing a Wordle game.
 */
class WordleGame {
    // @ts-ignore
    private game_mode: string = 'normal';
    private maxAttempts = 5;
    private attemptRemaining = 5;
    private wordle: string | null = null;
    private gameOver: boolean = false;
    private gameWon: boolean = false;

    /**
     * Constructor for the WordleGame class.
     * @param wordleApiService - Service to load Wordle words
     * @param dictionaryApiService - Service to load dictionary words
     * @param player - Player object
     * @param game_mode - Game mode (normal, hard, etc.)
     * @param maxAttempts - Maximum number of attempts
     */
    constructor(
        private wordleApiService: WordleApiService,
        private dictionaryApiService: DictionaryApiService,
        private player?: Player,
        game_mode?: string,
        maxAttempts?: number
    ) {
        this.game_mode = game_mode || 'normal';
        this.maxAttempts = maxAttempts || 5;
        this.attemptRemaining = this.maxAttempts;
    }

    /**
     * Check if the word is valid.
     * @param word
     */
    public async isValidWord(word: string) {
        //! le lenService ne fonctionnera pas si le mot est > 5 (à fixer)
        const lenService = new WordValidationService([WordValidationRules.exactlen]);
        const letterService = new WordValidationService([WordValidationRules.onlyletters]);
        const dictService = new WordValidationService([WordValidationRules.inDictionary], this.dictionaryApiService);

        if (!await lenService.validate(word)) {
            throw new Error('Le mot doit avoir 5 lettres !');
        }

        if (!await letterService.validate(word)) {
            throw new Error('Le mot doit uniquement contenir des lettres !');
        }

        if (!await dictService.validate(word)) {
            throw new Error('Le mot n\'est pas dans le dictionnaire !');
        }

        return true;
    }

    /**
     * Load the Wordle word.
     */
    async loadWordle(): Promise<void> {
        const word = await this.wordleApiService.loadWordle();
        await this.isValidWord(word);
        this.wordle = word;
        this.maxAttempts = word.length;
        this.attemptRemaining = this.maxAttempts;
    }

    /**
     * Play the game with the given word.
     * @param word - The word to guess
     * @returns 1 if the game is won, -1 if lost, 0 if continued, -2 if no attempts remaining
     */
    async play(word: string) {
        if (!this.wordle) {
            throw new Error('Wordle not loaded');
        }

        // Properly await the asynchronous validation
        await this.isValidWord(word);

        if (this.attemptRemaining <= 0) {
            this.gameOver = true;
            return -2; // No attempts remaining
        }

        this.attemptRemaining--;

        if (arraysEqual(checkGuess(word, this.wordle), Array(this.wordle.length).fill('green'))) {
            this.gameWon = true;
            this.player?.addWin(this.maxAttempts - this.attemptRemaining, this.wordle);
            return 1; // Win
        } else if (this.attemptRemaining === 0) {
            this.gameOver = true;
            this.player?.addLoss(this.wordle);
            return -1; // Lose
        } else {
            return 0; // Continue
        }
    }

    /**
     * Reset the game.
     * @param wordleWords - Service to load Wordle words
     * @param dictionaryLoader - Service to load dictionary words
     * @param game_mode - Game mode (normal, hard, etc.)
     * @param maxAttempts - Maximum number of attempts
     */
    public async resetGame(
        wordleWords: WordleApiService,
        dictionaryLoader: DictionaryApiService,
        game_mode?: string,
        maxAttempts?: number
    ) {
        this.wordleApiService = wordleWords;
        this.dictionaryApiService = dictionaryLoader;
        this.attemptRemaining = 5;
        this.gameOver = false;
        this.gameWon = false;
        this.game_mode = game_mode || 'normal';
        this.maxAttempts = maxAttempts || 5;
        await this.loadWordle();
    }

    getWordle() {
        return this.wordle;
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