import { useState } from "react";
import ScoreCard from "./components/ScoreCard.jsx";
import PlayerMode from "./components/PlayerMode.jsx";
import DifficultMode from "./components/DifficultMode.jsx";
import StartButton from "./components/StartButton.jsx";
import GameGrid from "./components/GameGrid.jsx";

export default function App() {
  const [isPlayerModeVisible, setPlayerVisibility] = useState(true);
  const [areYouSingle, setLoneliness] = useState(true);
  const [isDiffVisible, setDiffVisibility] = useState(false);
  const [difficulty, setDifficulty] = useState(-1);
  const [isGameOver, setGameOver] = useState(false);
  const [isGameOn, setGameOn] = useState(false);
  const [GameScore, setGameScore] = useState("");
  const [gameCount, setGameCount] = useState(0);
  const [playerScores, setPlayerScores] = useState([0, 0]);
  const [playerNames, setPlayerNames] = useState(["Player One", "Player Two"]);

  function handleModeSelect(player) {
    setPlayerVisibility(false);
    setLoneliness(player === 1);

    if (player === 1) setDiffVisibility(true);
    else setGameOver(true);
  }

  function handleDiffSelect(selectedDifficulty) {
    setDiffVisibility(false);
    setGameOver(true);
    setDifficulty(selectedDifficulty);
  }

  function handleGameStart() {
    setGameOver(false);
    setGameOn(true);

    setGameScore("");
    setGameCount((prev) => prev + 1);
  }

  /*
  -1 -> on Going
  0 -> player One
  1 -> player Two
  2 -> Draw
  */
  function handleGameOver(score) {
    if (score === 0) setGameScore(`You Won, ${playerNames[0]}!`);
    else if (score === 1) {
      if (areYouSingle) setGameScore(`You Lost, ${playerNames[0]}`);
      else setGameScore(`You Won, ${playerNames[1]}!`);
    } else setGameScore("It's a Draw!");

    if (score != 2) {
      setPlayerScores((prevScores) => {
        const newScores = [...prevScores];
        newScores[score]++;
        return newScores;
      });
    }
    setGameOver(true);
  }

  function handlePlayerNameEdit(playerIdx, playerName) {
    setPlayerNames((prevNames) => {
      const newNames = [...prevNames];
      newNames[playerIdx] = playerName;
      return newNames;
    });
  }

  return (
    <>
      <h1 className="heading" onClick={() => window.location.reload()}>
        TIC TAC TOE
      </h1>

      <div className="cards">
        <ScoreCard
          name={playerNames[0]}
          mark={"X"}
          score={playerScores[0]}
          onEdit={handlePlayerNameEdit}
        />
        <ScoreCard
          name={playerNames[1]}
          mark={"O"}
          score={playerScores[1]}
          onEdit={handlePlayerNameEdit}
        />
      </div>

      {isPlayerModeVisible && <PlayerMode onModeSelect={handleModeSelect} />}

      {isDiffVisible && <DifficultMode onDiffSelect={handleDiffSelect} />}

      {GameScore != "" && <div className="score">{GameScore}</div>}

      {/* Style and Blinking */}
      {isGameOn && (
        <GameGrid
          lonely={areYouSingle}
          difficulty={difficulty}
          trigger={gameCount}
          onGameOver={handleGameOver}
        />
      )}

      {isGameOver && (
        <StartButton onGameStart={handleGameStart} count={gameCount} />
      )}
    </>
  );
}
