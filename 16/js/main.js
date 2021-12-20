const fs = require('fs')
const {join} = require('path')

const file = fs.readFileSync(join(__dirname, '../input.txt'), 'utf8')
const input = file.split('').map(n => parseInt(n, 16).toString(2).padStart(4, '0')).join('')

function dec(n) {
  return parseInt(n, 2)
}


function getStructure(input) {
  function get(num) {
    const ret = input.input.slice(0, num)
    input.input = input.input.slice(num)
    return ret
  }

  const version = dec(get(3))
  const type = dec(get(3))

  // literal value
  if (type == 4) {
    let literal = ''
    while (get(1) == '1') {
      literal += get(4)
    }

    // last one
    literal += get(4)
    return {version, type: 'literal', value: dec(literal)}
  }

  const ret = {version, type: 'operator', operation: type, packets: []}
  if (get(1) == '0') {
    const len = dec(get(15))
    const packets = {input: get(len)}

    while (packets.input.length) {
      const packet = getStructure(packets)
      ret.packets.push(packet)
    }
  } else {
    const len = dec(get(11))

    for (let i = 0; i < len; i++) {
      const packet = getStructure(input)
      ret.packets.push(packet)
    }
  }

  return ret
}

const packets = getStructure({input})

// Problem 1
{
  let answer = 0
  function count({type, version, packets}) {
    answer += version

    if (type == 'operator') {
      for (packet of packets) {
        count(packet)
      }
    }
  }
  count(packets)

  console.log(`Answer 1: ${answer}`);
}

// Problem 2
{
  function operate({type, operation, packets, value}) {
    if (type == 'literal') return value

    if (type == 'operator') {
      if (operation == 0) { // sum
        let ret = 0
        for (packet of packets) {
          ret += operate(packet)
        }
        return ret
      }
      if (operation == 1) { // product
        let ret = 1
        for (packet of packets) {
          ret *= operate(packet)
        }
        return ret
      }
      if (operation == 2) { // min
        return Math.min(...packets.map(packet => operate(packet)))
      }
      if (operation == 3) { // max
        return Math.max(...packets.map(packet => operate(packet)))
      }
      if (operation == 5) { // less
        const l = operate(packets[0])
        const r = operate(packets[1])
        return l > r ? 1 : 0
      }
      if (operation == 6) { // greter
        const l = operate(packets[0])
        const r = operate(packets[1])
        return l < r ? 1 : 0
      }
      if (operation == 7) { // equal
        const l = operate(packets[0])
        const r = operate(packets[1])
        return l == r ? 1 : 0
      }
    }
  }

  console.log(`Answer 2: ${operate(packets)}`);
}
