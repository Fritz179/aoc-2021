const fs = require('fs')
const {join} = require('path')

const file = fs.readFileSync(join(__dirname, '../input.txt'), 'utf8')
const [cords, foldsAt] = file.split('\n\n').map(part => part.split('\n'))

function assert(cond, message) {
  if (!cond) throw message
}

const N = 1500
const grid = []
for (let y = 0; y < N; y++) {
  grid[y] = []
  for (let x = 0; x < N; x++) {
    grid[y][x] = 0
  }
}

for (cord of cords) {
  const [x, y] = cord.split(',')
  assert(x < N && y < N, `N to small: ${N}, x: ${x}, y: ${y}`)
  grid[y][x] = 1
}

const folds = foldsAt.slice(0, -1).map(split => split.split(' ')[2].split('='))

function print(state) {
  console.log('');
  for (line of state) {
    console.log(line.map(el => el ? '##' : '..').join(''));
  }
}

function fold(state, [dir, at]) {
  if (dir == 'y') {
    for (let i = 0; i < at; i++) {
      const upperLine = state[i]
      const lowerLine = state[at * 2 - i]

      for (let x = 0; x < lowerLine.length; x++) {
        if (lowerLine[x]) {
          upperLine[x] = 1
        }
      }
    }

    return state.splice(0, at)
  }

  // x fold
  for (row of state) {
    for (let i = 0; i < at; i++) {
      if (row[at * 2 - i]) {
        row[i] = 1
      }
    }
  }

  return state.map(row => row.splice(0, at))
}

// Problem 1
{
  const state = JSON.parse(JSON.stringify(grid))
  const foldOne = fold(state, folds[0])

  let answer = 0
  for (row of foldOne) {
    for (tile of row) {
      if (tile) {
        answer++
      }
    }
  }

  console.log(`Answer 1: ${answer}`)
}

// Problem 2
{
  let state = JSON.parse(JSON.stringify(grid))
  folds.forEach(toFold => { state = fold(state, toFold) })

  console.log('Answer 2:');
  print(state)
}
