import "./App.css";
import { BallSprite } from "./components/BallSprite";
import { FailModal } from "./components/FailModal";
import { PlayerSprite } from "./components/PlayerSprite";
import { Scoreboard } from "./components/Scoreboard";
import { useFootballGame } from "./hooks/useFootballGame";

function App() {
    const {
        fieldRef,
        ball,
        player,
        playerScore,
        opponentScore,
        message,
        showFailModal,
        handlePlayerPointerDown,
        handlePlayerPointerMove,
        handlePlayerPointerUp,
        resetBall,
    } = useFootballGame();

    return (
        <main className="app-shell">
            <div className="game-panel">
                <Scoreboard playerScore={playerScore} opponentScore={opponentScore} />

                <div className="pitch" ref={fieldRef}>
                    <div className="pitch-stripes" />
                    <div className="center-circle" />
                    <div className="goal goal-right" aria-label="Goal on the right" />

                    <PlayerSprite
                        player={player}
                        onPointerDown={handlePlayerPointerDown}
                        onPointerMove={handlePlayerPointerMove}
                        onPointerUp={handlePlayerPointerUp}
                        onPointerCancel={handlePlayerPointerUp}
                        onPointerLeave={handlePlayerPointerUp}
                    />

                    <BallSprite ball={ball} />

                    <div className="message-box">{message}</div>
                </div>
            </div>

            {showFailModal && <FailModal onRetry={() => resetBall("left", true)} />}
        </main>
    );
}

export default App;
