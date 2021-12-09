const fs = require('fs')
const {join} = require('path')

const file = fs.readFileSync(join(__dirname, '../input.txt'), 'utf8')
const floor = file.split('\n').slice(0, -1).map(line => line.split('').map(n => Number(n)))

const h = floor.length
const w = floor[0].length

function isLower(y, x) {
  const tile = floor[y][x]

  if (y > 0 && floor[y - 1][x] <= tile) return false // top
  if (x > 0 && floor[y][x - 1] <= tile) return false // left
  if (x < w - 1 && floor[y][x + 1] <= tile) return false // right
  if (y < h - 1 && floor[y + 1][x] <= tile) return false // bottom


  return true
}

// Problem 1
{
  let answer = 0

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (isLower(y, x)) {
        answer += floor[y][x] + 1
      }
    }
  }

  console.log(`Answer 1: ${answer}`);
}

function getBasin(y, x, checked = []) {
  if (x < 0 || x >= w || y < 0 || y >= h) return 0
  if (floor[y][x] == 9) return 0

  const key = `${y}_${x}`
  if (checked.includes(key)) return 0

  let count = 1 // itself
  checked.push(key)

  count += getBasin(y - 1, x, checked)
  count += getBasin(y + 1, x, checked)
  count += getBasin(y, x - 1, checked)
  count += getBasin(y, x + 1, checked)

  return count
}

// Problem 2
{
  const basins = []

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (isLower(y, x)) {
        basins.push(getBasin(y, x))
      }
    }
  }

  const sorted = basins.sort((a, b) => b - a)
  const answer = sorted[0] * sorted[1] * sorted[2]
  console.log(`Answer 2: ${answer}`);
}
