/**
 * Interface représantant l'historique d'une partie
 */
interface GameHistory {
    word: string;
    attempts: number;
    result: boolean;
}

/**
 * Classe représentant un joueur
 */
class Player {
    private readonly username: string;
    private wins: number;
    private losses: number;
    private streaks: number;
    private readonly gamesPlayed: GameHistory[];
    private readonly attempts: number[];

    /**
     * Constructeur de la classe Player
     * @param username - Nom d'utilisateur du joueur
     */
    constructor(username: string) {
        this.username = username;
        this.wins = 0;
        this.losses = 0;
        this.streaks = 0;
        this.gamesPlayed = [];
        this.attempts = [];
    }

    /**
     * Récupère le nom d'utilisateur du joueur
     * @returns Le nom d'utilisateur
     */
    public getUsername(): string {
        return this.username;
    }

    /**
     * Récupère le nombre de victoires du joueur
     * @returns Le nombre de victoires
     */
    public getWins(): number {
        return this.wins;
    }

    /**
     * Récupère le nombre de défaites du joueur
     * @returns Le nombre de défaites
     */
    public getLosses(): number {
        return this.losses;
    }

    /**
     * Récupère le nombre de séries de victoires consécutives
     * @returns Le nombre de séries
     */
    public getStreaks(): number {
        return this.streaks;
    }

    /**
     * Récupère l'historique des parties jouées
     * @returns L'historique des parties
     */
    public getGamesPlayed(): GameHistory[] {
        return this.gamesPlayed;
    }

    /**
     * Récupère le nombre de tentatives effectuées
     * @returns Le tableau des tentatives
     */
    public getAttempts(): number[] {
        return this.attempts;
    }

    /**
     * Récupère le score du joueur
     * @returns Le score calculé
     */
    public getScore(): number {
        return this.wins * 100 - this.losses * 50;
    }

    /**
     * Récupère le taux de victoire du joueur
     * @returns Le taux de victoire en pourcentage
     */
    public getWinRate(): number {
        const totalGames = this.wins + this.losses;
        return totalGames > 0 ? (this.wins / totalGames) * 100 : 0;
    }

    /**
     * Récupère la moyenne des tentatives
     * @returns La moyenne des tentatives
     */
    public getAverageAttempts(): number {
        const totalAttempts = this.attempts.reduce((acc, curr) => acc + curr, 0);
        return totalAttempts / this.attempts.length || 0;
    }

    /**
     * Ajoute une victoire au joueur
     * @param attempt - Le nombre de tentatives pour gagner
     * @param wordle - Le mot deviné
     * @returns void
     */
    public addWin(attempt: number, wordle: string ): void {
        this.wins++;
        this.attempts.push(attempt);
        this.gamesPlayed.push({ word: wordle, attempts: attempt, result: true });

        // Update streaks
        if (this.gamesPlayed[this.gamesPlayed.length - 2]?.result) {
            this.streaks++;
        }
    }

    /**
     * Ajoute une défaite au joueur
     * @param wordle - Le mot deviné
     */
    public addLoss(wordle: string ): void {
        this.losses++;
        this.attempts.push(5);
        this.gamesPlayed.push({ word: wordle, attempts: 5, result: false });
    }
}

export default Player;