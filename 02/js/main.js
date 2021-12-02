const fs = require('fs')
const {join} = require('path')

const file = fs.readFileSync(join(__dirname, '../input.txt'), 'utf8')
const inputs = file.split('\n').slice(0, -1)


// Problem 1
{
  let forward = 0
  let down = 0

  for (let i = 0; i < inputs.length; i++) {
    const [dir, str] = inputs[i].split(' ')
    const num = Number(str)

    switch (dir) {
      case 'up': down -= num; break;
      case 'down': down += num; break;
      case 'forward': forward += num; break;

      default: console.log(`Unknown dir: ${dir} at: ${i}`);
    }
  }

  console.log(`Count 1: ${forward * down}`);
}

// Problem 2
{
  let forward = 0
  let down = 0
  let aim = 0

  for (let i = 0; i < inputs.length; i++) {
    const [dir, str] = inputs[i].split(' ')
    const num = Number(str)

    switch (dir) {
      case 'up': aim -= num; break;
      case 'down': aim += num; break;
      case 'forward': forward += num; down += aim * num; break;

      default: console.log(`Unknown dir: ${dir} at: ${i}`);
    }
  }

  console.log(`Count 2: ${forward * down}`);
}
