export default function StartButton({ onGameStart, count }) {
  return (
    <div>
      <button id="control-button" onClick={() => onGameStart()}>
        {count == 0 ? "Start New Game" : "Play Again"}
      </button>
    </div>
  );
}
