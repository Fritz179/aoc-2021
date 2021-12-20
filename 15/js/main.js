const fs = require('fs')
const {join} = require('path')

const file = fs.readFileSync(join(__dirname, '../input.txt'), 'utf8')
const input = file.split('\n').slice(0, -1).map(line => line.split('').map(n => Number(n)))

function getPath(map) {
  const h = map.length
  const w = map[0].length
  let solution = 0

  const hashes = {}
  let activePaths = {
    x: 0, y: 0, cost: 0, estimate: 0, next: null
  }

  function addPath(x, y, curr) {
    if (x < 0 || y < 0 || x >= w || y >= h) return
    if (x == w - 1 && y == h - 1) {
      solution = curr.cost + map[y][x]
      return
    }

    const hash = `${y}_${x}`

    const cost = curr.cost + map[y][x]
    const estimate = cost + w + h - x - y

    if (hashes[hash] && hashes[hash] <= cost) return
    hashes[hash] = cost

    const adding = {
      x, y, cost, estimate, next: null
    }

    let currAdd = activePaths
    let added = false
    while (currAdd.next) {
      if (estimate < currAdd.next.estimate) {
        added = true
        adding.next = currAdd.next
        currAdd.next = adding
        break
      }

      currAdd = currAdd.next
    }

    if (!added) {
      currAdd.next = adding
    }
  }

  while (activePaths && !solution) {
    const curr = activePaths
    const {x, y} = curr

    addPath(x, y - 1, curr) // top
    addPath(x + 1, y, curr) // right
    addPath(x - 1, y, curr) // left
    addPath(x, y + 1, curr) // bottom

    activePaths = activePaths.next
  }

  return solution
}

const start = process.hrtime.bigint()
// Problem 1
{
  const map = JSON.parse(JSON.stringify(input))
  console.log(`Answer 1: ${getPath(map)}`);
}

// Problem 2
{
  const map = JSON.parse(JSON.stringify(input))

  const newMap = []
  const h = map.length
  const w = map.length

  for (let xM = 0; xM < 5; xM++) {
    for (let yM = 0; yM < 5; yM++) {
      for (let xT = 0; xT < w; xT++) {
        for (let yT = 0; yT < h; yT++) {
          const x = xM * w + xT
          const y = yM * h + yT
          const value = map[xT][yT] + xM + yM

          if (!newMap[x]) newMap[x] = []
          newMap[x][y] = ((value - 1) % 9) + 1
        }
      }
    }
  }

  console.log(`Answer 2: ${getPath(newMap)}`);
}

const time = process.hrtime.bigint() - start
console.log(`\nAnswers found in ${time / 1000000n}ms`);