FROM trzeci/emscripten:latest AS builder
WORKDIR /usr/src/wasm-example
COPY . .
RUN emcc ./src/binarySearch.cpp -O2 -s WASM=1 -Wall -s MODULARIZE=1 -o ./src/binarySearch.js

FROM node:12.7.0-alpine
WORKDIR /usr/src/wasm-example
COPY --from=builder /usr/src/wasm-example/src ./src
COPY package.json ./
CMD yarn start
