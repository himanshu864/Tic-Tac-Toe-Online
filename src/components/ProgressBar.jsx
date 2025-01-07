import { useState, useEffect } from "react";
import { initialGrid } from "../utils/GameUtils";

const TIMER = 5000;

export default function ProgressBar({ isPlayerOneTurn, handleGameOver }) {
  const [timeLeft, setTimeLeft] = useState(TIMER);

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleGameOver(isPlayerOneTurn ? 1 : 0, initialGrid);
    }, TIMER);
    return () => clearTimeout(timeout);
  }, [isPlayerOneTurn, handleGameOver]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((left) => left - 25);
    }, 25);
    return () => clearInterval(interval);
  }, []);

  return <progress className="progressBar" value={timeLeft} max={TIMER} />;
}
