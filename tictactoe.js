#!/usr/bin/env node
/**
 * Tic Tac Toe — interactive two-player CLI
 *
 * Run with:  node tictactoe.js
 *
 * Players take turns entering a cell number (1-9):
 *   1 | 2 | 3
 *   ---------
 *   4 | 5 | 6
 *   ---------
 *   7 | 8 | 9
 */

'use strict';

const readline = require('readline');
const {
  createBoard,
  checkWinner,
  isGameOver,
  makeMove,
  renderBoard,
  switchPlayer,
} = require('./src/tictactoe');

// ─── helpers ────────────────────────────────────────────────────────────────

function clearScreen() {
  process.stdout.write('\x1Bc');
}

function printHeader() {
  console.log('╔═══════════════════════╗');
  console.log('║   T I C  T A C  T O E ║');
  console.log('╚═══════════════════════╝');
  console.log();
}

function printBoard(board) {
  console.log(renderBoard(board));
}

function printStatus(currentPlayer) {
  console.log(`  Player ${currentPlayer}'s turn — enter a cell number (1-9):`);
}

// ─── game loop ───────────────────────────────────────────────────────────────

function startGame() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let board = createBoard();
  let currentPlayer = 'X';

  function prompt() {
    clearScreen();
    printHeader();
    printBoard(board);

    if (isGameOver(board)) {
      const winner = checkWinner(board);
      if (winner) {
        console.log(`  🎉  Player ${winner} wins!\n`);
      } else {
        console.log("  It's a draw! Well played.\n");
      }
      rl.question('  Play again? (y/n): ', answer => {
        if (answer.trim().toLowerCase() === 'y') {
          board = createBoard();
          currentPlayer = 'X';
          prompt();
        } else {
          console.log('\n  Thanks for playing!\n');
          rl.close();
        }
      });
      return;
    }

    printStatus(currentPlayer);

    rl.question('  > ', input => {
      const raw = input.trim();
      const num = parseInt(raw, 10);

      // Validate input
      if (isNaN(num) || num < 1 || num > 9) {
        console.log('\n  ⚠  Please enter a number between 1 and 9.');
        setTimeout(prompt, 900);
        return;
      }

      const index = num - 1; // convert 1-based input to 0-based index
      const next = makeMove(board, index, currentPlayer);

      if (next === null) {
        console.log('\n  ⚠  That cell is already taken — choose another.');
        setTimeout(prompt, 900);
        return;
      }

      board = next;
      currentPlayer = switchPlayer(currentPlayer);
      prompt();
    });
  }

  prompt();
}

// ─── entry point ─────────────────────────────────────────────────────────────

startGame();
