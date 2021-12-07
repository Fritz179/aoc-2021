const fs = require('fs')
const {join} = require('path')

const file = fs.readFileSync(join(__dirname, '../input.txt'), 'utf8')
const inputs = file.split(',').map(n => Number(n))

// Problem 1
{
  let record = Infinity

  for (let i = 0; i < 1000; i++) {
    let sum = 0
    inputs.forEach(num => {
      sum += Math.abs(i - num)
    })

    if (sum < record) {
      record = sum
    }
  }

  console.log(`Answer 1: ${record}`);
}


// Problem 2
{
  function calc(num) {
    return num / 2 * num + num / 2
  }

  let record = Infinity

  for (let i = 0; i < 1000; i++) {
    let sum = 0
    inputs.forEach(num => {
      sum += calc(Math.abs(i - num))
    })

    if (sum < record) {
      record = sum
    }
  }

  console.log(`Answer 2: ${record}`);
}
