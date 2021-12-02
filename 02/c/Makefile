CC=gcc
CFLAGS=-Wall -Wextra -std=c11 -pedantic
INPUTS=../input.txt

.PHONY: test
test: main $(INPUTS)
	./main $(INPUTS)

main: main.c
	$(CC) $(CFLAGS) -o main main.c
