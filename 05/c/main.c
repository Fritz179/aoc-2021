#include <stdio.h>
#include <assert.h>
#include <string.h>
#include <stdbool.h>

#define SWAP(x, y) { int SWAP = x; x = y; y = SWAP; };

#define N 1000
int board[N][N] = {0};

struct line {
  int x1;
  int y1;
  int x2;
  int y2;
};

#define lines_cap 512
struct line lines[lines_cap];
int lines_size = 0;

int main(int argc, char *argv[]) {
  assert(argc == 2 && "Must provide one argument => input.txt path");

  printf("Input file: %s\n\n", argv[1]);
  FILE *file = fopen(argv[1], "r");

  int x1 = 0, y1 = 0, x2 = 0, y2 = 0;
  while (fscanf(file, "%d,%d -> %d,%d", &x1, &y1, &x2, &y2) == 4) {
    lines[lines_size].x1 = x1;
    lines[lines_size].x2 = x2;
    lines[lines_size].y1 = y1;
    lines[lines_size].y2 = y2;
    lines_size++;
  }

  // Problema 1
  {
    int count = 0;

    int curr = 0;
    while (curr < lines_size) {
      int x1 = lines[curr].x1;
      int x2 = lines[curr].x2;
      int y1 = lines[curr].y1;
      int y2 = lines[curr].y2;
      curr++;

      if (x1 != x2 && y1 != y2) continue; // diagonal

      if (x1 > x2) SWAP(x1, x2)
      if (y1 > y2) SWAP(y1, y2)

      for (int x = x1; x <= x2; x++) {
        for (int y = y1; y <= y2; y++) {
          if (board[y][x] == 1) count++;
          board[y][x]++;
        }
      }
    }

    printf("Answer 1: %d\n", count);
  }

  memset(board, 0, N * N * sizeof(int));

  // Problema 2
  {
    int count = 0;

    int curr = 0;
    while (curr < lines_size) {
      int x1 = lines[curr].x1;
      int x2 = lines[curr].x2;
      int y1 = lines[curr].y1;
      int y2 = lines[curr].y2;
      curr++;

      if (x1 != x2 && y1 != y2) { // diagonal
        int yDir = y2 > y1 ? 1 : -1;

        if (x2 > x1) {
          for (int x = x1; x <= x2; x++) {
            int y = y1 + (x - x1) * yDir;
            if (board[y][x] == 1) count++;
            board[y][x]++;
          }
        } else {
          for (int x = x1; x >= x2; x--) {
            int y = y1 + (x1 - x) * yDir;
            if (board[y][x] == 1) count++;
            board[y][x]++;
          }
        }
      } else {
        if (x1 > x2) SWAP(x1, x2)
        if (y1 > y2) SWAP(y1, y2)

        for (int x = x1; x <= x2; x++) {
          for (int y = y1; y <= y2; y++) {
            if (board[y][x] == 1) count++;
            board[y][x]++;
          }
        }
      }
    }

    printf("Answer 2: %d\n", count);
  }

  fclose(file);

  return 0;
}
