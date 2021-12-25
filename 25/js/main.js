const fs = require('fs')
const {join} = require('path')

const file = fs.readFileSync(join(__dirname, '../input.txt'), 'utf8')

const input = file.split('\n').map(line => line.split(''))
const h = input.length
const w = input[0].length

function iterate(prev) {
  const next = []

  function get(grid, y, x) {
    if (x < 0) x += w
    if (y < 0) y += h
    if (x >= w) x -= w
    if (y >= h) y -= h
    return grid[y][x]
  }

  function set(grid, y, x, state) {
    if (x < 0) x += w
    if (y < 0) y += h
    if (x >= w) x -= w
    if (y >= h) y -= h

    grid[y][x] = state
  }

  // initial state
  for (let y = 0; y < h; y++) {
    next[y] = []
    for (let x = 0; x < w; x++) {
      set(next, y, x, get(prev, y, x))
    }
  }

  // left to right
  for (let y = 0; y < h; y++) {
    for (let x = 1; x <= w; x++) {
      if (get(prev, y, x - 1) == '>' && get(prev, y, x) == '.') {
        set(next, y, x, '>')
        set(next, y, x - 1, '.')
      }
    }
  }

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      set(prev, y, x, get(next, y, x))
    }
  }

  // top to bottom
  for (let y = 1; y <= h; y++) {
    for (let x = 0; x < w; x++) {
      if (get(prev, y, x) == '.' && get(prev, y - 1, x) == 'v') {
        set(next, y, x, 'v')
        set(next, y - 1, x, '.')
      }
    }
  }


  return next
}

function norm(a) {
  return a.map(line => line.join('')).join('\n')
}

// Problem 1
{
  let curr = input
  let prev = []

  let answer = 0
  while (norm(prev) != norm(curr)) {
    prev = curr
    curr = iterate(JSON.parse(JSON.stringify(curr)))
    answer++
  }

  console.log(`Answer 1: ${answer}`);
}


// Problem 2
{

}