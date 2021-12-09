#include <stdio.h>
#include <assert.h>
#include <string.h>

#define SWAP(x, y) { int SWAP = x; x = y; y = SWAP; };

#define W 100
#define H 100
char tiles[H][W + 1] = {0};

int isLower(int y, int x) {
  char tile = tiles[y][x];

  if (y > 0 && tiles[y - 1][x] <= tile) return 0; // top
  if (x > 0 && tiles[y][x - 1] <= tile) return 0; // left
  if (x < W - 1 && tiles[y][x + 1] <= tile) return 0; // right
  if (y < H - 1 && tiles[y + 1][x] <= tile) return 0; // bottom

  return 1;
}

int getBasin(int y, int x, int checked[W][H]) {
  if (x < 0 || x >= W || y < 0 || y >= H) return 0;
  if (tiles[y][x] == '9') return 0;

  if (checked[y][x]) return 0;

  int count = 1; // itself
  checked[y][x] = 1;

  count += getBasin(y - 1, x, checked);
  count += getBasin(y + 1, x, checked);
  count += getBasin(y, x - 1, checked);
  count += getBasin(y, x + 1, checked);

  return count;
}

int main(int argc, char *argv[]) {
  assert(argc == 2 && "Must provide one argument => input.txt path");

  printf("Input file: %s\n\n", argv[1]);
  FILE *file = fopen(argv[1], "r");

  char str[W];
  int curr = 0;
  while (fscanf(file, "%s", tiles[curr++]) == 1) { }

  // Problem 1
  {
    int answer = 0;

    for (int y = 0; y < H; y++) {
      for (int x = 0; x < W; x++) {
        if (isLower(y, x)) {
          answer += tiles[y][x] + 1 - '0';
        }
      }
    }

    printf("Answer 1: %d\n", answer);
  }


  // Problem 2
  {
    int basins[3] = {0};

    for (int y = 0; y < H; y++) {
      for (int x = 0; x < W; x++) {
        if (isLower(y, x)) {
          int checked[W][H] = {0};
          int basin = getBasin(y, x, checked);

          if (basin > basins[2]) basins[2] = basin;
          if (basins[2] > basins[1]) SWAP(basins[2], basins[1]);
          if (basins[1] > basins[0]) SWAP(basins[1], basins[0]);
        }
      }
    }

    int answer = basins[0] * basins[1] * basins[2];
    printf("Answer 2: %d\n", answer);
  }


  fclose(file);

  return 0;
}
