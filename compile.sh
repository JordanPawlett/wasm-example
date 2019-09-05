#!/bin/sh
docker run -v $(pwd)/src:/src trzeci/emscripten:latest emcc binarySearch.cpp -O2 -s WASM=1 -Wall -s MODULARIZE=1 -o binarySearch.js