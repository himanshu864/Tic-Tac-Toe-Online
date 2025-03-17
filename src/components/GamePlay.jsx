import { useState } from "react";
import ScoreCard from "./ScoreCard.jsx";
import GameGrid from "./GameGrid.jsx";
import ProgressBar from "./ProgressBar.jsx";
import {
  availableMoves,
  blinkIt,
  initialGrid,
  winCheck,
} from "../utils/GameUtils.js";

const marks = ["X", "O"];

export default function GamePlay({ isSingle, difficulty }) {
  const [playerNames, setPlayerNames] = useState(["MAX", "MIN"]);
  const [playerScores, setPlayerScores] = useState([0, 0]);
  const [gameResult, setGameResult] = useState("");
  const [grid, setGrid] = useState(initialGrid);
  const [isGameOver, setGameOver] = useState(false);
  const [blinkers, setBlinkers] = useState(new Array(9).fill(false));

  function handlePlayerNameEdit(playerIdx, playerName) {
    setPlayerNames((prevNames) => {
      const newNames = [...prevNames];
      newNames[playerIdx] = playerName;
      return newNames;
    });
  }

  function handleGameOver(score, newGrid) {
    setGameOver(true);
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
    setBlinkers(blinkIt(newGrid));
  }

  function updateGrid(grid, row, col) {
    const newGrid = JSON.parse(JSON.stringify(grid));
    const playerOneTurn = availableMoves(newGrid).length % 2;
    newGrid[row][col] = playerOneTurn ? 0 : 1;
    setGrid(newGrid);

    const score = winCheck(newGrid);
    if (score === -1) return [newGrid, false];

    handleGameOver(score, newGrid);
    return [newGrid, true];
  }

  function handleGameRestart() {
    setGrid(initialGrid);
    setGameResult("");
    setGameOver(false);
    setBlinkers(blinkIt(initialGrid));
  }

  const isPlayerOneTurn = availableMoves(grid).length % 2 === 1;

  return (
    <>
      <div className="cards">
        {marks.map((mark, i) => (
          <ScoreCard
            key={i}
            isPlayerOneTurn={isPlayerOneTurn}
            playerName={playerNames[i]}
            mark={mark}
            playerScore={playerScores[i]}
            onPlayerNameEdit={handlePlayerNameEdit}
          />
        ))}
      </div>

      {gameResult !== "" ? (
        <div className="result">{gameResult}</div>
      ) : (
        <ProgressBar
          key={grid}
          isPlayerOneTurn={isPlayerOneTurn}
          handleGameOver={handleGameOver}
        />
      )}

      <GameGrid
        grid={grid}
        updateGrid={updateGrid}
        isSingle={isSingle}
        difficulty={difficulty}
        isGameOver={isGameOver}
        blinkers={blinkers}
      />

      {isGameOver && (
        <div className="control-mode">
          <button onClick={handleGameRestart}>Play Again</button>
        </div>
      )}
    </>
  );
}
