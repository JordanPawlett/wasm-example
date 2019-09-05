#!/bin/sh
docker build --rm -f "Dockerfile" -t wasm-example:latest .
docker run --rm -it wasm-example:latest