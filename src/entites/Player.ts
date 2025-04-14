
interface GameHistory {
    word: string;
    attempts: number;
    result: boolean;
}

class Player {
    private readonly username: string;
    private wins: number;
    private losses: number;
    private streaks: number;
    private readonly gamesPlayed: GameHistory[];
    private readonly attempts: number[];

    constructor(username: string) {
        this.username = username;
        this.wins = 0;
        this.losses = 0;
        this.streaks = 0;
        this.gamesPlayed = [];
        this.attempts = [];
    }

    public getUsername(): string {
        return this.username;
    }

    public getWins(): number {
        return this.wins;
    }

    public getLosses(): number {
        return this.losses;
    }

    public getStreaks(): number {
        return this.streaks;
    }

    public getGamesPlayed(): GameHistory[] {
        return this.gamesPlayed;
    }

    public getAttempts(): number[] {
        return this.attempts;
    }

    public getScore(): number {
        return this.wins * 100 - this.losses * 50;
    }

    public getWinRate(): number {
        const totalGames = this.wins + this.losses;
        return totalGames > 0 ? (this.wins / totalGames) * 100 : 0;
    }

    public getAverageAttempts(): number {
        const totalAttempts = this.attempts.reduce((acc, curr) => acc + curr, 0);
        return totalAttempts / this.attempts.length || 0;
    }

    public addWin(attempt: number, wordle: string ): void {
        this.wins++;
        this.attempts.push(attempt);
        this.gamesPlayed.push({ word: wordle, attempts: attempt, result: true });

        // Update streaks
        if (this.gamesPlayed[this.gamesPlayed.length - 2]?.result) {
            this.streaks++;
        }
    }

    public addLoss(wordle: string ): void {
        this.losses++;
        this.attempts.push(5);
        this.gamesPlayed.push({ word: wordle, attempts: 5, result: false });
    }
}

export default Player;