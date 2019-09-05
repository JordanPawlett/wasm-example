# wasm-example
A small example of compiling a low-level language into WebAsembly, running it in a NodeJS environment, and providing an additional performance analysis against the two.


In this particular example an iterative binary search solution is implemented in both javascript in C++.

Over 50 tests the C++ implementation appears to be an average of 2x faster than the javascript counterpart.


The compilation time of the C++ / WASM version seems to be much more consistent than the javascript.


### Ensure the compile script has permissions
Compile the C++ into WASM and the .js glue code required.
`chmod +x ./compile.sh`


### Once compiled, run the performance test.
`npm start`


### Results against an array of size 600000 ran, 50 times.
```sh
Filling array of size 600000 with random numbers, and sorting
Testing 50 times
Calculating averages
javascript average 0.01441944
wasm average 0.00586366
```


### Have a Play
You should be able to easily swap out the BinarySearch implementation for your own function you'd like to test.
Just replace the anonymous function that is passed in as a parameter to the `checkPerformance` function.