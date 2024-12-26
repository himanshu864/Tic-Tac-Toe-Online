import { useState, useRef } from "react";

export default function ScoreCard({
  isPlayerOneTurn,
  playerName,
  mark,
  playerScore,
  onPlayerNameEdit,
}) {
  const [isEdit, setEdit] = useState(false);

  const inputRef = useRef();

  function handleEdit() {
    if (isEdit) onPlayerNameEdit(mark === "X" ? 0 : 1, inputRef.current.value);
    setEdit((edit) => !edit);
  }

  const playerTurn =
    (isPlayerOneTurn && mark === "X") || (!isPlayerOneTurn && mark === "O");

  return (
    <div className={`card ${playerTurn ? "card-turn" : ""}`}>
      <div className="player-editer">
        {!isEdit ? (
          <span className="player player-name">{playerName}</span>
        ) : (
          <input
            type="text"
            className="player p-input"
            defaultValue={playerName}
            ref={inputRef}
          />
        )}

        <span className="edit" onClick={handleEdit}>
          {isEdit ? "Save" : "Edit"}
        </span>
      </div>
      {mark} - {playerScore}
    </div>
  );
}
