const fs = require('fs')
const {join} = require('path')

const file = fs.readFileSync(join(__dirname, '../input.txt'), 'utf8')
const inputs = file.split('\n').slice(0, -1)

const numbers = inputs.shift().split(',').map(n => Number(n))
const boards = []

while (inputs.length) {
  inputs.shift()

  const board = []
  boards[boards.length] = board

  for (let i = 0; i < 5; i++) {
    const row = inputs.shift().split('')

    for (let j = 0; j < 5; j++) {
      const num = row.shift() + row.shift()
      row.shift()
      board.push({num: Number(num), marked: false})
    }
  }
}

function checkWin(borad) {

  // cols
  for (let x = 0; x < 5; x++) {
    let won = true
    for (let y = 0; y < 5; y++) {
      if (!board[x + y * 5].marked) {
        won = false
        break
      }
    }

    if (won) return true
  }

  // rows
  for (let y = 0; y < 5; y++) {
    let won = true
    for (let x = 0; x < 5; x++) {
      if (!board[x + y * 5].marked) {
        won = false
        break
      }
    }

    if (won) return true
  }
}

// Problem 1
{
  start: for (number of numbers) {
    for (board of boards) {
      for (pos of board) {
        if (pos.num == number) {
          pos.marked = true

          const won = checkWin(board)
          if (won) {
            let sum = 0
            for (calc of board) {
              if (!calc.marked) {
                sum += calc.num
              }
            }
            console.log(`Answer 1: ${sum * number}`);
            break start;
          }
        }
      }
    }
  }
}


for (board of boards) {
  for (pos of board) {
    pos.marked = false
  }
}

// Problem 2
{
  let lastBoard = []

  start: for (number of numbers) {
    let winners = 0
    for (board of boards) {
      for (pos of board) {
        if (pos.num == number) {
          pos.marked = true
        }
      }

      if (checkWin(board)) {
        winners++
      }
    }

    if (winners == boards.length) {
      let sum = 0
      for (calc of lastBoard) {
        if (!calc.marked) {
          sum += calc.num
        }
      }

      console.log(`Answer 2: ${sum * number}`);
      break start;
    }

    if (winners == boards.length - 1) {
      for (board of boards) {
        if (!checkWin(board)) {
          lastBoard = board
        }
      }
    }
  }
}
