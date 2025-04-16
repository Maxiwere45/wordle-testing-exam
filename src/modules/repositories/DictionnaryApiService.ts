
/**
 * @module DictionaryApiService
 * @description Service pour charger les mots du dictionnaire
 */
export type DictionaryApiService = {
    loadDictionary: (filePath?: string) => Promise<string[]>;
}

/**
 * Service pour charger les mots du dictionnaire
 * @returns Un tableau de mots
 */
export const DictionaryApiService = (): DictionaryApiService => {

    /**
     * Charge le dictionnaire à partir d'un fichier
     * @param filePath - Chemin du fichier de dictionnaire
     * @returns Un tableau de mots
     */
    const loadDictionary = async (filePath?: string): Promise<string[]> => {
        const response = await fetch(filePath ?? '/liste_mots_fr.txt');
        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const data = await response.text();
        return data.split('\n').map(word => word.trim());
    }
    return { loadDictionary };
};
