#include <stdio.h>
#include <assert.h>
#include <string.h>
#include <stdlib.h>

#define N 1500

struct grid {
  int grid[N][N];
  int width;
  int height;
};
struct grid input = {0};

struct fold {
  int dir;
  int at;
};
struct fold folds[64] = {0};
int folds_size = 0;

void printGrid(struct grid* state) {
  printf("\n");
  for (int y = 0; y < state->height; y++) {
    for (int x = 0; x < state->width; x++) {
      printf(state->grid[y][x] ? "##" : "..");
    }
    printf("\n");
  }
}

void fold(struct grid* state, struct fold inst) {
  // y fold
  if (!inst.dir) {
    for (int i = 0; i < inst.at; i++) {
      for (int x = 0; x < state->width; x++) {
        if (state->grid[inst.at * 2 - i][x]) {
          state->grid[i][x] = 1;
        }
      }
    }

    state->height = inst.at;
    return;
  }

  // x fold
  for (int y = 0; y < state->width; y++) {
    for (int i = 0; i < inst.at; i++) {
      if (state->grid[y][inst.at * 2 - i]) {
        state->grid[y][i] = 1;
      }
    }
  }

  state->width = inst.at;
}


int main(int argc, char *argv[]) {
  assert(argc == 2 && "Must provide one argument => input.txt path");

  printf("Input file: %s\n\n", argv[1]);
  FILE *file = fopen(argv[1], "r");

  int x;
  int y;

  input.width = N;
  input.height = N;
  while (fscanf(file, "%d,%d", &x, &y) == 2) {
    // printf("x: %d, y:%d\n", x, y);
    assert(x < N && y < N && "N is to small");
    input.grid[y][x] = 1;
  }


  char dir;
  int at;

  while (fscanf(file, "fold along %c=%d", &dir, &at) == 2) {
    // printf("x: %c, y:%d\n", dir, at);
    folds[folds_size].dir = dir == 'x';
    folds[folds_size++].at = at;
    fgetc(file);
  }


  // Problem 1
  {
    struct grid* state = malloc(sizeof(struct grid));
    memcpy(state, &input, sizeof(struct grid));

    fold(state, folds[1]);

    int answer = 0;
    for (int y = 0; y < state->height; y++) {
      for (int x = 0; x < state->width; x++) {
        if (state->grid[y][x]) answer++;
      }
    }

    printf("Answer 1: %d\n", answer);
    free(state);
  }


  // Problem 2
  {
    struct grid* state = malloc(sizeof(struct grid));
    memcpy(state, &input, sizeof(struct grid));

    for (int i = 0; i < folds_size; i++) {
      fold(state, folds[i]);
    }

    printGrid(state);
    free(state);
  }


  fclose(file);

  return 0;
}
