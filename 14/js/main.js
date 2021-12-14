const fs = require('fs')
const {join} = require('path')

const file = fs.readFileSync(join(__dirname, '../input.txt'), 'utf8')
const input = file.split('\n').slice(0, -1)

const start = input.shift()

// Empty line
input.shift()

const rules = {}
input.forEach(rule => {
  const [from, to] = rule.split(' -> ')
  rules[from] = to
})

const hashes = {}

function add(to, key, value) {
  if (!to[key]) {
    to[key] = value
  } else {
    to[key] += value
  }
}

function getCount(left, right, days) {
  const hash = `${left}_${right}_${days}`

  if (!hashes[hash]) {
    if (days == 1) {
      return hashes[hash] = {[rules[left + right]]: 1}
    }

    const middle = rules[left + right]

    const nextLeft = getCount(left, middle, days - 1)
    const nextRight = getCount(middle, right, days - 1)

    const count = {}

    add(count, middle, 1)
    for (key in nextLeft) {
      add(count, key, nextLeft[key])
    }
    for (key in nextRight) {
      add(count, key, nextRight[key])
    }

    hashes[hash] = count
  }

  return hashes[hash]
}

function iterate(times) {
  const count = {}
  add(count, start[0], 1)
  for (let i = 1; i < start.length; i++) {
    add(count, start[i], 1)
    const left = start[i - 1]
    const right = start[i]

    const result = getCount(left, right, times)
    for (key in result) {
      add(count, key, result[key])
    }
  }

  let lower = Infinity, higher = -Infinity

  for (key in count) {
    if (count[key] < lower) lower = count[key]
    if (count[key] > higher) higher = count[key]
  }

  return higher - lower
}

// Problem 1
{
  console.log(`Answer 1: ${iterate(10)}`);
}

// Problem 2
{
  console.log(`Answer 2: ${iterate(40)}`);
}
