const fs = require('fs')
const {join} = require('path')

const file = fs.readFileSync(join(__dirname, '../input.txt'), 'utf8')

const lines = file.split('\n').map(line => line.split(''))
const enhancer = lines.shift()

// empty line
lines.shift()

const padding = 51
const map = []
const w = lines[0].length + padding * 2
const h = lines.length + padding * 2

for ([y, line] of lines.entries()) {
  for ([x, pixel] of line.entries()) {
    if (!map[y+padding]) map[y+padding] = []
    map[y+padding][x+padding] = pixel
  }
}

let outsidePixel = '.'
function iterate(prev) {
  const curr = []

  for (let y = 0; y < h; y++) {
    curr[y] = []
    for (let x = 0; x < w; x++) {

      if (y == 0 || x == 0 || x == w - 1 || y == h - 1) {
        curr[y][x] = enhancer[outsidePixel == '.' ? 0 : 511]
        continue
      }

      let index = 0
      let value = 256
      for (let yd = -1; yd < 2; yd++) {
        for (let xd = -1; xd < 2; xd++) {
          if (prev[y + yd]?.[x + xd] == '#') {
            index += value
          }
          value /= 2
        }
      }
      curr[y][x] = enhancer[index]
    }
  }
  outsidePixel = enhancer[outsidePixel == '.' ? 0 : 511]

  return curr
}

function print(state) {
  console.log(outsidePixel);
  for (y = 0; y < h; y++) {
    let line = ''
    for (x = 0; x < w; x++) {
      line += state[y]?.[x] || outsidePixel
    }
    console.log(line);
  }
}

// Problem 1
{
  const one = iterate(map)
  const two = iterate(one)

  let answer = 0
  for (line of two) {
    for (cell of line) {
      if (cell == '#') answer++
    }
  }

  console.log(`Answer 1: ${answer}`);
}

// Problem 2
{
  let curr = map

  for (let i = 0; i < 50; i++) {
    curr = iterate(curr)
  }

  let answer = 0
  for (line of curr) {
    for (cell of line) {
      if (cell == '#') answer++
    }
  }

  console.log(`Answer 2: ${answer}`);
}
