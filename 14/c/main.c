#include <stdio.h>
#include <assert.h>
#include <string.h>
#include <limits.h>

#define N 10

typedef long state[N];

struct hash {
  state state;
  int created;
};

struct hash hashes[40][N][N] = {0};
int rules[N][N] = {0};
char input[20] = {0};

char pairs[N] = {0};

int charToInt(char from) {
  for (int i = 0; i < N; i++) {
    if (pairs[i] == from) return i;

    if (pairs[i] == 0) {
      pairs[i] = from;
      return i;
    }
  }

  assert(0 && "Unreachable");
}


state* getCount(int left, int right, int steps) {
  struct hash* hash = &hashes[steps][left][right];
  if (!hash->created) {
    hash->created = 1;
    int middle = rules[left][right];

    if (steps == 0) {
      hash->state[middle] = 1;
      return &hash->state;
    }

    state* nextLeft = getCount(left, middle, steps - 1);
    state* nextRight = getCount(middle, right, steps - 1);

    // add it's direct child
    hash->state[middle] += 1;

    // add it's direct childens
    for (int i = 0; i < N; i++) {
      hash->state[i] += (*nextLeft)[i] + (*nextRight)[i];
    }
  }

  return &hash->state;
}

long iterate(int steps) {
  state result = {0};

  // firs letter
  result[charToInt(input[0])] = 1;

  for (int i = 1; i < (int)strlen(input); i++) {
    int left = charToInt(input[i - 1]);
    int right = charToInt(input[i]);

    result[right] += 1;
    // last step is step 0
    state* children = getCount(left, right, steps - 1);
    for (int i = 0; i < N; i++) {
      result[i] += (*children)[i];
    }
  }

  long lower = LONG_MAX, higher = 0;

  for (int i = 0; i < N; i++) {
    if (result[i] == 0) break;

    // printf("%c: %d\n", pairs[i], result[i]);
    if (result[i] < lower) lower = result[i];
    if (result[i] > higher) higher = result[i];
  }

  return higher - lower;
}


int main(int argc, char *argv[]) {
  assert(argc == 2 && "Must provide one argument => input.txt path");

  printf("Input file: %s\n\n", argv[1]);
  FILE *file = fopen(argv[1], "r");

  assert(fscanf(file, "%s", input));

  // Consume empty line
  fgetc(file);
  fgetc(file);

  char a, b, to;
  while (fscanf(file, "%c%c -> %c\n", &a, &b, &to) == 3) {
    rules[charToInt(a)][charToInt(b)] = charToInt(to);
  }

  // Problem 1
  {
    int count = iterate(10);
    printf("Answer 1: %d\n", count);
  }


  // Problem 2
  {
    long count = iterate(40);
    printf("Answer 2: %ld\n", count);
  }


  fclose(file);

  return 0;
}
