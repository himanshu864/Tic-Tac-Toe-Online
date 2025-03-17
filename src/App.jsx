import { useEffect, useState } from "react";
import { socket } from "./socket";
import GamePlay from "./components/GamePlay";
import { ConnectionManager } from "./components/ConnectionManager";

export default function App() {
  const [isPlayerModeVisible, setPlayerVisibility] = useState(true);
  const [isSingle, setSingleLife] = useState(true);
  const [isDiffVisible, setDiffVisibility] = useState(false);
  const [difficulty, setDifficulty] = useState(-1);
  const [isPlaying, setGamePlay] = useState(false);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState([]);

  // Handle states with socket connection
  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("foo", "Hello Everyone!"); // emit a custom event
    });

    socket.on("disconnect", () => setIsConnected(false));

    // Listen for a custom event
    socket.on("bar", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // clean up event listens on unmount
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("bar");
    };
  }, []);

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

      {/* Socket Dynamic Rendering */}
      <p>Connected: {isConnected ? "Yes" : "No"}</p>
      <h2>Messages</h2>
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
      <ConnectionManager />

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
