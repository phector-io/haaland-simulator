import haalandImage from "../assets/haaland.png";
import type { Player } from "../hooks/useFootballGame";

type PlayerSpriteProps = {
    player: Player;
    onPointerDown: React.PointerEventHandler<HTMLDivElement>;
    onPointerMove: React.PointerEventHandler<HTMLDivElement>;
    onPointerUp: React.PointerEventHandler<HTMLDivElement>;
    onPointerCancel: React.PointerEventHandler<HTMLDivElement>;
    onPointerLeave: React.PointerEventHandler<HTMLDivElement>;
};

export const PlayerSprite = ({
    player,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onPointerLeave,
}: PlayerSpriteProps) => (
    <div
        className="haaland"
        aria-label="Haaland player"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onPointerLeave={onPointerLeave}
        style={{
            left: `${player.x}px`,
            top: `${player.y}px`,
            width: `${player.width}px`,
            height: `${player.height}px`,
        }}
    >
        <img src={haalandImage} alt="Haaland" />
    </div>
);
