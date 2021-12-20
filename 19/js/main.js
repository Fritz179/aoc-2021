const fs = require('fs')
const {join} = require('path')

const file = fs.readFileSync(join(__dirname, '../input.txt'), 'utf8')

const scanners = file.split(/--- scanner \d+ ---/)
  .filter(scanner => scanner.length) // filter empry scanners (first one)
  .map(scanner => scanner.split('\n')
    .filter(line => line.length) // filter newlines
    .map(line => line.split(',')
      .map(n => Number(n))))

const positions = {}

function hash([x, y, z]) {
  return `${x}_${y}_${z}`
}

// use scanner 0 as origin
const origin = scanners[0]

origin.forEach(point => {
  positions[hash(point)] = true
})

// origin is at origin
const offsets = [[0, 0, 0, 0]]

for (let i = 1; i < scanners.length; i++) {
  outside:
  for ([scannerNumber, scanner] of scanners.entries()) {
    if (offsets[scannerNumber]) continue
    console.log('Testing: ' + scannerNumber);

    for (let xi = 0; xi < 3; xi++) {
      for (let yi = 0; yi < 3; yi++) {
        if (yi == xi) continue
        for (let zi = 0; zi < 3; zi++) {
          if (zi == xi || zi == yi) continue
          for (let xs = -1; xs <= 1; xs += 2) {
            for (let ys = -1; ys <= 1; ys += 2) {
              for (let zs = -1; zs <= 1; zs += 2) {
                function rotate(point, x, y, z) {
                  return [
                    point[xi] * xs + x,
                    point[yi] * ys + y,
                    point[zi] * zs + z
                  ]
                }

                for (base of origin) {
                  for (scannerBase of scanner) {
                    const xd = base[0] - scannerBase[xi] * xs
                    const yd = base[1] - scannerBase[yi] * ys
                    const zd = base[2] - scannerBase[zi] * zs
                    // console.log(xd, yd, zd);

                    let corrects = 0
                    for (beacon of scanner) {
                      const index = hash(rotate(beacon, xd, yd, zd))

                      if (positions[index]) corrects++
                    }

                    if (corrects >= 12) {
                      for (beacon of scanner) {
                        const position = rotate(beacon, xd, yd, zd)

                        const index = hash(position)

                        if (!positions[index]) {
                          // add as possible origins if not present
                          origin.push(position)
                        }

                        // set it's hash to true
                        positions[index] = true
                      }
                      offsets[scannerNumber] = [xd, yd, zd, xi, yi, zi, xs, ys, zs]
                      console.log(`Found scanner: ${scannerNumber}`, offsets[scannerNumber]);
                      break outside
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

// Problem 1
{
  console.log(`Answer 1: ${Object.keys(positions).length}`);
}

// Problem 2
{
  let record = 0

  for (let i = 0; i < offsets.length - 1; i++) {
    for (let j = i + 1; j < offsets.length; j++) {
      const x = Math.abs(offsets[i][0] - offsets[j][0])
      const y = Math.abs(offsets[i][1] - offsets[j][1])
      const z = Math.abs(offsets[i][2] - offsets[j][2])

      let dist = x + y + z
      if (dist > record) record = dist
    }
  }

  console.log(`Answer 2: ${record}`);
}
