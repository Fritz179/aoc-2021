#include <stdio.h>
#include <assert.h>
#include <string.h>
#include <stdbool.h>

#define N 1024
int crabs[N] = {0};
int crabs_size = 0;

int abs(int num) {
  if (num > 0) return num;
  return -num;
}

int calc(int num) {
  float fnum = (float) num;
  float res = fnum / 2 * fnum + fnum / 2;
  return (int)res;
}

int main(int argc, char *argv[]) {
  assert(argc == 2 && "Must provide one argument => input.txt path");

  printf("Input file: %s\n\n", argv[1]);
  FILE *file = fopen(argv[1], "r");

  int number;
  while (fscanf(file, "%d", &number) == 1) {
    crabs[crabs_size++] = number;
    fgetc(file);
  }

  // Problem 1
  {
    long long record = 99999999;

    for (int i = 0; i < 1000; i++) {
      long long sum = 0;
      for (int j = 0; j < crabs_size; j++) {
        sum += abs(i - crabs[j]);
      }

      if (sum < record) {
        record = sum;
      }
    }

    printf("Answer 1: %lld\n", record);
  }


  // Problem 2
  {
    long long record = 99999999;

    for (int i = 0; i < 1000; i++) {
      long long sum = 0;
      for (int j = 0; j < crabs_size; j++) {
        sum += calc(abs(i - crabs[j]));
      }

      if (sum < record) {
        record = sum;
      }
    }

    printf("Answer 2: %lld\n", record);
  }


  fclose(file);

  return 0;
}
