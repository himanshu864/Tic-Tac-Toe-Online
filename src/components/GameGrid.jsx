import { useState, useEffect } from "react";
import { initialGrid, availableMoves, winCheck } from "../utils/GameUtils.js";
import randomAI from "../utils/randomAI.js";
import instantKill from "../utils/instantKill.js";
import impossibleAI from "../utils/impossibleAI.js";

// fix this shit. Also type stronger. No more == or !=, only === and !==
let gameOver = false;

export default function GameGrid({ lonely, difficulty, trigger, onGameOver }) {
  const [grid, setGrid] = useState(initialGrid);
  const [isGamePaused, setGamePause] = useState(false);

  // Resets Game when restart
  useEffect(() => {
    setGrid(initialGrid);
    gameOver = false;
  }, [trigger]);

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

  // Updates grid based on click and checks gameover
  function updateGrid(grid, row, col) {
    const newGrid = JSON.parse(JSON.stringify(grid)); // Deep copy to avoid mutation
    const playerOneTurn = availableMoves(newGrid).length % 2;
    newGrid[row][col] = playerOneTurn ? 0 : 1;
    setGrid(newGrid);

    const score = winCheck(newGrid);
    if (score !== -1) {
      gameOver = true;
      onGameOver(score);
    }
    return newGrid;
  }

  // Main function
  async function handleClick(row, col) {
    if (isGamePaused || gameOver || grid[row][col] !== -1) return;

    // Player Moves
    const newGrid = updateGrid(grid, row, col);

    // Computer Moves
    if (lonely && !gameOver) {
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
            className={`tile ${cell === 0 || cell === 1 ? "won" : ""}`}
            onClick={() => handleClick(row, col)}
          >
            {cell === 0 ? "X" : cell === 1 ? "O" : ""}
          </div>
        ))
      )}
    </div>
  );
}
