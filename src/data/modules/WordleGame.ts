import { WordleGameValidationService, WordleGameValidationRules } from "../services/WordleGameValidationService.ts";
import Player from "./Player.ts";

interface WordleWord {
    loadWordle: () => Promise<string[]>;
}

/**
 * WordleGame class
 */
export class WordleGame {
    private game_mode: string = 'normal';
    private attemptCounter = 0;
    private MAX_ATTEMPTS = 5;
    private wordle: string[] = [];
    private wordsAttempted: Array<string[]> = [];
    private colorsChecking: string[] = [];
    private rules: any = WordleGameValidationRules;
    private player: Player;

    constructor(private wordleWord: WordleWord, game_mode?: string, player?: Player) {
        this.game_mode = game_mode || 'normal';
        this.player = player || new Player('default');
        this.colorsChecking = ['gray', 'gray', 'gray', 'gray', 'gray'];
    }

    /**
     * Check if the word validate all rules
     * @param word
     */
    public isValidWord(word: string[]) {
        const lenService = new WordleGameValidationService([this.rules.exactlen]);
        const letterService = new WordleGameValidationService([this.rules.onlyletters]);
        const spaceService = new WordleGameValidationService([this.rules.noSpace]);

        if (!spaceService.validate(word)) {
            throw new Error('Word should not have spaces');
        }

        if (!lenService.validate(word)) {
            throw new Error('Word should only have 5 letters');
        }

        if (!letterService.validate(word)) {
            throw new Error('Word should only have letters');
        }
        return true;
    };

    async loadWordle(): Promise<void> {
        const word = await this.wordleWord.loadWordle();
        if (word && this.isValidWord(word)) {
            this.wordle = word;
            this.MAX_ATTEMPTS = word.length;
            if (this.wordle.length > 5) {
                this.colorsChecking = new Array(this.wordle.length).fill('gray');
            }
        } else {
            throw new Error('Failed to load wordle');
        }
    }

    public getWordle() {
        return this.wordle;
    }

    public getPlayer() {
        return this.player;
    }


    public addWordAttempt(word: string[]) {
        this.wordsAttempted.push(word);
    }

    public getWordAttempt() {
        return this.wordsAttempted;
    }

    public getGameMode() {
        return this.game_mode;
    }

    private resetColorsChecking() {
        this.colorsChecking = new Array(this.wordle.length).fill('gray');
    }

    public getCounter() {
        return this.attemptCounter;
    }

    public incrementCounter() {
        this.attemptCounter++;
    }

    public getColorsChecking() {
        return this.colorsChecking
    }

    /**
     * Check if all letters are found in the wordle
     */
    public isWon() {
        return this.colorsChecking.every((color) => color === 'green');
    }

    /**
     * Get the letter that are in the wordle (right letter, right position) and change the color to green
     * @param word
     */
    public getRightLetterRightPosition(word: string[]): void {
        for (let i = 0; i < this.wordle.length; i++) {
            if (this.wordle[i] === word[i]) {
                this.colorsChecking[i] = 'green';
            }
        }
    }

    public getIncludedLettersInWrongPosition(word: string[]): void {
        const wordCopy = [...word]; // copie du mot proposé
        const targetWord = [...this.wordle];
        const checked = [...this.colorsChecking]; // copie des couleurs déjà définies

        // Supprimer les lettres déjà trouvées (green) pour ne pas les traiter à nouveau
        for (let i = 0; i < checked.length; i++) {
            if (checked[i] === 'green') {
                targetWord[i] = null as any; // lettre déjà validée
                wordCopy[i] = null as any; // on évite de la re-tester
            }
        }

        // Chercher les lettres présentes (orange)
        for (let i = 0; i < word.length; i++) {
            if (wordCopy[i] && targetWord.includes(wordCopy[i])) {
                this.colorsChecking[i] = 'yellow';
                const indexToRemove = targetWord.indexOf(wordCopy[i]);
                targetWord[indexToRemove] = null as any;
            }
        }
    }

    /**
     * Play the Wordle game
     * @param word
     */
    public play(word: string[]) {
        if (this.attemptCounter >= this.MAX_ATTEMPTS || this.isWon()) {
            return -2;
        }
        this.resetColorsChecking();
        this.isValidWord(word);
        this.getRightLetterRightPosition(word);
        this.getIncludedLettersInWrongPosition(word);
        this.addWordAttempt(word);
        this.incrementCounter();

        if (this.isWon()) {
            this.player.addGameWon(word);
            this.player.addAttempt(this.attemptCounter);
            this.player.computeScore(true, this.attemptCounter, this.MAX_ATTEMPTS);
            return 1;
        }

        if (this.attemptCounter === this.MAX_ATTEMPTS) {
            this.player.addGameLost(word);
            this.player.addAttempt(this.attemptCounter);
            this.player.computeScore(false, this.attemptCounter, this.MAX_ATTEMPTS);
            return -1;
        }

        return 0;
    }
}
