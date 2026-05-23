/**
 * Tic Tac Toe — core game logic (no I/O, fully testable)
 *
 * Board is represented as a 9-element array (indices 0-8):
 *   0 | 1 | 2
 *   ---------
 *   3 | 4 | 5
 *   ---------
 *   6 | 7 | 8
 *
 * Each cell holds null, 'X', or 'O'.
 */

const WINNING_LINES = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left column
  [1, 4, 7], // middle column
  [2, 5, 8], // right column
  [0, 4, 8], // diagonal top-left → bottom-right
  [2, 4, 6], // diagonal top-right → bottom-left
];

/**
 * Creates and returns a fresh, empty board.
 * @returns {Array<null>} 9-element array of nulls
 */
function createBoard() {
  return Array(9).fill(null);
}

/**
 * Returns the winner ('X' or 'O') if one exists, otherwise null.
 * @param {Array} board
 * @returns {'X'|'O'|null}
 */
function checkWinner(board) {
  for (const [a, b, c] of WINNING_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

/**
 * Returns true when every cell is filled (no more moves possible).
 * @param {Array} board
 * @returns {boolean}
 */
function isBoardFull(board) {
  return board.every(cell => cell !== null);
}

/**
 * Returns true when the game is over (win or draw).
 * @param {Array} board
 * @returns {boolean}
 */
function isGameOver(board) {
  return checkWinner(board) !== null || isBoardFull(board);
}

/**
 * Attempts to place a mark on the board.
 * Returns a new board array on success, or null if the move is invalid.
 * @param {Array} board
 * @param {number} index  0-based cell index
 * @param {'X'|'O'} player
 * @returns {Array|null}
 */
function makeMove(board, index, player) {
  if (index < 0 || index > 8) return null;
  if (board[index] !== null) return null;

  const next = [...board];
  next[index] = player;
  return next;
}

/**
 * Renders the board as a human-readable string.
 * Empty cells show their 1-based position number as a hint.
 * @param {Array} board
 * @returns {string}
 */
function renderBoard(board) {
  const display = board.map((cell, i) => (cell === null ? String(i + 1) : cell));

  return [
    '',
    ` ${display[0]} | ${display[1]} | ${display[2]} `,
    '---+---+---',
    ` ${display[3]} | ${display[4]} | ${display[5]} `,
    '---+---+---',
    ` ${display[6]} | ${display[7]} | ${display[8]} `,
    '',
  ].join('\n');
}

/**
 * Returns the other player.
 * @param {'X'|'O'} player
 * @returns {'O'|'X'}
 */
function switchPlayer(player) {
  return player === 'X' ? 'O' : 'X';
}

module.exports = {
  createBoard,
  checkWinner,
  isBoardFull,
  isGameOver,
  makeMove,
  renderBoard,
  switchPlayer,
  WINNING_LINES,
};
