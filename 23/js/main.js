const fs = require('fs')
const {join} = require('path')

const file = fs.readFileSync(join(__dirname, '../input.txt'), 'utf8')

const reg = /#############\n#...........#\n###(\w)#(\w)#(\w)#(\w)###\n  #(\w)#(\w)#(\w)#(\w)#\n  #########/
const [a1, b1, c1, d1, a2, b2, c2, d2] = file.match(reg).slice(1, 9)

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

const top = '...........'

const costs = {A: 1, B: 10, C: 100, D: 1000}
const insertIndex = {A: 2, B: 4, C: 6, D: 8}
const lower = {A: 'a', B: 'b', C: 'c', D: 'd'}

const hashes = {}

function print(steps) {
  for (step of steps.split('\n')) {
    const [a1, a2, b1, b2, c1, c2, d1, d2] = step.slice(11).split('')
    const cost = step.slice(19)
    console.log(cost);
    console.log(step.slice(0, 11));
    console.log(`  ${a1} ${b1} ${c1} ${d1}`);
    console.log(`  ${a2} ${b2} ${c2} ${d2}`);
    console.log();
  }
}

let record = Infinity
function iterate(top, a, b, c, d, cost, endState) {
  if (cost >= record) return

  const hash = top + a + b + c + d

  if (!hashes[hash] || hashes[hash] > cost) {
    hashes[hash] = cost

    if (hash == endState) {
      record = cost
      return
    }

    const cols = [a, b, c, d]

    function extract(y, x) {
      const from = x * 2 + 2
      const letter = cols[x][y]

      if (!lower[letter]) return

      function extractTo(i) {
        if (i == 2 || i == 4 || i == 6 || i == 8) return
        const newTop = top.replaceAt(i, letter)
        const newCols = [a, b, c, d]

        newCols[x] = newCols[x].replaceAt(y, '.')
        const unit = costs[letter]
        const tiles = Math.abs(from - i) + y + 1

        iterate(newTop, ...newCols, cost + unit * tiles, endState);
      }

      if (top[from] == '.') {
        // left
        for (let i = from - 1; i >= 0; i--) {
          if (top[i] != '.') break
          extractTo(i)
        }

        // right
        for (let i = from + 1; i < top.length; i++) {
          if (top[i] != '.') break
          extractTo(i)
        }
      }
    }

    for (const [index, letter] of ['A', 'B', 'C', 'D'].entries()) {
      const col = cols[index]

      for (let i = col.length - 1; i >= 0; i--) {
        if (col[i] == '.') break
        if (col[i] != lower[letter]) {
          if (i == 0 || col[i - 1] == '.') {
            extract(i, index)
            break
          }
        }
      }

      // if (col[0] != '.' && (col[0] != letter || lower[col[1]])) extract(0, index)
      // if (col[0] == '.' && col[1] != letter && col[1] != '.') extract(1, index)
    }

    function insert(from, letter) {
      const to = insertIndex[letter]

      function validInsert() {
        const x = to / 2 - 1
        const col = cols[x]

        function insertAt(y) {
          if (!lower[top[from]]) console.log(top, from);
          const newTop = top.replaceAt(from, '.')
          const newCols = [a, b, c, d]
          newCols[x] = newCols[x].replaceAt(y, lower[letter])
          const unit = costs[letter]
          const tiles = Math.abs(from - to) + y + 1

          iterate(newTop, ...newCols, cost + unit * tiles, endState);
        }

        for (let i = col.length - 1; i >= 0; i--) {
          if (col[i] == lower[letter]) continue
          if (col[i] == '.') {
            insertAt(i)
          }
          break
        }
      }

      // left
      out: if (to < from) {
        for (let i = from - 1; i > to; i--) {
          if (top[i] != '.') break out
        }

        validInsert()
      }

      // right
      out: if (to > from) {
        for (let i = from + 1; i < to; i++) {
          if (top[i] != '.') break out
        }

        validInsert()
      }
    }

    for (const [index, letter] of top.split('').entries()) {
      if (letter != '.') {
        insert(index, letter)
      }
    }
    // A
  }

  return
}


// Problem 1
{
  const a = a1 + (a2 == 'A' ? 'a' : a2)
  const b = b1 + (b2 == 'B' ? 'b' : b2)
  const c = c1 + (c2 == 'C' ? 'c' : c2)
  const d = d1 + (d2 == 'D' ? 'd' : d2)

  const endState = '...........aabbccdd'

  iterate(top, a, b, c, d, 0, endState)
  console.log(`Answer 1: ${hashes[endState]}`);
}

record = Infinity

// Problem 2
{
  // #D#C#B#A#
  // #D#B#A#C#

  const a = a1 + 'DD' + (a2 == 'A' ? 'a' : a2)
  const b = b1 + 'CB' + (b2 == 'B' ? 'b' : b2)
  const c = c1 + 'BA' + (c2 == 'C' ? 'c' : c2)
  const d = d1 + 'AC' + (d2 == 'D' ? 'd' : d2)

  const endState = '...........aaaabbbbccccdddd'

  iterate(top, a, b, c, d, 0, endState)
  console.log(`Answer 2: ${hashes[endState]}`);
}