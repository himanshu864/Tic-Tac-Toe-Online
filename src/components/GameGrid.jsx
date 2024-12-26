import { useState } from "react";
import randomAI from "../utils/randomAI.js";
import instantKill from "../utils/instantKill.js";
import impossibleAI from "../utils/impossibleAI.js";
import { winCheck } from "../utils/GameUtils.js";

export default function GameGrid({ grid, isSingle, difficulty, updateGrid }) {
  const [isGamePaused, setGamePause] = useState(false);

  const isGameOver = winCheck(grid) !== -1;

  // handle Game Pause Asyncronously
  const delay = (ms) =>
    new Promise((resolve) => {
      setGamePause(true);
      setTimeout(() => {
        setGamePause(false);
        return resolve();
      }, ms);
    });

  // Decides AI move based on difficulty
  function moveAI(grid) {
    if (difficulty === 3) return impossibleAI(grid);
    if (difficulty === 2) {
      const instantWin = instantKill(grid, 1);
      if (instantWin !== -1) return instantWin;
      const instantSave = instantKill(grid, 0);
      if (instantSave !== -1) return instantSave;
    }
    return randomAI(grid);
  }

  async function handleClick(row, col) {
    if (isGamePaused || isGameOver || grid[row][col] !== -1) return;

    // Player Moves
    const [newGrid, score] = updateGrid(grid, row, col);
    // return new Score to ensure game isn't over,
    // Since isGameOver state will update later

    // Computer Moves
    if (isSingle && score === -1) {
      const x = moveAI(newGrid);
      await delay(600);
      updateGrid(newGrid, Math.floor(x / 3), x % 3);
    }
  }

  return (
    <div className="game-grid">
      {grid.map((line, row) =>
        line.map((cell, col) => (
          <div
            key={3 * row + col}
            className={`
              tile 
              ${cell !== -1 ? "pushed" : "pressed"} 
              ${!isGameOver && !isGamePaused && cell === -1 ? "pushable" : ""}
            `}
            onClick={() => handleClick(row, col)}
          >
            {cell === 0 ? "X" : cell === 1 ? "O" : ""}
          </div>
        ))
      )}
    </div>
  );
}
