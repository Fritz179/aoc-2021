const fs = require('fs')
const {join} = require('path')

const file = fs.readFileSync(join(__dirname, '../input.txt'), 'utf8')
const inputs = file.split(',').map(n => Number(n))

const hashes = {}
function afterDays(start, days) {
  const hash = `${start}_${days}`

  if (!hashes[hash]) {
    let count = 1 // itself

    let nextReproduction = days - start

    while (nextReproduction > 0) {
      count += afterDays(8, nextReproduction - 1)
      nextReproduction -= 7
    }

    hashes[hash] = count
  }

  return hashes[hash]
}

// Problem 1
{
  let count = 0

  inputs.forEach(fish => {
    count += afterDays(fish, 80)
  })

  console.log(`Answer 1: ${count}`);
}


// Problem 2
{
  let count = 0

  inputs.forEach(fish => {
    count += afterDays(fish, 256)
  })

  console.log(`Answer 1: ${count}`);
}
