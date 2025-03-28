export default class Player {
    private readonly username: string;
    private score: number;
    private gamesPlayed: Array<string[]>;
    private gamesWon: Array<string[]>;
    private attempts: number[];
    private gamesLost: Array<string[]>;
    private winRate: number;
    private streaks: number;

    constructor(username: string) {
        this.username = username;
        this.score = 0;
        this.gamesPlayed = [];
        this.gamesWon = [];
        this.gamesLost = [];
        this.winRate = 0;
        this.streaks = 0;
        this.attempts = [];
    }

    public getUsername(): string {
        return this.username;
    }

    public getScore(): number {
        return this.score;
    }

    public getGamesPlayed(): Array<string[]> {
        return this.gamesPlayed;
    }

    public getGamesWon(): Array<string[]> {
        return this.gamesWon;
    }

    public getGamesLost(): Array<string[]> {
        return this.gamesLost;
    }

    public getWinRate(): number {
        return this.winRate;
    }

    public getStreaks(): number {
        return this.streaks;
    }

    public getAttempts(): number[] {
        return this.attempts;
    }

    public addAttempt(attempt: number): void {
        this.attempts.push(attempt);
        // compute streaks
        if (this.attempts.length > 1) {
            const lastAttempt = this.attempts[this.attempts.length - 1];
            const previousAttempt = this.attempts[this.attempts.length - 2];
            if (lastAttempt === previousAttempt) {
                this.streaks++;
            } else {
                this.streaks = 0;
            }
        }
    }

    public updateScore(points: number): void {
        this.score += points;
    }

    public addGameWon(word: string[]): void {
        this.gamesWon.push(word);
        this.gamesPlayed.push(word);
        this.updateWinRate();
    }

    public addGameLost(word: string[]): void {
        this.gamesLost.push(word);
        this.gamesPlayed.push(word);
        this.updateWinRate();
    }

    public computeScore(isWin: boolean, attemptsUsed: number, maxAttempts: number): void {
        if (!isWin) {
            this.updateScore(0);
            return;
        }

        // Points de base pour une victoire
        let basePoints = 100;

        // Réduction selon le nombre d'essais
        const bonus = (maxAttempts - attemptsUsed) * 10;

        // Bonus de série (streak)
        const streakBonus = this.streaks * 5;

        const totalPoints = basePoints + bonus + streakBonus;

        this.updateScore(totalPoints);
    }

    public computeAverageAttempts(): number {
        const totalAttempts = this.attempts.reduce((acc, attempt) => acc + attempt, 0);
        return this.attempts.length > 0 ? totalAttempts / this.attempts.length : 0;
    }


    public updateWinRate(): void {
        const totalGames = this.gamesPlayed.length;
        const totalWins = this.gamesWon.length;
        this.winRate = totalGames > 0 ? (totalWins / totalGames) * 100 : 0;
    }

    public incrementStreaks(): void {
        this.streaks++;
    }
}