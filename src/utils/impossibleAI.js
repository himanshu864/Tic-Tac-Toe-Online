import { availableMoves, winCheck } from "./GameUtils";

// Heart of the algorithm : Backtracking Tree of future outcomes
// Minimize loss and Maximize Vistory!
// Calc all possible outcomes and allot them utility accordingly

// Utility = (remaining_tiles + 1) * sign;
// sign : +ve for AI win, -ve for AI lose, 0 for draw
// We assume Player will move their best move, hence minimize score
// While we as AI, maximize score

const memo = new Map();

function minMax(grid, isAITurn, alpha, beta) {
  const key = grid.flat().join("") + isAITurn;
  if (memo.has(key)) return memo.get(key); // memoization

  const moves = availableMoves(grid);
  const score = winCheck(grid);

  if (score === 0) return (moves.length + 1) * -1; // Player wins
  if (score === 1) return moves.length + 1; // AI wins
  if (score === 2) return 0; // draw

  let bestScore = isAITurn ? -Infinity : Infinity;

  for (const move of moves) {
    grid[Math.floor(move / 3)][move % 3] = isAITurn ? 1 : 0;
    const currScore = minMax(grid, !isAITurn, alpha, beta);
    grid[Math.floor(move / 3)][move % 3] = -1;

    if (isAITurn) {
      bestScore = Math.max(bestScore, currScore);
      alpha = Math.max(alpha, bestScore);
    } else {
      bestScore = Math.min(bestScore, currScore);
      beta = Math.max(beta, bestScore);
    }

    if (beta <= alpha) break; // alpha-beta pruning
  }

  memo.set(key, bestScore);
  return bestScore;
}

// AI function to make best possible move
export default function impossibleAI(grid) {
  let bestMove = null;
  let bestScore = -100;

  // checks which move has best score for AI
  const moves = availableMoves(grid);
  for (const move of moves) {
    grid[Math.floor(move / 3)][move % 3] = 1;
    const score = minMax(grid, false, -Infinity, Infinity);
    grid[Math.floor(move / 3)][move % 3] = -1;

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  return bestMove;
}
