import { availableMoves, winCheck } from "./GameUtils";

// Heart of the algorithm : Backtracking Tree of future outcomes
// Minimize loss and Maximize Vistory!
// Calc all possible outcomes and allot them utility accordingly

// Utility = (remaining tiles + 1) * sign;
// sign : +ve for AI win, -ve for AI lose, 0 for draw
// We assume Player will move their best move, hence minimize score
// While we maximize our score.
function minMax(grid, isAITurn) {
  const moves = availableMoves(grid);
  const score = winCheck(grid);

  if (score === 0) return (moves.length + 1) * -1; // Player wins
  if (score === 1) return moves.length + 1; // AI wins
  if (score === 2) return 0; // draw

  // set initial score = -Infinity for AI to beat it
  let bestScore = isAITurn ? -Infinity : Infinity;

  for (const move of moves) {
    grid[Math.floor(move / 3)][move % 3] = isAITurn ? 1 : 0; // make move

    // Recursively call minMax and determine the score
    const currScore = minMax(grid, !isAITurn);

    grid[Math.floor(move / 3)][move % 3] = -1; // backtrack

    // make current player choose best score for himself
    if (isAITurn) bestScore = Math.max(bestScore, currScore);
    else bestScore = Math.min(bestScore, currScore);
  }
  return bestScore;
}

// AI function to make best possible move
export default function impossibleAI(newGrid) {
  let bestMove = null;
  let bestScore = -100;
  let grid = JSON.parse(JSON.stringify(newGrid));

  // checks which move has best score for AI
  const moves = availableMoves(newGrid);
  for (const move of moves) {
    grid[Math.floor(move / 3)][move % 3] = 1;
    const score = minMax(grid, false);
    grid[Math.floor(move / 3)][move % 3] = -1;

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  return bestMove;
}
