const fs = require('fs')
const {join} = require('path')

const file = fs.readFileSync(join(__dirname, '../input.txt'), 'utf8')
const inputs = file.split('\n').slice(0, -1).map(line => line.split(' | ').map(list => list.split(' ').map(dis => dis.split('').sort().join(''))))

// Problem 1
{
  let answer = 0
  inputs.forEach(([ins, outs]) => {
    outs.forEach(out => {
      const len = out.length
      if (len == 2 || len == 3 || len == 4 || len == 7) {
        answer++
      }
    })
  })

  console.log(`Answer 1: ${answer}`);
}


/* Segment lengths:
  0 => 6
  1 => 2
  2 => 5
  3 => 5
  4 => 4
  5 => 5
  6 => 6
  7 => 3
  8 => 7
  9 => 6
*/

// Problem 2
{
  let answer = 0
  inputs.forEach(([ins, outs]) => {
    let one, seven, four, eight

    // get segment nr 1, 4, 7, 8
    ins.forEach(el => {
      if (el.length == 2) one = el
      if (el.length == 3) seven = el
      if (el.length == 4) four = el
      if (el.length == 7) eight = el
    })

    // top segment
    const top = seven.split('').filter(seg => !one.includes(seg))

    // l part of number 4
    const l = four.split('').filter(seg => !one.includes(seg))

    let zero, six, nine, two, three, five
    ins.forEach(el => {
      if (el.length == 6) {
        if (!one.split('').every(seg => el.includes(seg))) {
          six = el
        } else if (!l.every(seg => el.includes(seg))) {
          zero = el
        } else {
          nine = el
        }
      }

      if (el.length == 5) {
        if (l.every(seg => el.includes(seg))) {
          five = el
        } else if (one.split('').every(seg => el.includes(seg))) {
          three = el
        } else {
          two = el
        }
      }
    })

    let lineAnswer = ''
    outs.forEach(out => {
      switch (out) {
        case zero:  lineAnswer += '0'; break;
        case one:   lineAnswer += '1'; break;
        case two:   lineAnswer += '2'; break;
        case three: lineAnswer += '3'; break;
        case four:  lineAnswer += '4'; break;
        case five:  lineAnswer += '5'; break;
        case six:   lineAnswer += '6'; break;
        case seven: lineAnswer += '7'; break;
        case eight: lineAnswer += '8'; break;
        case nine:  lineAnswer += '9'; break;
        default: console.log('Unreachable', out, outs);
      }
    })

    answer += Number(lineAnswer)
  })

  console.log(`Answer 2: ${answer}`);
}
