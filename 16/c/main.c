#include <stdio.h>
#include <assert.h>
#include <limits.h>
#include <string.h>

#define N 1000

struct packet {
  int version;
  int type;
  long value;
  struct packet* sub;  // sub packet is a linked list
  struct packet* next; // linked list for siblings
};

struct packet packets[N];
int packets_size = 0;

struct packet* newPacket() {
  assert(packets_size < N && "Increase N");

  return &packets[packets_size++];
}

int dehex(char hex) {
  if (hex <= '9') return hex - '0';
  return hex - 'A' + 10;
}

char hex[4096] = {0};
char bin[4096 * 4] = {0};
char* bin_ptr = bin;

void binify() {
  for (size_t i = 0; i < strlen(hex); i++) {
    int j = i * 4;
    int num = dehex(hex[i]);

    bin[j + 0] = (num & 8) ? '1' : '0';
    bin[j + 1] = (num & 4) ? '1' : '0';
    bin[j + 2] = (num & 2) ? '1' : '0';
    bin[j + 3] = (num & 1) ? '1' : '0';
  }
}

long dec(int num) {
  long curr = 1;
  long ret = 0;

  for (int i = num - 1; i >= 0; i--) {
    if (bin_ptr[i] == '1') {
      ret += curr;
    }
    curr *= 2;
  }

  bin_ptr +=  num;

  return ret;
}

char* get(int num) {
  char* ret = bin_ptr;
  bin_ptr += num;
  return ret;
}

struct packet* packify() {
  struct packet* packet = newPacket();

  int version = dec(3);
  int type = dec(3);
  packet->version = version;
  packet->type = type;

  // literal value
  if (type == 4) {
    char buff[1024] = {0};
    int buff_size = 0;

    while (get(1)[0] == '1') {
      for (int i = 0; i < 4; i++) {
        buff[buff_size++] = *(bin_ptr++);
      }
    }

    for (int i = 0; i < 4; i++) {
      buff[buff_size++] = *(bin_ptr++);
    }

    // last one
    char* temp = bin_ptr;
    bin_ptr = buff;
    long literal = dec(buff_size);
    bin_ptr = temp;

    packet->value = literal;
    return packet;
  }

  if (get(1)[0] == '0') {
    long size = dec(15);
    char* end = bin_ptr + size;

    packet->sub = packify();

    struct packet* curr = packet->sub;
    while (bin_ptr != end) {
      curr->next = packify();
      curr = curr->next;
    }
  } else {
    long size = dec(11);

    packet->sub = packify();
    struct packet* curr = packet->sub;
    for (int i = 0; i < size - 1; i++) {
      curr->next = packify();
      curr = curr->next;
    }
  }

  return packet;
}

int sumVersion(struct packet* curr) {
  if (!curr) return 0;

  int ret = 0;

  while (curr) {
    ret += curr->version;
    ret += sumVersion(curr->sub);

    curr = curr->next;
  }

  return ret;
}

long operate(struct packet* packet) {
  struct packet* curr = packet->sub;
  int type = packet->type;

  if (type == 0) {
    long ret = 0;
    while (curr) {
      ret += operate(curr);
      curr = curr->next;
    }
    return ret;
  }

  if (type == 1) {
    long ret = 1;
    while (curr) {
      ret *= operate(curr);
      curr = curr->next;
    }
    return ret;
  }

  if (type == 2) {
    long min = LLONG_MAX;
    struct packet* curr = packet->sub;

    while (curr) {
      long val = operate(curr);
      if (val < min) min = val;
      curr = curr->next;
    }

    return min;
  }

  if (type == 3) {
    long max = 0;
    struct packet* curr = packet->sub;

    while (curr) {
      long val = operate(curr);
      if (val > max) max = val;
      curr = curr->next;
    }

    return max;
  }

  if (type == 4) {
    return packet->value;
  }

  if (type == 5) {
    long l = operate(curr);
    long r = operate(curr->next);

    return l > r ? 1 : 0;
  }

  if (type == 6) {
    long l = operate(curr);
    long r = operate(curr->next);

    return l < r ? 1 : 0;
  }

  if (type == 7) {
    long l = operate(curr);
    long r = operate(curr->next);

    return l == r ? 1 : 0;
  }

  assert(0 && "Unreachable");
}

int main(int argc, char *argv[]) {
  assert(argc == 2 && "Must provide one argument => input.txt path");

  printf("Input file: %s\n\n", argv[1]);
  FILE *file = fopen(argv[1], "r");

  assert(fscanf(file, "%s", hex));


  binify();
  struct packet* genesis = packify();

  // Problem 1
  {
    printf("Answer 1: %d\n", sumVersion(genesis));
  }


  // Problem 2
  {
    printf("Answer 2: %ld\n", operate(genesis));
  }


  fclose(file);

  return 0;
}
