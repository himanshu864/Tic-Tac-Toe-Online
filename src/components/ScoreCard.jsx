import { useRef, useState } from "react";

export default function ScoreCard({ name, mark, score, onEdit }) {
  const [isEdit, setEdit] = useState(false);

  const inputRef = useRef();

  function handleEdit() {
    if (isEdit) onEdit(mark === "X" ? 0 : 1, inputRef.current.value);
    setEdit((edit) => !edit);
  }

  return (
    <div className="card">
      <div className="player-editer">
        {!isEdit ? (
          <span className="player player-name">{name}</span>
        ) : (
          <input
            type="text"
            className="player p-input"
            defaultValue={name}
            ref={inputRef}
          />
        )}

        <span className="edit" onClick={handleEdit}>
          {isEdit ? "Save" : "Edit"}
        </span>
      </div>

      <div className="score-container">
        {mark} - {score}
      </div>
    </div>
  );
}
