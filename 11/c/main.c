#include <stdio.h>
#include <assert.h>
#include <string.h>

#define N 10
typedef int grid[N][N];

grid input = {0};

void inc(grid state, int x, int y, int* flashes) {
  if (x < 0 || y < 0 || x > 9 || y > 9) {
    return;
  }

  state[x][y]++;

  if (state[x][y] >= 10) {
    (*flashes)++;
    state[x][y] = -20;
    inc(state, x - 1, y - 1, flashes);
    inc(state, x - 1, y + 0, flashes);
    inc(state, x - 1, y + 1, flashes);
    inc(state, x + 0, y - 1, flashes);
    inc(state, x + 0, y + 0, flashes);
    inc(state, x + 0, y + 1, flashes);
    inc(state, x + 1, y - 1, flashes);
    inc(state, x + 1, y + 0, flashes);
    inc(state, x + 1, y + 1, flashes);
  }
}

int step(grid state) {
  int flashes = 0;

  for (int x = 0; x < 10; x++) {
    for (int y = 0; y < 10; y++) {
      inc(state, x, y, &flashes);
    }
  }

  for (int x = 0; x < 10; x++) {
    for (int y = 0; y < 10; y++) {
      if (state[x][y] < 0) {
        state[x][y] = 0;
      }
    }
  }

  return flashes;
}


int main(int argc, char *argv[]) {
  assert(argc == 2 && "Must provide one argument => input.txt path");

  printf("Input file: %s\n\n", argv[1]);
  FILE *file = fopen(argv[1], "r");

  int curr = 0;
  char c = 0;

  while (fscanf(file, "%c", &c) == 1) {
    if (c >= '0') {
      input[0][curr++] = c - '0';
    }
  }

  // Problem 1
  {
    grid state;
    memcpy(state, input, sizeof(grid));

    int answer = 0;

    for (int i = 0; i < 100; i++) {
      answer += step(state);
    }

    printf("Answer 1: %d\n", answer);
  }


  // Problem 2
  {
    grid state;
    memcpy(state, input, sizeof(grid));

    int i = 0;
    while (1) {
      i++; // start by incrementing next step
      if (step(state) == 100) {
        printf("Answer 2: %d\n", i);
        break;
      }
    }
  }


  fclose(file);

  return 0;
}
