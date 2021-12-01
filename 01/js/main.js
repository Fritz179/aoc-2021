const fs = require('fs')

const file = fs.readFileSync('../input.txt', 'utf8')
const inputs = file.split('\n').map(n => Number(n))


// Problem 1
let count1 = 0

for (let i = 1; i < inputs.length - 2; i++) {
  const curr = inputs[i]
  const prev = inputs[i - 1]

  if (curr > prev) count1++
}

console.log(`Count 1: ${count1}`);


// Problem 2
let count2 = 0

for (let i = 1; i < inputs.length - 2; i++) {
  const curr = inputs[i] + inputs[i + 1] + inputs[i + 2]
  const prev = inputs[i - 1] + inputs[i] + inputs[i + 1]

  if (curr > prev) count2++
}

console.log(`Count 2: ${count2}`);
