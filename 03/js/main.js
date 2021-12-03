const fs = require('fs')
const {join} = require('path')

const file = fs.readFileSync(join(__dirname, '../input.txt'), 'utf8')
const inputs = file.split('\n').slice(0, -1).map(n => ({n, use: true}))


// Problem 1
{
  const ones = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  for (input of inputs) {
    for (let i = 0; i < 12; i++) {
      if (input.n[i] == '1') {
        ones[i]++
      }
    }
  }

  let gamma = 0
  let epsilon = 0
  for (let i = 0; i < 12; i++) {
    if (ones[i] > inputs.length / 2) {
      gamma |= 1 << (11 - i)
    } else {
      epsilon |= 1 << (11 - i)
    }
  }

  console.log(`Answer 1: ${gamma * epsilon}`);
}


// Problem 2
{
  function getCommon(side) {
    let valids = inputs.length
    let index = 0

    while (valids > 1) {
      let ones = 0

      for (input of inputs) {
        if (input.use && input.n[index] == '1') ones++
      }

      const xor = side ? ones >= valids / 2 : ones < valids / 2
      for (input of inputs) {
        if ((input.n[index] == '1') != xor && input.use) {
          valids--
          input.use = false
        }
      }

      index++
      if (valids == 1) {
        for (input of inputs) {
          if (input.use) {
            return Number('0b' + input.n)
          }
        }
      }
    }
  }

  const oxygen = getCommon(true)

  for (input of inputs) input.use = true
  const co2 = getCommon(false)

  console.log(`Answer 2: ${co2 * oxygen}`);
}
