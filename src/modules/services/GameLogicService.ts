/**
 * Check if the guess is correct and return the result
 * @param guess - The guessed word
 * @param word - The word to guess
 */
const checkGuess = (guess: string, word: string): string[] => {
    const result: string[] = Array(word.length).fill('gray'); // Initialiser toutes les lettres en gris
    const wordLetters = word.split('');
    const guessLetters = guess.split('');

    // Vérifier les lettres correctes à la bonne position (vert)
    for (let i = 0; i < guessLetters.length; i++) {
        if (guessLetters[i] === wordLetters[i]) {
            result[i] = 'green';
            // @ts-ignore
            wordLetters[i] = null; // Marquer cette lettre comme utilisée
        }
    }

    // Vérifier les lettres correctes, mais mal placées (jaune)
    for (let i = 0; i < guessLetters.length; i++) {
        if (result[i] !== 'green' && wordLetters.includes(guessLetters[i])) {
            result[i] = 'yellow';
            // @ts-ignore
            wordLetters[wordLetters.indexOf(guessLetters[i])] = null; // Marquer cette lettre comme utilisée
        }
    }

    return result;
}

export { checkGuess };