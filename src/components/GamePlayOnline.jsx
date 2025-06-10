import { useState, useEffect } from "react";
import { socket } from "../socket.js";
import ScoreCardOnline from "./ScoreCardOnline.jsx";
import { initialGrid } from "../utils/GameUtils.js";

const marks = ["X", "O"];

export default function GamePlayOnline({ isInitialTurn }) {
  const [isPlayerTurn, setPlayerTurn] = useState(isInitialTurn);
  const [playerScores, setPlayerScores] = useState([0, 0]);
  const [gameResult, setGameResult] = useState("");
  const [isGameOver, setGameOver] = useState(false);
  const [blinkers, setBlinkers] = useState(new Array(9).fill(false));
  const [grid, setGrid] = useState(initialGrid);

  useEffect(() => {
    socket.on("player-turn", (gs) => {
      setGrid(gs.grid);

      setPlayerTurn(
        (gs.playerTurn === "X" && gs.X === socket.id) ||
          (gs.playerTurn === "O" && gs.O === socket.id)
      );
      if (gs.state !== -1) {
        setPlayerScores(gs.scores);
        setBlinkers(gs.blinkers);
        handleGameOver(gs.state, gs.X === socket.id);
      }
    });

    socket.on("game-start", (gs) => {
      setGrid(gs.grid);
      setBlinkers(gs.blinkers);
      setPlayerTurn(
        (gs.playerTurn === "X" && gs.X === socket.id) ||
          (gs.playerTurn === "O" && gs.O === socket.id)
      );

      setGameResult("");
      setGameOver(false);
    });

    return () => {
      socket.off("player-turn");
      socket.off("game-start");
    };
  }, []);

  function handleGameOver(state, isPlayerOne) {
    setGameOver(true);
    if (state === 2) setGameResult("It's a Draw!");
    else if ((state === 0 && isPlayerOne) || (state === 1 && !isPlayerOne))
      setGameResult(`You Won!`);
    else setGameResult(`You Lost`);
  }

  function handleClick(row, col) {
    if (!isPlayerTurn || isGameOver || grid[row][col] !== -1) return;
    socket.emit("my-turn", row, col);
  }

  function handleGameRestart() {
    socket.emit("game-restart");
  }

  return (
    <>
      <div className="cards">
        {marks.map((mark, i) => (
          <ScoreCardOnline
            key={i}
            isPlayerTurn={
              isPlayerTurn &&
              ((mark == "X" && isInitialTurn) ||
                (mark == "O" && !isInitialTurn))
            }
            mark={mark}
            playerScore={playerScores[i]}
          />
        ))}
      </div>

      {gameResult !== "" && <div className="result">{gameResult}</div>}

      <div className="game-grid">
        {grid.map((line, row) =>
          line.map((cell, col) => (
            <div
              key={3 * row + col}
              className={`
              tile 
              ${cell !== -1 ? "pushed" : ""} 
              ${!isGameOver && isPlayerTurn && cell === -1 ? "pushable" : ""} 
              ${isGameOver && blinkers[3 * row + col] ? "blink" : ""}
            `}
              onClick={() => handleClick(row, col)}
            >
              {cell === 0 ? "X" : cell === 1 ? "O" : ""}
            </div>
          ))
        )}
      </div>

      {isGameOver && (
        <div className="control-mode">
          <button onClick={handleGameRestart}>Play Again</button>
        </div>
      )}
    </>
  );
}
