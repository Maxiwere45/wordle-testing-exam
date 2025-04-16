import {WordValidationRules, WordValidationService} from "./services/WordValidatorService.ts";
import {checkGuess} from "./services/GameLogicService.ts";
import {arraysEqual} from "./utils/utils.ts";
import Player from "../entites/Player.ts";
import {WordleApiService} from "./repositories/WordleApiService.ts";
import {DictionaryApiService} from "./repositories/DictionnaryApiService.ts";


/**
 * Classe représentant un jeu de Wordle
 */
class WordleGame {
    private game_mode: string = 'normal';
    private maxAttempts = 5;
    private attemptRemaining = 5;
    private wordle: string|null = null;
    private gameOver: boolean = false;
    private gameWon: boolean = false;

    /**
     * Constructeur de la classe WordleGame
     * @param wordleWords - Mots de Wordle
     * @param dictionnaryWords - Mots du dictionnaire
     * @param player - Joueur
     * @param game_mode - Mode de jeu
     * @param maxAttempts - Nombre maximum de tentatives
     */
    constructor(
        private wordleWords: WordleApiService,
        private dictionnaryWords: DictionaryApiService,
        private player?: Player,
        game_mode?: string,
        maxAttempts?: number
    ) {
        this.game_mode = game_mode || 'normal';
        this.maxAttempts = maxAttempts || 5;
        this.attemptRemaining = this.maxAttempts;
    }

    /**
     * Vérifie si le mot est valide via les règles de validation
     * @param word - Le mot à vérifier
     */
    public async isValidWord(word: string) {
        //! le lenService ne fonctionnera pas si le mot est > 5 (à fixer)
        const lenService = new WordValidationService([WordValidationRules.exactlen]);
        const letterService = new WordValidationService([WordValidationRules.onlyletters]);
        const dictService = new WordValidationService([WordValidationRules.inDictionary], this.dictionnaryWords);

        if (! await lenService.validate(word)) {
            throw new Error('Word should only have 5 letters');
        }

        if (! await letterService.validate(word)) {
            throw new Error('Word should only have letters');
        }

        if (! await dictService.validate(word)) {
            throw new Error('Word should be in the dictionary');
        }

        return true;
    }

    /**
     * Charge le mot de Wordle depuis le service
     */
    async loadWordle(): Promise<void> {
        const word = await this.wordleWords.loadWordle();
        if (word && await this.isValidWord(word)) {
            this.wordle = word;
            this.maxAttempts = word.length;
            this.attemptRemaining = this.maxAttempts;
        } else {
            throw new Error('Failed to load wordle');
        }
    }

    /**
     * Joue un mot dans le jeu
     * @param word - Le mot à jouer
     * @returns 1 si gagné, -1 si perdu, 0 si en cours, -2 si plus de tentatives
     * @throws Error si le mot n'est pas valide ou si le jeu est terminé
     */
    play(word: string) {
        if (!this.wordle) {
            throw new Error('Wordle not loaded');
        }

        if (!this.isValidWord(word)) {
            throw new Error('Invalid word');
        }

        if (this.attemptRemaining <= 0) {
            this.gameOver = true;
            return -2; // No attempts remaining
        }

        this.attemptRemaining--;

        if (arraysEqual(checkGuess(word, this.wordle), Array(this.wordle.length).fill('green')))  {
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
     * Réinitialise le jeu
     * @param wordleWords - Mots de Wordle
     * @param dictionaryLoader - Mots du dictionnaire
     * @param game_mode - Mode de jeu
     * @param maxAttempts - Nombre maximum de tentatives
     */
    public async resetGame(
        wordleWords: WordleApiService,
        dictionaryLoader: DictionaryApiService,
        game_mode?: string,
        maxAttempts?: number
    ) {
        this.wordleWords = wordleWords;
        this.dictionnaryWords = dictionaryLoader;
        this.attemptRemaining = 5;
        this.gameOver = false;
        this.gameWon = false;
        this.game_mode = game_mode || 'normal';
        this.maxAttempts = maxAttempts || 5;
        await this.loadWordle();
    }

    /**
     * Récupère le compteur de tentatives restantes
     * @returns Le compteur de tentatives restantes
     */
    getWordle() {
        return this.wordle;
    }

    /**
     * Récupère le mot de Wordle
     * @returns Le mot de Wordle
     */
    getMaxAttempts() {
        return this.maxAttempts;
    }

    /**
     * Récupère le mode de jeu
     * @returns Le mode de jeu
     */
    getGameMode() {
        return this.game_mode;
    }

    /**
     * Récupère le nombre de tentatives restantes
     * @returns Le nombre de tentatives restantes
     */
    getAttemptsRemaining() {
        return this.attemptRemaining;
    }

    /**
     * Récupère le joueur
     * @returns Le joueur
     */
    isGameOver() {
        return this.gameOver;
    }

    /**
     * Récupère le joueur
     * @returns Le joueur
     */
    isGameWon() {
        return this.gameWon;
    }
}

export default WordleGame;