const fs = require('fs')
const {join} = require('path')

const file = fs.readFileSync(join(__dirname, '../input.txt'), 'utf8')
const lines = file.split('\n').slice(0, -1)

const pairs = [
  ['(', ')'],
  ['[', ']'],
  ['{', '}'],
  ['<', '>']
]

function parse(tokens, closing) {
  while (tokens.length) {
    const token = tokens.shift()
    if (token == closing) return false

    for ([open, close] of pairs) {
      if (token == open) {
        const char = parse(tokens, close)
        if (char) return char
        break
      }

      if (token == close) return close
    }
  }

  return false
}

function complete(tokens, closing = '') {
  while (tokens.length) {
    const token = tokens.shift()
    if (token == closing) return false

    for ([open, close] of pairs) {
      if (token == open) {
        const char = complete(tokens, close)
        if (char) return char + closing
        break
      }
    }
  }

  return closing
}

// Problem 1
{
  let answer = 0
  const points = {
    ")": 3,
    "]": 57,
    "}": 1197,
    ">": 25137,
  }

  lines.forEach(line => {
    const char = parse(line.split(''))
    if (char) {
      answer += points[char]
    }
  })

  console.log(`Answer 1: ${answer}`);
}


// Problem 2
{
  let scores = []
  const points = {
    ")": 1,
    "]": 2,
    "}": 3,
    ">": 4,
  }

  const valids = lines.filter(line => !parse(line.split('')))

  valids.forEach(line => {
    let score = 0
    const chars = complete(line.split('')).split('')

    for (char of chars) {
      score *= 5
      score += points[char]
    }

    scores.push(score)
  })

  const sorted = scores.sort((a, b) => a - b)
  console.log(`Answer 2: ${sorted[(sorted.length - 1) / 2]}`);
}
