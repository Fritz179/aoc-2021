const fs = require('fs')
const {join} = require('path')

const file = fs.readFileSync(join(__dirname, '../input.txt'), 'utf8')
const inputs = file.split(',').map(n => Number(n))

const hashes = []
function afterDays(days) {
  if (!hashes[days]) {
    let count = 1 // itself

    let nextReproduction = days - 8

    while (nextReproduction > 0) {
      count += afterDays(nextReproduction - 1)
      nextReproduction -= 7
    }

    hashes[days] = count
  }

  return hashes[days]
}

// Problem 1
{
  let count = 0

  inputs.forEach(fish => {
    // 8 - fish = the day that they were born
    count += afterDays(80 + 8 - fish)
  })

  console.log(`Answer 1: ${count}`);
}


// Problem 2
{
  let count = 0

  inputs.forEach(fish => {
    // 8 - fish = the day that they were born
    count += afterDays(256 + 8 - fish)
  })

  console.log(`Answer 1: ${count}`);
}
