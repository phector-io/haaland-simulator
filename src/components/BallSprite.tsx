import type { Ball } from "../hooks/useFootballGame";

type BallSpriteProps = {
    ball: Ball;
};

export const BallSprite = ({ ball }: BallSpriteProps) => (
    <div
        className="ball"
        style={{
            left: `${ball.x - ball.radius}px`,
            top: `${ball.y - ball.radius}px`,
        }}
    />
);
