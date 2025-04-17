/**
 * Check if 2 arrays are equal
 * @param arr1 - The first array
 * @param arr2 - The second array
 * @return true if the arrays are equal, false otherwise
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