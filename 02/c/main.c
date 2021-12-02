#include <stdio.h>
#include <assert.h>
#include <string.h>

#define N 2048

struct inst {
  int num;
  char dir[10];
};

struct inst xs[N];
int xs_size = 0;

int main(int argc, char *argv[]) {
  assert(argc == 2 && "Must provide one argument => input.txt path");

  printf("Input file: %s\n", argv[1]);
  FILE *file = fopen(argv[1], "r");

  int number = 0;
  char str[10] = "";

  while (fscanf(file, "%s", str) == 1 && fscanf(file, "%d", &number) == 1) {
    xs[xs_size].num = number;
    strcpy(xs[xs_size++].dir, str);
  }


  // Problema 1
  {
    int down = 0;
    int forward = 0;

    for (int i = 0; i < xs_size; i++) {
      if (strcmp(xs[i].dir, "up") == 0) {
        down -= xs[i].num;
      } else if (strcmp(xs[i].dir, "down") == 0) {
        down += xs[i].num;
      } else if (strcmp(xs[i].dir, "forward") == 0) {
        forward += xs[i].num;
      } else {
        printf("Unknown dir: %s at: %d", xs[i].dir, i);
      }
    }

    printf("\nCount 1: %d", down * forward);
  }

  // Problema 2
  {
    int down = 0;
    int forward = 0;
    int aim = 0;

    for (int i = 0; i < xs_size; i++) {
      if (strcmp(xs[i].dir, "up") == 0) {
        aim -= xs[i].num;
      } else if (strcmp(xs[i].dir, "down") == 0) {
        aim += xs[i].num;
      } else if (strcmp(xs[i].dir, "forward") == 0) {
        forward += xs[i].num;
        down += aim * xs[i].num;
      } else {
        printf("Unknown dir: %s at: %d", xs[i].dir, i);
      }
    }

    printf("\nCount 1: %d", down * forward);
  }

  fclose(file);

  printf("\n");
  return 0;
}
