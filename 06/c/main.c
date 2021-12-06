#include <stdio.h>
#include <assert.h>
#include <string.h>
#include <stdbool.h>

#define N 300
long long hashes[N] = {0};
int fishes[N] = {0};
int fishes_size = 0;


long long afterDays(int days) {
  if (!hashes[days]) {
    long long count = 1; // itself

    int nextReproduction = days - 8;

    while (nextReproduction > 0) {
      count += afterDays(nextReproduction - 1);
      assert(count > 0);
      nextReproduction -= 7;
    }

    hashes[days] = count;
  }

  return hashes[days];
}

int main(int argc, char *argv[]) {
  assert(argc == 2 && "Must provide one argument => input.txt path");

  printf("Input file: %s\n\n", argv[1]);
  FILE *file = fopen(argv[1], "r");

  int number;
  while (fscanf(file, "%d", &number) == 1) {
    fishes[fishes_size++] = number;
    fgetc(file);
  }

  // Problem 1
  {
    long long count = 0;

    for (int curr = 0; curr < fishes_size; curr++) {
      // 8 - fish = the day that they were born
      count += afterDays(80 + 8 - fishes[curr]);
    }

    printf("Answer 1: %lld\n", count);
  }


  // Problem 2
  {
    long long count = 0;

    for (int curr = 0; curr < fishes_size; curr++) {
      // 8 - fish = the day that they were born
      count += afterDays(256 + 8 - fishes[curr]);
    }

    printf("Answer 2: %lld\n", count);
  }


  fclose(file);

  return 0;
}
