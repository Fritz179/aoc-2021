const fs = require('fs')
const {join} = require('path')

const file = fs.readFileSync(join(__dirname, '../input.txt'), 'utf8')

const reg = new RegExp(`inp w
mul x 0
add x z
mod x 26
div z (-?\\d+)
add x (-?\\d+)
eql x w
eql x 0
mul y 0
add y 25
mul y x
add y 1
mul z y
mul y 0
add y w
add y (-?\\d+)
mul y x
add z y`, 'g')

const inputs = [...file.matchAll(reg)].map(input => input.slice(1, 11).map(n => Number(n)))

const insts = file.split('\n').map(els => els.split(' ').map(el => Number.isNaN(Number(el)) ? el : Number(el)))

function exec(i) {
  const inps = i.toString().split('').map(n => Number(n))

  const regs = {x: 0, y: 0, z: 0, w: 0}

  insts.forEach(([op, a, b]) => {
    const bValue = typeof b == 'number' ? b : regs[b]

    switch (op) {
      case 'inp': regs[a] = inps.shift(); break;
      case 'add': regs[a] = regs[a] + bValue; break;
      case 'mul': regs[a] = regs[a] * bValue; break;
      case 'div': regs[a] = Math.floor(regs[a] / bValue); break;
      case 'mod': regs[a] = regs[a] % bValue; break;
      case 'eql': regs[a] = regs[a] == bValue ? 1 : 0; break;
      default: console.log(`Unhandled inst: ${op}`);
    }
  })

  return regs;
}

/*

[z, w, A, B, C]

if (A == 1) {
  // multiply, B > 10

  z = z * 26 + w + C
} else {
  // divide, B < 10

  assert(w == z % 26 + B)

  div z A
}

====

i1 + C1 - B2 = i2

===

*/

function solve(list) {
  const el = list.shift()

  // is divisor
  if (el[0] == 26) {
    return el[1]
  }

  const ret = {l: el[2], r: 0, children: []}

  while (list.length) {
    const r = solve(list)
    if (typeof r == 'number') {
      ret.r = r
      break
    }

    ret.children.push(r)
  }

  return ret
}

const resolver = solve(inputs)

function resolve(el, fun) {
  const {l, r, children} = el

  const [lVal, rVal] = fun(l, r)

  let solution = lVal.toString()
  for (child of children) {
    solution += resolve(child, fun)
  }
  solution += rVal

  return solution
}

// Problem 1
{
  const solution = resolve(resolver, (l, r) => {
    const diff = l + r
    const lVal = diff > 0 ? 9 - diff : 9
    const rVal = diff < 0 ? 9 + diff : 9
    return [lVal, rVal]
  })
  console.log(`Answer 1: ${solution}`);
}


// Problem 2
{
  const solution = resolve(resolver, (l, r) => {
    const diff = l + r
    const lVal = diff < 0 ? 1 - diff : 1
    const rVal = diff > 0 ? 1 + diff : 1
    return [lVal, rVal]
  })
  console.log(`Answer 2: ${solution}`);
}