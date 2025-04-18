import {DictionaryApiService} from "./DictionnaryApiService.ts";

/**
 * @module WordleApiService
 * @description Service to load a random word from the dictionary.
 */
export type WordleApiService = {
    /**
     * Load a random word from the dictionary.
     * @returns {Promise<string>} - A promise that resolves to a random word.
     */
    loadWordle: () => Promise<string>;
}

/**
 * Service to load a random word from the dictionary.
 * @returns {WordleApiService} - An object containing the loadWordle function.
 */
export const WordleApiService = (): WordleApiService => {
    /**
     * Load a random word from the dictionary.
     * @returns {Promise<string>} - A promise that resolves to a random word.
     */
    const loadWordle = async (): Promise<string> => {
        const dictionaryService = DictionaryApiService();
        const loadDictionary = dictionaryService.loadDictionary('/liste_mots_fr.txt');
        const words = await loadDictionary;
        const randomIndex = Math.floor(Math.random() * words.length);
        return words[randomIndex].toLowerCase();
    }
    return { loadWordle };
}