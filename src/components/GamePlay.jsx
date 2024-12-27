import { useState } from "react";
import ScoreCard from "./ScoreCard.jsx";
import GameGrid from "./GameGrid.jsx";
import {
  availableMoves,
  combinations,
  initialGrid,
  winCheck,
} from "../utils/GameUtils.js";

const marks = ["X", "O"];

export default function GamePlay({ isSingle, difficulty }) {
  const [playerNames, setPlayerNames] = useState(["Player One", "Player Two"]);
  const [playerScores, setPlayerScores] = useState([0, 0]);
  const [gameResult, setGameResult] = useState("");
  const [grid, setGrid] = useState(initialGrid);

  function handlePlayerNameEdit(playerIdx, playerName) {
    setPlayerNames((prevNames) => {
      const newNames = [...prevNames];
      newNames[playerIdx] = playerName;
      return newNames;
    });
  }

  function blinkIt(newGrid) {
    for (const line of combinations)
      if (
        line.every((i) => newGrid[Math.floor(i / 3)][i % 3] === 0) ||
        line.every((i) => newGrid[Math.floor(i / 3)][i % 3] === 1)
      )
        return line;
    return [];
  }

  function handleGameOver(score) {
    if (score === 0) setGameResult(`You Won, ${playerNames[0]}!`);
    if (score === 1) {
      if (isSingle) setGameResult(`You Lost, ${playerNames[0]}`);
      else setGameResult(`You Won, ${playerNames[1]}!`);
    }
    if (score === 2) setGameResult("It's a Draw!");

    if (score !== 2) {
      setPlayerScores((prevScores) => {
        const newScores = [...prevScores];
        newScores[score]++;
        return newScores;
      });
    }
  }

  // Updates grid based on click and checks gameover
  function updateGrid(grid, row, col) {
    const newGrid = JSON.parse(JSON.stringify(grid)); // Deep copy to avoid mutation
    const playerOneTurn = availableMoves(newGrid).length % 2;
    newGrid[row][col] = playerOneTurn ? 0 : 1;
    setGrid(newGrid);

    const score = winCheck(newGrid);
    let blinkers = [-1];
    if (score !== -1) {
      handleGameOver(score);
      blinkers = blinkIt(newGrid);
    }
    return [newGrid, score !== -1, blinkers];
  }

  function handleGameRestart() {
    setGrid(initialGrid);
    setGameResult("");
  }

  return (
    <>
      <div className="cards">
        {marks.map((mark, i) => (
          <ScoreCard
            isPlayerOneTurn={availableMoves(grid).length % 2 === 1}
            playerName={playerNames[i]}
            mark={mark}
            playerScore={playerScores[i]}
            onPlayerNameEdit={handlePlayerNameEdit}
            key={i}
          />
        ))}
      </div>

      {gameResult !== "" && <div className="result">{gameResult}</div>}

      <GameGrid
        grid={grid}
        isSingle={isSingle}
        difficulty={difficulty}
        updateGrid={updateGrid}
      />

      {winCheck(grid) !== -1 && (
        <div className="control-mode">
          <button onClick={handleGameRestart}>Play Again</button>
        </div>
      )}
    </>
  );
}
