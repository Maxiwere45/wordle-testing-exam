import {DictionaryApiService} from "./DictionnaryApiService.ts";

export type WordleApiService = {
    /**
     * Charge un mot aléatoire du dictionnaire
     * @returns Un mot aléatoire
     */
    loadWordle: () => Promise<string>;
}

/**
 * Service pour charger le mot de Wordle
 * @returns Un mot aléatoire du dictionnaire
 */
export const WordleApiService = (): WordleApiService => {

    /**
     * Charge un mot aléatoire du dictionnaire
     * @returns Un mot aléatoire
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