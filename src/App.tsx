import "./App.css";
import { BallSprite } from "./components/BallSprite";
import { FailModal } from "./components/FailModal";
import { PlayerSprite } from "./components/PlayerSprite";
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
        joystick,
        showJoystick,
    } = useFootballGame();

    return (
        <main className="app-shell">
            <div className="game-panel">
                <div className="pitch" ref={fieldRef}>
                    <div className="pitch-stripes" />
                    <div className="center-circle" />
                    <div className="goal goal-right" aria-label="Goal on the right" />

                    <div className="scoreboard-overlay">
                        <div className="scoreboard-inline">
                            <span>{playerScore}</span>
                            <span className="score-divider">:</span>
                            <span>{opponentScore}</span>
                        </div>
                    </div>

                    <PlayerSprite
                        player={player}
                        onPointerDown={() => {}}
                        onPointerMove={() => {}}
                        onPointerUp={() => {}}
                        onPointerCancel={() => {}}
                        onPointerLeave={() => {}}
                    />

                    <BallSprite ball={ball} />

                    <div className="message-box">{message}</div>

                    {!showJoystick && (
                        <div className="desktop-controls" aria-label="Use arrow keys to move">
                            <span className="keycap">←</span>
                            <span className="keycap">↑</span>
                            <span className="keycap">→</span>
                            <span className="keycap">↓</span>
                        </div>
                    )}

                    {showJoystick && (
                        <div
                            className={`joystick${joystick.active ? " active" : ""}`}
                            onPointerDown={handlePlayerPointerDown}
                            onPointerMove={handlePlayerPointerMove}
                            onPointerUp={handlePlayerPointerUp}
                            onPointerCancel={handlePlayerPointerUp}
                        >
                            <div className="joystick-base">
                                <div className="joystick-ring" />
                                <div
                                    className="joystick-knob"
                                    style={{
                                        transform: `translate(${joystick.x}px, ${joystick.y}px)`,
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showFailModal && <FailModal onRetry={() => resetBall("left", true)} />}
        </main>
    );
}

export default App;
