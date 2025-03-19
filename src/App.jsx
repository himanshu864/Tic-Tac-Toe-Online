import { useEffect, useRef, useState } from "react";
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
  const [roomID, setRoomID] = useState("");

  const roomRef = useRef();

  useEffect(() => {
    socket.on("opponent-join", handleOpponentJoin);
    return () => socket.off("opponent-join");
  }, []);

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
    socket.emit("create-room", (error, room) => {
      if (!error) setRoomID(room);
      else alert("Room creation failed: " + error.error);
    });
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
    const room = roomRef.current.value;
    socket.emit("join-room", room, (error) => {
      if (error) alert("Connection Failed: " + error.error);
      else {
        setJoining(false);
        setGamePlay(true);
      }
    });
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
          <div>Waiting...</div>
          <div>Room ID: {roomID}</div>
        </>
      )}
      {isJoining && (
        <>
          <div>Enter Room ID: </div>
          <input type="text" id="room-id" ref={roomRef} />
          <button onClick={handleRoomJoining}>Join</button>
        </>
      )}
    </>
  );
}
