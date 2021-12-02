const fs = require('fs')
const {join} = require('path')

const file = fs.readFileSync(join(__dirname, '../input.txt'), 'utf8')
const inputs = file.split('\n').slice(0, -1).map(n => Number(n))


// Problem 1
{
  let count = 0

  for (let i = 1; i < inputs.length; i++) {
    const curr = inputs[i]
    const prev = inputs[i - 1]

    if (curr > prev) count++
  }

  console.log(`Count 1: ${count}`);
}


// Problem 2
{
  let count = 0

  for (let i = 1; i < inputs.length - 2; i++) {
    const curr = inputs[i] + inputs[i + 1] + inputs[i + 2]
    const prev = inputs[i - 1] + inputs[i] + inputs[i + 1]

    if (curr > prev) count++
  }

  console.log(`Count 2: ${count}`);
}
