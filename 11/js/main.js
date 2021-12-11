const fs = require('fs')
const {join} = require('path')

const file = fs.readFileSync(join(__dirname, '../input.txt'), 'utf8')
const input = file.split('\n').slice(0, -1).map(line => line.split('').map(n => Number(n)))

function step(state) {
  let flashes = 0

  function inc(x, y) {
    if (x < 0 || y < 0 || x > 9 || y > 9) {
      return
    }

    state[x][y]++

    if (state[x][y] >= 10) {
      flashes++
      state[x][y] = -20
      inc(x - 1, y - 1)
      inc(x - 1, y + 0)
      inc(x - 1, y + 1)
      inc(x + 0, y - 1)
      inc(x + 0, y + 0)
      inc(x + 0, y + 1)
      inc(x + 1, y - 1)
      inc(x + 1, y + 0)
      inc(x + 1, y + 1)
    }
  }

  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      inc(x, y)
    }
  }

  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      if (state[x][y] < 0) {
        state[x][y] = 0
      }
    }
  }

  return flashes
}

// Problem 1
{
  const grid = JSON.parse(JSON.stringify(input))
  let answer = 0

  for (let i = 0; i < 100; i++) {
    answer += step(grid)
  }

  console.log(`Answer 1: ${answer}`);
}


// Problem 2
{
  const grid = JSON.parse(JSON.stringify(input))

  let i = 0
  while (true) {
    i++ // start by incrementing next step
    if (step(grid) == 100) {
      console.log(`Answer 2: ${i}`);
      break
    }
  }
}
