export default function ScoreCardOnline({ isPlayerTurn, mark, playerScore }) {
  return (
    <div className={`card ${isPlayerTurn ? "card-turn" : ""}`}>
      <div className="player-score">
        {mark} - {playerScore}
      </div>
    </div>
  );
}
