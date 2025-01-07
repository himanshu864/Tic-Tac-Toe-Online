import { useState } from "react";
import GamePlay from "./components/GamePlay";

export default function App() {
  const [isPlayerModeVisible, setPlayerVisibility] = useState(true);
  const [isSingle, setSingleLife] = useState(true);
  const [isDiffVisible, setDiffVisibility] = useState(false);
  const [difficulty, setDifficulty] = useState(-1);
  const [isPlaying, setGamePlay] = useState(false);

  function handleModeSelect(player) {
    setPlayerVisibility(false);
    setSingleLife(player === 1);

    if (player === 1) setDiffVisibility(true);
    else setGamePlay(true);
  }

  function handleDiffSelect(selectedDifficulty) {
    setDifficulty(selectedDifficulty);
    setDiffVisibility(false);
    setGamePlay(true);
  }

  function handleGameReset() {
    setPlayerVisibility(true);
    setDiffVisibility(false);
    setGamePlay(false);
    setDifficulty(-1);
  }

  return (
    <>
      <h1 className="heading" onClick={handleGameReset}>
        TIC TAC TOE
      </h1>

      {/* Mounting and unmounting leads to grid/game reset */}
      {isPlaying && <GamePlay isSingle={isSingle} difficulty={difficulty} />}

      {isPlayerModeVisible && (
        <div className="control-mode">
          <button onClick={() => handleModeSelect(1)}>Single Player</button>
          <button onClick={() => handleModeSelect(2)}>Two Players</button>
        </div>
      )}

      {isDiffVisible && (
        <div className="control-mode">
          <button onClick={() => handleDiffSelect(1)}>Easy</button>
          <button onClick={() => handleDiffSelect(2)}>Medium</button>
          <button onClick={() => handleDiffSelect(3)}>Impossible</button>
        </div>
      )}
    </>
  );
}
