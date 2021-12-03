#include <stdio.h>
#include <assert.h>
#include <string.h>

#define N 1024

struct inst {
  int use;
  char num[13]; // NULL termination
};

struct inst xs[N];
int xs_size = 0;

int getCommon(int side) {
  int valids = xs_size;
  int index = 0;

  while (valids > 1) {
    int ones = 0;

    for (int i = 0; i < xs_size; i++) {
      struct inst input = xs[i];
      if (input.use && (input.num[index] == '1')) ones++;
    }

    int xor = side ? ones >= valids / 2 : ones < valids / 2;

    for (int i = 0; i < xs_size; i++) {
      if (((xs[i].num[index] == '1') != xor) && xs[i].use) {
        valids--;
        xs[i].use = 0;
      }
    }

    index++;
    if (valids == 1) {
      for (int i = 0; i < xs_size; i++) {
        struct inst input = xs[i];
        if (input.use) {
          int num = 0;

          for (int i = 0; i < 12; i++) {
            if (input.num[i] == '1') {
              num |= 1 << (11 - i);
            }
          }

          return num;
        }
      }
    }
  }

  assert(0);
  return 0;
}

int main(int argc, char *argv[]) {
  assert(argc == 2 && "Must provide one argument => input.txt path");

  printf("Input file: %s\n", argv[1]);
  FILE *file = fopen(argv[1], "r");

  char str[12] = "";

  while (fscanf(file, "%s", str) == 1) {
    xs[xs_size].use = 1;
    strcpy(xs[xs_size++].num, str);
  }


  // Problema 1
  {
    {
      int ones[12] = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};

      for (int i = 0; i < xs_size; i++) {
        struct inst input = xs[i];

        for (int i = 0; i < 12; i++) {
          if (input.num[i] == '1') {
            ones[i]++;
          }
        }
      }

      int gamma = 0;
      int epsilon = 0;
      for (int i = 0; i < 12; i++) {
        if (ones[i] > xs_size / 2) {
          gamma |= 1 << (11 - i);
        } else {
          epsilon |= 1 << (11 - i);
        }
      }

      printf("\nAnswer 1: %d\n", gamma * epsilon);
    }

  }

  // Problema 2
  {
    int oxygen = getCommon(1);

    for (int i = 0; i < xs_size; i++) xs[i].use = 1;
    int co2 = getCommon(0);

    printf("Answer 2: %d\n", oxygen * co2);
  }

  fclose(file);

  return 0;
}
