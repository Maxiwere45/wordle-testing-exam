/**
 * Vérifie si deux tableaux sont égaux en valeur
 * @param arr1 - Le premier tableau à comparer
 * @param arr2 - Le deuxième tableau à comparer
 */
function arraysEqual<T>(arr1: T[], arr2: T[]): boolean {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}

export { arraysEqual };