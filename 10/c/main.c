#include <stdio.h>
#include <assert.h>
#include <string.h>

#define SWAP(t, x, y) { t SWAP = x; x = y; y = SWAP; };
#define N 150

char lines[N][N] = {0};
int lines_size = 0;

struct pair {
  char open;
  char close;
};

struct pair pairs[4] = {
  {'(', ')'},
  {'[', ']'},
  {'{', '}'},
  {'<', '>'}
};

char parse(char** tokens, char closing) {
  while (strlen(*tokens)) {
    char token = *(*tokens)++;
    if (token == closing) return 0;

    for (int i = 0; i < 4; i++) {
      char open = pairs[i].open;
      char close = pairs[i].close;

      if (token == open) {
        char ret = parse(tokens, close);
        if (ret) return ret;
        break;
      }

      if (token == close) return close;
    }
  }

  return 0;
}

long complete(char** tokens, char closing) {
  while (strlen(*tokens)) {
    char token = *(*tokens)++;
    if (token == closing) return -1;

    for (int i = 0; i < 4; i++) {
      char open = pairs[i].open;
      char close = pairs[i].close;

      if (token == open) {
        long ret = complete(tokens, close);

        // complete missing
        if (ret != -1) {
          switch (close) {
            case ')': return ret * 5 + 1;
            case ']': return ret * 5 + 2;
            case '}': return ret * 5 + 3;
            case '>': return ret * 5 + 4;
          }
        }

        break;
      }
    }
  }

  return 0;
}

int main(int argc, char *argv[]) {
  assert(argc == 2 && "Must provide one argument => input.txt path");

  printf("Input file: %s\n\n", argv[1]);
  FILE *file = fopen(argv[1], "r");

  while (fscanf(file, "%s", lines[lines_size++]) == 1) { }
  lines_size--; // Remove last empty line

  // Problem 1
  {
    int answer = 0;

    for (int i = 0; i < lines_size; i++) {
      char* ptr = lines[i];
      char ret = parse(&ptr, 0);

      switch (ret) {
        case ')': answer += 3; break;
        case ']': answer += 57; break;
        case '}': answer += 1197; break;
        case '>': answer += 25137; break;
      }
    }

    printf("Answer 1: %d\n", answer);
  }


  // Problem 2
  {
    long answers[N] = {0};
    int answers_size = 0;

    for (int i = 0; i < lines_size; i++) {
      char* ptr = lines[i];
      char ret = parse(&ptr, 0);

      if (!ret) { // not corrupted
        ptr = lines[i]; // reset ptr
        answers[answers_size++] = complete(&ptr, 0);

        // keep sorted
        for (int j = answers_size - 1; j > 0; j--) {
          if (answers[j] > answers[j - 1]) {
            SWAP(long, answers[j], answers[j - 1])
          } else {
            break;
          }
        }
      }
    }

    printf("Answer 2: %ld\n", answers[answers_size / 2]);
  }


  fclose(file);

  return 0;
}
