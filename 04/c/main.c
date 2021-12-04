#include <stdio.h>
#include <assert.h>
#include <string.h>
#include <stdbool.h>

#define N 128

struct pos {
  bool marked;
  int num;
};

struct pos boards[N][25];
int boards_size = 0;

int numbers[N];
int numbers_size = 0;

bool checkWin(struct pos board[25]) {
  // cols
  for (int x = 0; x < 5; x++) {
    bool won = true;
    for (int y = 0; y < 5; y++) {
      if (!board[x + y * 5].marked) {
        won = false;
        break;
      }
    }

    if (won) return true;
  }

  // rows
  for (int y = 0; y < 5; y++) {
    bool won = true;
    for (int x = 0; x < 5; x++) {
      if (!board[x + y * 5].marked) {
        won = false;
        break;
      }
    }

    if (won) return true;
  }

  return false;
}

int main(int argc, char *argv[]) {
  assert(argc == 2 && "Must provide one argument => input.txt path");

  printf("Input file: %s\n\n", argv[1]);
  FILE *file = fopen(argv[1], "r");
  int number = 0;

  while (fscanf(file, "%d", &number) == 1) {
    numbers[numbers_size++] = number;

    if (fgetc(file) == '\n') {
      break;
    }
  }

  int nums_size = 0;
  while (fscanf(file, "%d", &number) == 1) {
    boards[boards_size][nums_size].num = number;
    boards[boards_size][nums_size].marked = false;
    nums_size++;

    if (nums_size == 25) {
      nums_size = 0;
      boards_size++;
    }
  }

  // Problema 1
  {
    for (int number_i = 0; number_i < numbers_size; number_i++) {
      for (int board_i = 0; board_i < boards_size; board_i++) {
        for (int num_i = 0; num_i < 25; num_i++) {
          if (boards[board_i][num_i].num == numbers[number_i]) {
            boards[board_i][num_i].marked = true;

            if (checkWin(boards[board_i])) {
              int sum = 0;
              for (int num_j = 0; num_j < 25; num_j++) {
                if (!boards[board_i][num_j].marked) {
                  sum += boards[board_i][num_j].num;
                }
              }
              printf("Answer 1: %d\n", sum * numbers[number_i]);
              goto done1;
            }
          }
        }
      }
    }
  }
  done1:

  // Problema 2
  {
    int lastBoard = 0;

    for (int number_i = 0; number_i < numbers_size; number_i++) {
      int winners = 0;
      for (int board_i = 0; board_i < boards_size; board_i++) {
        for (int pos_i = 0; pos_i < 25; pos_i++) {
          if (boards[board_i][pos_i].num == numbers[number_i]) {
            boards[board_i][pos_i].marked = true;
          }
        }

        if (checkWin(boards[board_i])) {
          winners++;
        }
      }

      if (winners == boards_size) {
        int sum = 0;
        for (int num_i = 0; num_i < 25; num_i++) {
          if (!boards[lastBoard][num_i].marked) {
            sum += boards[lastBoard][num_i].num;
          }
        }

        printf("Answer 2: %d\n", sum * numbers[number_i]);
        goto done2;
      }

      if (winners == boards_size - 1) {
        for (int board_i = 0; board_i < boards_size; board_i++) {
          if (!checkWin(boards[board_i])) {
            lastBoard = board_i;
          }
        }
      }
    }
  }

  done2:

  fclose(file);

  return 0;
}
