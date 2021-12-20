const fs = require('fs')
const {join} = require('path')

const file = fs.readFileSync(join(__dirname, '../input.txt'), 'utf8')
let [_, x1, x2, y1, y2] = file.match(/target area: x=(\d+)..(\d+), y=(-?\d+)..(-?\d+)/).map(n => Number(n))

if (x1 > x2) [x1, x2] = [x2, x1]
if (y1 < y2) [y1, y2] = [y2, y1]

function reachesY(yv) {
  let y = 0
  let max = 0

  while (y >= y2) {
    if (y <= y1) return max

    y += yv

    if (y > max) max = y
    yv--
  }

  return 0
}

function reachesXY(xv, yv) {
  let y = 0
  let x = 0

  while (y >= y2 && x <= x2) {
    if (y <= y1 && x >= x1) return true

    y += yv
    x += xv

    yv--
    if (xv > 0) xv--
    if (xv < 0) xv++
  }

  return false
}

// Problem 1
{
  // for problem 1 you can ingore the x velocity

  for (let i = 1000; i > 0; i--) {
    let max = reachesY(i)
    if (max) {
      console.log(`Answer 1: ${max}`);
      break
    }
  }
}

// Problem 2
{
  let count = 0
  for (let x = 0; x < 1000; x++) {
    for (let y = -1000; y < 1000; y++) {
      if (reachesXY(x, y)) {
        count++
      }
    }
  }
  console.log(`Answer 2: ${count}`);
}
