const fs = require('fs')
const {join} = require('path')

const file = fs.readFileSync(join(__dirname, '../input.txt'), 'utf8')
const lines = file.split('\n').map(line => JSON.parse(line))
const debug = false

function simplify(expr, depth = 0, explode) {
  if (depth == 10) exit()
  if (typeof expr == 'number') {
    if (expr < 10 || explode) return [null, expr, null, true]

    const l = Math.floor(expr / 2)
    const r = Math.ceil(expr / 2)
    if (debug) console.log('Split: ', expr);
    return [null, [l, r], null, false]
  }

  if (depth >= 4 && explode && typeof expr[0] == 'number' && typeof expr[1] == 'number') {
    if (debug) console.log('explode', expr);
    return [expr[0], 0, expr[1], false]
  }

  let outerLeft = null
  let outerRight = null
  for (let i = 0; i < expr.length; i++) {
    const [l, replace, r, next] = simplify(expr[i], depth + 1, explode)

    if (l != null) {
      if (i != 0) {
        if (typeof expr[i - 1] == 'number') {
          expr[i - 1] += l
        } else {
          let left = expr[i - 1]
          while (typeof left[left.length - 1] != 'number') {
            left = left[left.length - 1]
          }
          left[left.length - 1] += l
        }
      } else {
        outerLeft = l
      }
    }

    if (r != null) {
      if (i + 1 < expr.length) {
        if (typeof expr[i + 1] == 'number') {
          expr[i + 1] += r
        } else {
          let right = expr[i + 1]
          while (typeof right[0] != 'number') {
            right = right[0]
          }
          right[0] += r
        }
      } else {
        outerRight = r
      }
    }

    if (replace != null) {
      expr[i] = replace
    } else {
      expr.splice(i, 1)
    }

    if (!next) return [outerLeft, expr, outerRight, false]

  }

  return [outerLeft, expr, outerRight, true]
}

function solve(expr) {
  let curr = JSON.stringify(expr)
  let prev = null

  while (curr != prev) {
    if (debug) console.log(curr);
    prev = curr
    curr = JSON.stringify(simplify(JSON.parse(curr), 0, true)[1])
    if (prev != curr) continue
    curr = JSON.stringify(simplify(JSON.parse(curr), 0, false)[1])
  }

  return JSON.parse(curr)
}

function magnitude(expr) {
  if (typeof expr == 'number') return expr

  const left = magnitude(expr[0])
  const right = magnitude(expr[1])

  return left * 3 + right * 2
}

// Problem 1
{
  const input = JSON.parse(JSON.stringify(lines))
  let curr = input.shift()

  while (input.length) {
    curr = solve([curr, input.shift()])
  }

  console.log(`Answer 1: ${magnitude(curr)}`);
}

// Problem 2
{
  let record = 0
  for (i = 0; i < lines.length - 1; i++) {
    const a = lines[i]
    for (j = i + 1; j < lines.length; j++) {
      const b = lines[j]

      const mag = magnitude(solve([a, b]))
      if (mag > record) record = mag
    }
  }

  console.log(`Answer 2: ${record}`);
}
