const {
  createBoard,
  checkWinner,
  isBoardFull,
  isGameOver,
  makeMove,
  renderBoard,
  switchPlayer,
} = require('./tictactoe');

// ─── createBoard ────────────────────────────────────────────────────────────

describe('createBoard', () => {
  it('returns an array of length 9', () => {
    expect(createBoard()).toHaveLength(9);
  });

  it('fills every cell with null', () => {
    expect(createBoard().every(c => c === null)).toBe(true);
  });

  it('returns a new array each time', () => {
    expect(createBoard()).not.toBe(createBoard());
  });
});

// ─── makeMove ────────────────────────────────────────────────────────────────

describe('makeMove', () => {
  it('places the player mark at the given index', () => {
    const board = createBoard();
    const next = makeMove(board, 0, 'X');
    expect(next[0]).toBe('X');
  });

  it('does not mutate the original board', () => {
    const board = createBoard();
    makeMove(board, 4, 'O');
    expect(board[4]).toBeNull();
  });

  it('returns null for an already-occupied cell', () => {
    const board = createBoard();
    const after = makeMove(board, 0, 'X');
    expect(makeMove(after, 0, 'O')).toBeNull();
  });

  it('returns null for an out-of-range index', () => {
    expect(makeMove(createBoard(), -1, 'X')).toBeNull();
    expect(makeMove(createBoard(), 9, 'X')).toBeNull();
  });

  it('preserves all other cells unchanged', () => {
    const board = createBoard();
    const next = makeMove(board, 3, 'O');
    for (let i = 0; i < 9; i++) {
      if (i !== 3) expect(next[i]).toBeNull();
    }
  });
});

// ─── checkWinner ─────────────────────────────────────────────────────────────

describe('checkWinner', () => {
  it('returns null on an empty board', () => {
    expect(checkWinner(createBoard())).toBeNull();
  });

  it('detects a row win for X', () => {
    // top row
    const board = ['X', 'X', 'X', null, null, null, null, null, null];
    expect(checkWinner(board)).toBe('X');
  });

  it('detects a column win for O', () => {
    // left column
    const board = ['O', null, null, 'O', null, null, 'O', null, null];
    expect(checkWinner(board)).toBe('O');
  });

  it('detects a diagonal win for X', () => {
    // top-left to bottom-right
    const board = ['X', null, null, null, 'X', null, null, null, 'X'];
    expect(checkWinner(board)).toBe('X');
  });

  it('detects the anti-diagonal win for O', () => {
    // top-right to bottom-left
    const board = [null, null, 'O', null, 'O', null, 'O', null, null];
    expect(checkWinner(board)).toBe('O');
  });

  it('returns null when there is no winner yet', () => {
    const board = ['X', 'O', 'X', 'O', 'X', 'O', null, null, null];
    expect(checkWinner(board)).toBeNull();
  });

  it('detects all 8 winning lines', () => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    lines.forEach(([a, b, c]) => {
      const board = Array(9).fill(null);
      board[a] = board[b] = board[c] = 'X';
      expect(checkWinner(board)).toBe('X');
    });
  });
});

// ─── isBoardFull ─────────────────────────────────────────────────────────────

describe('isBoardFull', () => {
  it('returns false for an empty board', () => {
    expect(isBoardFull(createBoard())).toBe(false);
  });

  it('returns false when some cells are empty', () => {
    const board = Array(9).fill('X');
    board[8] = null;
    expect(isBoardFull(board)).toBe(false);
  });

  it('returns true when all cells are filled', () => {
    expect(isBoardFull(Array(9).fill('X'))).toBe(true);
  });
});

// ─── isGameOver ──────────────────────────────────────────────────────────────

describe('isGameOver', () => {
  it('returns false on an empty board', () => {
    expect(isGameOver(createBoard())).toBe(false);
  });

  it('returns true when there is a winner', () => {
    const board = ['X', 'X', 'X', null, null, null, null, null, null];
    expect(isGameOver(board)).toBe(true);
  });

  it('returns true on a full board (draw)', () => {
    // X O X / O X X / O X O — no winner
    const board = ['X', 'O', 'X', 'O', 'X', 'X', 'O', 'X', 'O'];
    expect(isGameOver(board)).toBe(true);
  });

  it('returns false when the game is still in progress', () => {
    const board = ['X', 'O', null, null, null, null, null, null, null];
    expect(isGameOver(board)).toBe(false);
  });
});

// ─── switchPlayer ────────────────────────────────────────────────────────────

describe('switchPlayer', () => {
  it('switches X to O', () => {
    expect(switchPlayer('X')).toBe('O');
  });

  it('switches O to X', () => {
    expect(switchPlayer('O')).toBe('X');
  });
});

// ─── renderBoard ─────────────────────────────────────────────────────────────

describe('renderBoard', () => {
  it('shows position numbers for empty cells', () => {
    const rendered = renderBoard(createBoard());
    expect(rendered).toContain('1');
    expect(rendered).toContain('9');
  });

  it('shows X and O marks for filled cells', () => {
    const board = makeMove(createBoard(), 0, 'X');
    const rendered = renderBoard(board);
    expect(rendered).toContain('X');
  });

  it('does not show a number for a filled cell', () => {
    // Cell 0 is filled — the digit '1' should not appear as a position hint
    const board = makeMove(createBoard(), 0, 'X');
    const rendered = renderBoard(board);
    // The first cell should now be 'X', not '1'
    // Check that the rendered string has X in the first cell position
    const lines = rendered.split('\n').filter(l => l.trim());
    expect(lines[0]).toMatch(/X/);
    expect(lines[0]).not.toMatch(/^[\s]*1/);
  });

  it('returns a string', () => {
    expect(typeof renderBoard(createBoard())).toBe('string');
  });
});
