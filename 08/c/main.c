#include <stdio.h>
#include <assert.h>
#include <string.h>
#include <stdlib.h>

#define S_LEN 8 // Max segment length + NULL
#define N 254

struct line {
  char ins[10][S_LEN];
  char outs[4][S_LEN];
};

struct line lines[N] = {0};
int lines_size = 0;

int compare (const void* a, const void* b)
{
  return *(char*)a - *(char*)b;
}

char* sort(char* str) {
  qsort(str, strlen(str), sizeof(char), compare);
  return str;
}

// return true if a contains all chars of b
int every(char* b, char* a) {
  int aLen = strlen(a);
  int bLen = strlen(b);

  for (int i = 0; i < aLen; i++) {
    int includes = 0;
    for (int j = 0; j < bLen; j++) {
      if (a[i] == b[j]) {
        includes = 1;
        break;
      }
    }

    if (!includes) return 0;
  }

  return 1;
}

int main(int argc, char *argv[]) {
  assert(argc == 2 && "Must provide one argument => input.txt path");

  printf("Input file: %s\n\n", argv[1]);
  FILE *file = fopen(argv[1], "r");

  char str[S_LEN] = "";
  int curr = 0;
  while (fscanf(file, "%s", str) == 1) {
    // skip number 10 => "|"
    if (curr < 10) {
      strcpy(lines[lines_size].ins[curr], sort(str));
    } else if (curr > 10) {
      strcpy(lines[lines_size].outs[curr - 11], sort(str));
    }


    if (curr == 14) {
      curr = 0;
      lines_size++;
    } else {
      curr++;
    }
  }

  // Problem 1
  {
    int answer = 0;
    for (int i = 0; i < lines_size; i++) {
      for (int j = 0; j < 4; j++) {
        int len = strlen(lines[i].outs[j]);
        if (len == 2 || len == 3 || len == 4 || len == 7) {
          answer++;
        }
      }
    }

    printf("Answer 1: %d\n", answer);
  }

  /* Segment lengths:
    0 => 6
    1 => 2
    2 => 5
    3 => 5
    4 => 4
    5 => 5
    6 => 6
    7 => 3
    8 => 7
    9 => 6
  */

  // Problem 2
  {
    int answer = 0;
    for (int i = 0; i < lines_size; i++) {
      char *one, *seven, *four, *eight;

      // get segment nr 1, 4, 7, 8
      for (int j = 0; j < 10; j++) {
        char* str = lines[i].ins[j];
        int len = strlen(str);
        if (len == 2) one = str;
        if (len == 3) seven = str;
        if (len == 4) four = str;
        if (len == 7) eight = str;
      }

      // l part of number 4
      char l[3] = "";
      for (int j = 0; j < 4; j++) {
        if (four[j] != one[0] && four[j] != one[1]) {
          l[strlen(l)] = four[j];
        }
      }

      char *zero, *six, *nine, *two, *three, *five;
      for (int j = 0; j < 10; j++) {
        char* in = lines[i].ins[j];
        int len = strlen(in);

        if (len == 6) {
          if (!every(in, one)) {
            six = in;
          } else if (!every(in, l)) {
            zero = in;
          } else {
            nine = in;
          }
        }

        if (len == 5) {
          if (every(in, l)) {
            five = in;
          } else if (every(in, one)) {
            three = in;
          } else {
            two = in;
          }
        }
      }

      int mul = 1000;
      for (int j = 0; j < 4; j++) {
        char *str = lines[i].outs[j];
        if (strcmp(str, zero) == 0)  answer += 0 * mul;
        if (strcmp(str, one) == 0)   answer += 1 * mul;
        if (strcmp(str, two) == 0)   answer += 2 * mul;
        if (strcmp(str, three) == 0) answer += 3 * mul;
        if (strcmp(str, four) == 0)  answer += 4 * mul;
        if (strcmp(str, five) == 0)  answer += 5 * mul;
        if (strcmp(str, six) == 0)   answer += 6 * mul;
        if (strcmp(str, seven) == 0) answer += 7 * mul;
        if (strcmp(str, eight) == 0) answer += 8 * mul;
        if (strcmp(str, nine) == 0)  answer += 9 * mul;
        mul /= 10;
      }
    }

    printf("Answer 2: %d\n", answer);
  }


  fclose(file);

  return 0;
}
