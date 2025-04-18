/**
 * Service to load words from a dictionary file.
 * @returns DictionaryService - An object containing the loadDictionary function.
 */
export const DictionaryApiService = () => {
    /**
     * Load the dictionary from a file.
     * @param filePath - The path to the dictionary file.
     * @returns {Promise<string[]>} - A promise that resolves to an array of words.
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
