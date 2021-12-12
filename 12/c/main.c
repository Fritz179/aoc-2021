#include <stdio.h>
#include <assert.h>
#include <string.h>
#include <time.h>

#define N 16
struct cave {
  int to[16];
  int to_size;
  int isBig;
  int isStart;
  int isEnd;
};

struct cave caves[N] = {0};

char names[N][N] = {0};
int names_size = 0;
int caveToNum(char* name) {
  for (int i = 0; i < names_size; i++) {
    if (strcmp(name, names[i]) == 0) {
      return i;
    }
  }

  strcpy(names[names_size], name);
  return names_size++;
}

void addPath(char* fromName, char* toName) {
  int from = caveToNum(fromName);
  int to = caveToNum(toName);

  // add flags
  caves[from].isBig = fromName[0] < 'a';

  // connect paths
  caves[from].to[caves[from].to_size++] = to;
}

int getPaths(int from, int visited[N], int twice) {
  if (caves[from].isEnd) return 1;

  if (visited[from]) {
    if (twice || caves[from].isStart) return 0;
    twice = 1;
  }

  if (!caves[from].isBig) visited[from] = 1;

  int paths = 0;
  for (int i = 0; i < caves[from].to_size; i++) {
    int subVisited[16];
    memcpy(subVisited, visited, sizeof(subVisited));
    paths += getPaths(caves[from].to[i], subVisited, twice);
  }

  return paths;
}

int main(int argc, char *argv[]) {
  assert(argc == 2 && "Must provide one argument => input.txt path");

  printf("Input file: %s\n\n", argv[1]);
  FILE *file = fopen(argv[1], "r");

  char from[N] = {0};
  char to[N] = {0};

  while (fscanf(file, "%[a-zA-Z]-%s", from, to) == 2) {
    addPath(from, to);
    addPath(to, from);

    fgetc(file);
  }

  caves[caveToNum("start")].isStart = 1;
  caves[caveToNum("end")].isEnd = 1;

  float start = clock();

  // Problem 1
  {
    int visited[N] = {0};
    int paths = getPaths(caveToNum("start"), visited, 1);
    printf("Answer 1: %d\n", paths);
  }


  // Problem 2
  {
    int visited[N] = {0};
    int paths = getPaths(caveToNum("start"), visited, 0);
    printf("Answer 2: %d\n", paths);
  }

  float time = (clock() - start) / CLOCKS_PER_SEC * 1000;
  printf("\nAnswers found in %dms\n", (int)time);

  fclose(file);

  return 0;
}
