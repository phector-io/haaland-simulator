type ScoreboardProps = {
    playerScore: number;
    opponentScore: number;
};

export const Scoreboard = ({ playerScore, opponentScore }: ScoreboardProps) => (
    <header className="scoreboard">
        <div className="score-block">
            <span className="label">You</span>
            <strong>{playerScore}</strong>
        </div>

        <div className="score-divider">:</div>

        <div className="score-block opponent">
            <strong>{opponentScore}</strong>
            <span className="label">Them</span>
        </div>
    </header>
);
