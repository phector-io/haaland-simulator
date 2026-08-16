/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useRef, useState } from "react";

export type Ball = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
};

export type Player = {
    x: number;
    y: number;
    width: number;
    height: number;
};

const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

const PLAYER_WIDTH = 96;
const PLAYER_HEIGHT = 122;

export const useFootballGame = () => {
    const fieldRef = useRef<HTMLDivElement | null>(null);
    const ballRef = useRef<Ball>({
        x: 220,
        y: 220,
        vx: -2.6,
        vy: 1.4,
        radius: 16,
    });
    const playerRef = useRef<Player>({
        x: 18,
        y: 340,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
    });
    const hasBeenShotRef = useRef(false);
    const isDraggingRef = useRef(false);
    const respawnTimeoutRef = useRef<number | null>(null);
    const goalWindowRef = useRef(false);
    const joystickVectorRef = useRef({ x: 0, y: 0 });
    const keyboardStateRef = useRef({ left: false, right: false, up: false, down: false });

    const [playerScore, setPlayerScore] = useState(0);
    const [opponentScore] = useState(0);
    const [message, setMessage] = useState("Drag Haaland to shoot");
    const [joystick, setJoystick] = useState({ x: 0, y: 0, active: false });
    const [showJoystick, setShowJoystick] = useState(false);
    const [showFailModal, setShowFailModal] = useState(false);
    const [ball, setBall] = useState<Ball>({
        x: 220,
        y: 220,
        vx: -2.6,
        vy: 1.4,
        radius: 16,
    });
    const [player, setPlayer] = useState<Player>({
        x: 18,
        y: 340,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
    });

    const resetBall = useCallback((direction: "left" | "right", preservePlayerPosition = false) => {
        const field = fieldRef.current;
        const width = field?.clientWidth ?? 360;
        const height = field?.clientHeight ?? 540;
        const centerX = width / 2;
        const centerY = height / 2;

        if (respawnTimeoutRef.current) {
            window.clearTimeout(respawnTimeoutRef.current);
        }

        setShowFailModal(false);
        ballRef.current = {
            x: centerX,
            y: centerY,
            vx: 0,
            vy: 0,
            radius: 16,
        };

        if (!preservePlayerPosition) {
            const resetPlayer = {
                x: 18,
                y: 340,
                width: PLAYER_WIDTH,
                height: PLAYER_HEIGHT,
            };

            playerRef.current = resetPlayer;
            setPlayer(resetPlayer);
        }

        hasBeenShotRef.current = false;
        setBall({ ...ballRef.current });
        setMessage(direction === "right" ? "Kick-off! Haaland attacks" : "Kick-off! Defend");

        respawnTimeoutRef.current = window.setTimeout(() => {
            const angle = (Math.random() - 0.5) * 2.1 + (direction === "right" ? 0.2 : -0.2);
            const speed = 2.8 + Math.random() * 2.5;

            ballRef.current = {
                x: centerX,
                y: centerY,
                vx: Math.cos(angle) * speed * (direction === "right" ? 1 : -1),
                vy: Math.sin(angle) * (2.8 + Math.random() * 2.2),
                radius: 16,
            };
            setBall({ ...ballRef.current });
            setMessage(direction === "right" ? "Haaland shoots!" : "Opposition attacks!");
        }, 700);
    }, []);

    const triggerFail = useCallback(() => {
        const field = fieldRef.current;
        const height = field?.clientHeight ?? 540;

        setPlayerScore(0);
        setShowFailModal(true);
        ballRef.current = {
            x: -999,
            y: height / 2,
            vx: 0,
            vy: 0,
            radius: 16,
        };
        setBall({ ...ballRef.current });
        setMessage("Fail! Retry");
    }, []);

    const handleBallPlayerCollision = useCallback(() => {
        const ballState = ballRef.current;
        const playerBox = playerRef.current;

        const overlapsX =
            ballState.x + ballState.radius >= playerBox.x &&
            ballState.x - ballState.radius <= playerBox.x + playerBox.width;

        const overlapsY =
            ballState.y + ballState.radius >= playerBox.y &&
            ballState.y - ballState.radius <= playerBox.y + playerBox.height;

        if (!overlapsX || !overlapsY || ballState.vx >= 0) {
            return false;
        }

        const impactOffset = ballState.y - (playerBox.y + playerBox.height / 2);

        ballRef.current.vx = 6.2;
        ballRef.current.vy = impactOffset * 0.14;
        hasBeenShotRef.current = true;
        setMessage("Haaland shoots!");
        return true;
    }, []);

    const movePlayer = useCallback((deltaX: number, deltaY: number) => {
        const field = fieldRef.current;
        if (!field) return;

        const nextPlayer = {
            x: clamp(playerRef.current.x + deltaX, 8, field.clientWidth - PLAYER_WIDTH - 8),
            y: clamp(playerRef.current.y + deltaY, 8, field.clientHeight - PLAYER_HEIGHT - 8),
            width: PLAYER_WIDTH,
            height: PLAYER_HEIGHT,
        };

        playerRef.current = nextPlayer;
        setPlayer(nextPlayer);
    }, []);

    const updateJoystick = useCallback((pointerX: number, pointerY: number, baseElement: HTMLDivElement) => {
        const rect = baseElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const rawX = pointerX - centerX;
        const rawY = pointerY - centerY;
        const maxDistance = rect.width * 0.32;
        const distance = Math.min(Math.hypot(rawX, rawY), maxDistance);
        const angle = Math.atan2(rawY, rawX);
        const clampedX = Math.cos(angle) * distance;
        const clampedY = Math.sin(angle) * distance;
        const normalizedX = maxDistance === 0 ? 0 : clampedX / maxDistance;
        const normalizedY = maxDistance === 0 ? 0 : clampedY / maxDistance;

        joystickVectorRef.current = { x: normalizedX, y: normalizedY };
        setJoystick({ x: clampedX, y: clampedY, active: true });
        movePlayer(normalizedX * 18, normalizedY * 18);
    }, [movePlayer]);

    const handlePlayerPointerDown = useCallback((
        event: React.PointerEvent<HTMLDivElement>,
    ) => {
        event.preventDefault();
        event.stopPropagation();
        isDraggingRef.current = true;
        updateJoystick(event.clientX, event.clientY, event.currentTarget);
    }, [updateJoystick]);

    const handlePlayerPointerMove = useCallback((
        event: React.PointerEvent<HTMLDivElement>,
    ) => {
        if (!isDraggingRef.current) return;
        updateJoystick(event.clientX, event.clientY, event.currentTarget);
    }, [updateJoystick]);

    const handlePlayerPointerUp = useCallback((
        event: React.PointerEvent<HTMLDivElement>,
    ) => {
        isDraggingRef.current = false;
        joystickVectorRef.current = { x: 0, y: 0 };
        setJoystick({ x: 0, y: 0, active: false });
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    }, []);

    useEffect(() => {
        resetBall("left");
        setMessage("Drag Haaland to shoot");
    }, [resetBall]);

    useEffect(() => {
        const updatePointerMode = () => {
            const isTouchMode = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
            const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
            const hasTouchScreen = navigator.maxTouchPoints > 0;
            const isTabletViewport = window.matchMedia("(max-width: 820px)").matches;

            setShowJoystick(isTouchMode || isCoarsePointer || hasTouchScreen || isTabletViewport);
        };

        updatePointerMode();
        window.addEventListener("resize", updatePointerMode);

        return () => window.removeEventListener("resize", updatePointerMode);
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
                event.preventDefault();
            }

            if (event.key === "ArrowLeft") keyboardStateRef.current.left = true;
            if (event.key === "ArrowRight") keyboardStateRef.current.right = true;
            if (event.key === "ArrowUp") keyboardStateRef.current.up = true;
            if (event.key === "ArrowDown") keyboardStateRef.current.down = true;
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.key === "ArrowLeft") keyboardStateRef.current.left = false;
            if (event.key === "ArrowRight") keyboardStateRef.current.right = false;
            if (event.key === "ArrowUp") keyboardStateRef.current.up = false;
            if (event.key === "ArrowDown") keyboardStateRef.current.down = false;
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            if (respawnTimeoutRef.current) {
                window.clearTimeout(respawnTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const tick = () => {
            const field = fieldRef.current;
            if (!field) return;

            const { x: joystickX, y: joystickY } = joystickVectorRef.current;
            const keyboardX = (keyboardStateRef.current.right ? 1 : 0) - (keyboardStateRef.current.left ? 1 : 0);
            const keyboardY = (keyboardStateRef.current.down ? 1 : 0) - (keyboardStateRef.current.up ? 1 : 0);

            if (joystickX !== 0 || joystickY !== 0) {
                movePlayer(joystickX * 18, joystickY * 18);
            }

            if (keyboardX !== 0 || keyboardY !== 0) {
                movePlayer(keyboardX * 12, keyboardY * 12);
            }

            const width = field.clientWidth;
            const height = field.clientHeight;
            let { x, y, vx, vy } = ballRef.current;
            const { radius } = ballRef.current;
            const acceleration = 0.01;

            const nextVx = vx * (1 + acceleration);
            const nextVy = vy * (1 + acceleration);

            x += nextVx;
            y += nextVy;

            vx = nextVx;
            vy = nextVy;

            const rightGoalTop = height * 0.28 + 22;
            const rightGoalBottom = height * 0.72 - 22;
            const rightGoalLine = width - 10;
            const goalInnerLeft = width - 120;
            const ballPadding = radius + 10;

            if (y <= radius || y >= height - radius) {
                vy *= -1;
                y = clamp(y, radius, height - radius);
            }

            if (handleBallPlayerCollision()) {
                setBall({ ...ballRef.current });
                return;
            }

            const isInsideGoalOpening =
                x + ballPadding >= rightGoalLine &&
                x - ballPadding >= goalInnerLeft &&
                y >= rightGoalTop &&
                y <= rightGoalBottom;

            if (isInsideGoalOpening && !goalWindowRef.current) {
                goalWindowRef.current = true;
                setPlayerScore((current) => current + 1);
                setMessage("Goal! Haaland scores");
            } else if (!isInsideGoalOpening) {
                goalWindowRef.current = false;
            }

            if (x + radius >= width) {
                x = width - radius;
                vx *= -1;
            }

            if (x + radius <= 0) {
                triggerFail();
                return;
            }

            ballRef.current = { x, y, vx, vy, radius };
            setBall({ ...ballRef.current });
        };

        const intervalId = window.setInterval(tick, 16);
        return () => window.clearInterval(intervalId);
    }, [handleBallPlayerCollision, resetBall, triggerFail]);

    return {
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
        setJoystick,
        showJoystick,
    };
};
