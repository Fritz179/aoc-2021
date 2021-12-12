const fs = require('fs')
const {join} = require('path')

const file = fs.readFileSync(join(__dirname, '../input.txt'), 'utf8')
const lines = file.split('\n').slice(0, -1).map(line => line.split('-'))

const caves = {}

function addPath(from, to) {
  if (!caves[from]) {
    caves[from] = []
    caves[from].isBig = !!from.match(/^[A-Z]+$/)
  }

  caves[from].push(to)
}

lines.forEach(([a, b]) => {
  addPath(a, b)
  addPath(b, a)
})

function getPaths(from, visited, twice) {
  if (from == 'end') return 1

  if (visited[from]) {
    if (twice || from == 'start') return 0
    twice = true
  }

  if (!caves[from].isBig) visited[from] = true

  let paths = 0
  for (cave of caves[from]) {
    paths += getPaths(cave, {...visited}, twice)
  }

  return paths
}

const start = process.hrtime.bigint()
// Problem 1
{
  const paths = getPaths('start', {}, true)
  console.log(`Answer 1: ${paths}`);
}

// Problem 2
{
  const paths = getPaths('start', {}, false)
  console.log(`Answer 2: ${paths}`);
}

const time = process.hrtime.bigint() - start
console.log(`\nAnswers found in ${time / 1000000n}ms`);
