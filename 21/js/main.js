const fs = require('fs')
const {join} = require('path')

const file = fs.readFileSync(join(__dirname, '../input.txt'), 'utf8')

const [s1, s2] = [...file.matchAll(/Player \d starting position: (\d)/g)].map(match => Number(match[1]))

function iterate1(player1, player2) {
  let currRoll = 6

  let point1 = 0
  let point2 = 0

  while (true) {
    player1 += currRoll
    player1 = (player1 - 1) % 10 + 1

    point1 += player1
    if (point1 >= 1000) return point2 * (currRoll + 3) / 3
    currRoll += 9

    player2 += currRoll
    player2 = (player2 - 1) % 10 + 1
    point2 += player2
    if (point2 >= 1000) return point1 * (currRoll + 3) / 3
    currRoll += 9
  }
}

function next(player, roll, turn) {
  if (!turn) return player

  let newPos = player.pos + roll
  newPos = (newPos - 1) % 10 + 1
  return {
    pos: newPos,
    point: player.point + newPos
  }
}

const rolls = []

function addRoll(number = 0, depth = 0) {
  if (depth == 3) {
    rolls.push(number)
    return
  }

  for (let i = 1; i < 4; i++) {
    addRoll(number + i, depth + 1)
  }
}
addRoll()



const hashes = {}
function iterate2(p1, p2, isOne) {
  // console.log(p1, p2, isOne);
  const hash = `${p1.pos}_${p1.point}_${p2.pos}_${p2.point}_${isOne}`

  if (p1.point >= 21) return [1, 0]
  if (p2.point >= 21) return [0, 1]

  if (!hashes[hash]) {
    const ret = [0, 0]
    for (roll of rolls) {
      const next1 = next(p1, roll, isOne)
      const next2 = next(p2, roll, !isOne)
      const wins = iterate2(next1, next2, !isOne)
      ret[0] += wins[0]
      ret[1] += wins[1]
    }

    hashes[hash] = ret
  }

  return hashes[hash]
}

// Problem 1
{
  console.log(`Answer 1: ${iterate1(s1, s2)}`);
}

// Problem 2
{
  const p1 = {pos: s1, point: 0}, p2 = {pos: s2, point: 0}
  const [c1, c2] = iterate2(p1, p2, true)
  console.log(`Answer 2: ${c1 > c2 ? c1 : c2}`);
}