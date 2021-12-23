const fs = require('fs')
const {join} = require('path')

const file = fs.readFileSync(join(__dirname, '../input.txt'), 'utf8')

const lineReg = /(on|off) x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)/
const inputs = file.split('\n').map(line => {
  const nums = line.match(lineReg)
  const ret = [nums[1] == 'on']
  nums.slice(2, 8).forEach(n => ret.push(Number(n)))
  return ret
})

// const inputs = [
//   [true, 0, 9, 0, 9, 0, 9],
//   [false, -5, 2, -5, 2, -5, 2],
//   // [false, 5, 10, 0, 10, 0, 10],
// ]

class Cube {
  constructor([x1, x2, y1, y2, z1, z2]) {
    // if (x1 > x2) [x1, x2] = [x2, x1]
    // if (y1 > y2) [y1, y2] = [y2, y1]
    // if (z1 > z2) [z1, z2] = [z2, z1]

    this.x1 = x1
    this.x2 = x2
    this.y1 = y1
    this.y2 = y2
    this.z1 = z1
    this.z2 = z2

    this.on = !(x1 > x2 || y1 > y2 || z1 > z2)
  }

  copy() {
    return new Cube([this.x1, this.x2, this.y1, this.y2, this.z1, this.z2])
  }

  chop(other) {
    if (this.x1 > other.x2 || this.x2 < other.x1) return
    if (this.y1 > other.y2 || this.y2 < other.y1) return
    if (this.z1 > other.z2 || this.z2 < other.z1) return

    // split x1
    if (other.x1 >= this.x1 && other.x1 <= this.x2) {
      const left = this.copy()
      left.x2 = other.x1 - 1
      cubes.push(left)

      this.x1 = other.x1
    }

    // split x2
    if (other.x2 <= this.x2 && other.x2 >= this.x1) {
      const right = this.copy()
      right.x1 = other.x2 + 1
      cubes.push(right)

      this.x2 = other.x2
    }

    // split y1
    if (other.y1 >= this.y1 && other.y1 <= this.y2) {
      const left = this.copy()
      left.y2 = other.y1 - 1
      cubes.push(left)

      this.y1 = other.y1
    }

    // split y2
    if (other.y2 <= this.y2 && other.y2 >= this.y1) {
      const right = this.copy()
      right.y1 = other.y2 + 1
      cubes.push(right)

      this.y2 = other.y2
    }

    // split z1
    if (other.z1 >= this.z1 && other.z1 <= this.z2) {
      const left = this.copy()
      left.z2 = other.z1 - 1
      cubes.push(left)

      this.z1 = other.z1
    }

    // split z2
    if (other.z2 <= this.z2 && other.z2 >= this.z1) {
      const right = this.copy()
      right.z1 = other.z2 + 1
      cubes.push(right)

      this.z2 = other.z2
    }

    this.on = false
  }

  volume() {

    const x = this.x2 - this.x1 + 1
    const y = this.y2 - this.y1 + 1
    const z = this.z2 - this.z1 + 1

    return x * y * z
  }
}

let cubes = []

inputs.forEach(([on, ...pos]) => {
  const newCube = new Cube(pos)

  for (cube of cubes) {
    cube.chop(newCube)
  }

  if (on) {
    cubes.push(newCube)
  }

  cubes = cubes.filter(cube => cube.on)
})

// Problem 1
{
  let count = 0

  for (cube of cubes) {
    if (cube.x1 > -50 && cube.x2 < 50) {
      count += cube.volume()
    }
  }

  console.log(`Answer 1: ${count}`);
}

// Problem 2
{
  let count = 0

  for (cube of cubes) {
    count += cube.volume()
  }

  console.log(`Answer 2: ${count}`);
}