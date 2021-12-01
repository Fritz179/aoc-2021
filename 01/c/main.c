#include <stdio.h>
#include <assert.h>

#define N 2048
unsigned int xs[N];
int xs_size = 0;

int main(int argc, char *argv[]) {
  assert(argc == 2 && "Must provide one argument => input.txt path");

  printf("Input file: %s\n", argv[1]);

  int number;
  FILE *file = fopen(argv[1], "r");

  while (fscanf(file, "%d", &number) == 1) {
    xs[xs_size++] = number;
  }


  // Problema 1
  int count1 = 0;

  for (int i = 1; i < xs_size; i++) {
    int prev = xs[i - 1];
    int curr = xs[i];

    if (curr > prev) {
      count1++;
    }
  }

  printf("\nCount 1: %d", count1);


  // Problema 2
  int count2 = 0;

  for (int i = 1; i < xs_size - 2; i++) {
    int prev = xs[i - 1] + xs[i] + xs[i + 1];
    int curr = xs[i] + xs[i + 1] + xs[i + 2];

    if (curr > prev) {
      count2++;
    }
  }

  printf("\nCount 2: %d", count2);

  fclose(file);

  printf("\n");
  return 0;
}
