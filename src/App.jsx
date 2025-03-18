import { useEffect, useState } from "react";
import { socket } from "./socket";
import GamePlay from "./components/GamePlay";

export default function App() {
  const [isPlayerModeVisible, setPlayerVisibility] = useState(true);
  const [isSingle, setSingleLife] = useState(true);
  const [isDiffVisible, setDiffVisibility] = useState(false);
  const [difficulty, setDifficulty] = useState(-1);
  const [isPlaying, setGamePlay] = useState(false);
  const [isOnline, setOnline] = useState(false);
  const [isOnlineVisible, setOnlineVisibility] = useState(false);
  const [isRoomVisible, setRoomVisibility] = useState(false);
  const [isWaiting, setWaiting] = useState(false);
  const [isJoining, setJoining] = useState(false);

  useEffect(() => {
    if (isOnline) {
      socket.connect();
      console.log("we are online!");
    } else {
      socket.disconnect();
      console.log("we are offline!");
    }
  }, [isOnline]);

  function handleModeSelect(player) {
    setPlayerVisibility(false);
    setSingleLife(player === 1);

    if (player === 1) setDiffVisibility(true);
    else setOnlineVisibility(true);
  }

  function handleDiffSelect(selectedDifficulty) {
    setDifficulty(selectedDifficulty);
    setDiffVisibility(false);
    setGamePlay(true);
  }

  function handleOnlineSelect(onlineMode) {
    setOnline(onlineMode);
    setOnlineVisibility(false);

    if (onlineMode) setRoomVisibility(true);
    else setGamePlay(true);
  }

  function handleRoomCreation() {
    setRoomVisibility(false);
    setWaiting(true);
  }

  function handleRoomJoiner() {
    setRoomVisibility(false);
    setJoining(true);
  }

  function handleOpponentJoin() {
    setWaiting(false);
    setGamePlay(true);
  }

  function handleRoomJoining() {
    setJoining(false);
    setGamePlay(true);
  }

  function handleGameReset() {
    setPlayerVisibility(true);
    setDiffVisibility(false);
    setOnlineVisibility(false);
    setRoomVisibility(false);
    setGamePlay(false);
    setDifficulty(-1);
    setOnline(false);
    setWaiting(false);
    setJoining(false);
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
      {isOnlineVisible && (
        <div className="control-mode">
          <button onClick={() => handleOnlineSelect(false)}>Offline</button>
          <button onClick={() => handleOnlineSelect(true)}>Online</button>
        </div>
      )}
      {isRoomVisible && (
        <div className="control-mode">
          <button onClick={handleRoomCreation}>Create Room</button>
          <button onClick={handleRoomJoiner}>Join Room</button>
        </div>
      )}
      {isWaiting && (
        <>
          <div onClick={handleOpponentJoin}>Waiting...</div>
          <div>Room ID: *from backend*</div>
        </>
      )}
      {isJoining && (
        <form id="room-form" onSubmit={handleRoomJoining}>
          <label htmlFor="room-id">Enter Room ID: </label>
          <input type="text" id="room-id" />
          <button type="submit">Join</button>
        </form>
      )}
    </>
  );
}
