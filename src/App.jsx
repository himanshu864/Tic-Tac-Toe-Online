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
  const [roomID, setRoomID] = useState("");
  const [isRoomVisible, setRoomVisibility] = useState(false);
  const [hasFriendOnline, setFriendOnline] = useState(false);
  const [isFriendsVisible, setFriendVisibility] = useState(false);
  const [isWaiting, setWaiting] = useState(false);
  const [isJoining, setJoining] = useState(false);

  const roomRef = useRef();

  useEffect(() => {
    socket.on("friend-join", handleOpponentJoin);
    socket.on("random-join", handleOpponentJoin);
    socket.on("opponent-left", handleOpponentLeave);

    return () => {
      socket.off("friend-join");
      socket.off("random-join");
      socket.off("opponent-left");
    };
  }, []);

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

    if (onlineMode) setFriendVisibility(true);
    else setGamePlay(true);
  }

  function handleFriendSelect() {
    setFriendOnline(true);
    setFriendVisibility(false);
    setRoomVisibility(true);
  }

  function handleRandomSelect() {
    setFriendVisibility(false);
    socket.emit("random-room", (error, isLonely) => {
      if (!error) {
        if (isLonely) setWaiting(true);
        else setGamePlay(true);
      } else alert("Room creation failed: " + error.error);
    });
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

  function handleOpponentJoin() {
    setWaiting(false);
    setGamePlay(true);
  }

  function handleOpponentLeave() {
    setGamePlay(false);
    setWaiting(true);
  }

  function handleGameReset() {
    setPlayerVisibility(true);
    setDiffVisibility(false);
    setOnlineVisibility(false);
    setRoomVisibility(false);
    setFriendVisibility(false);
    setGamePlay(false);
    setDifficulty(-1);
    setOnline(false);
    setFriendOnline(false);
    setWaiting(false);
    setJoining(false);
  }

  function handleCopyClipboard() {
    navigator.clipboard.writeText(roomID).then(() => {
      const copyBtn = document.querySelector(".copy-btn");
      copyBtn.classList.add("copied", "copied-pulse");

      setTimeout(() => {
        copyBtn.classList.remove("copied", "copied-pulse");
      }, 1000);
    });
  }

  return (
    <>
      <h1 className="heading" onClick={handleGameReset}>
        TIC TAC TOE
      </h1>

      {/* Settings */}
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
      {isFriendsVisible && (
        <div className="control-mode">
          <button onClick={handleFriendSelect}>Friend</button>
          <button onClick={handleRandomSelect}>Random</button>
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
          <div className="loader"></div>
          {hasFriendOnline && (
            <div className="room-section">
              <div className="room-id-container">
                <div className="room-id">{roomID}</div>
                <button className="copy-btn" onClick={handleCopyClipboard}>
                  Copy
                </button>
              </div>
            </div>
          )}
        </>
      )}
      {isJoining && (
        <div className="join-room-container">
          <div className="join-room-label">Enter Room ID:</div>
          <input
            type="text"
            className="join-room-input"
            ref={roomRef}
            placeholder="Paste here"
          />
          <button className="join-btn" onClick={handleRoomJoining}>
            Join
          </button>
        </div>
      )}

      {/* Mounting and unmounting leads to grid/game reset */}
      {isPlaying && (
        <GamePlay
          isSingle={isSingle}
          difficulty={difficulty}
          isOnline={isOnline}
        />
      )}
    </>
  );
}
