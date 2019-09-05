const { PerformanceObserver, performance } = require('perf_hooks');

// Import the javascript glue code and configure the wasm module.
const Module = require('./binarySearch.js');
const wasm = Module({ wasmBinaryFile: 'binarySearch.wasm' });

// Creat a summation of each performance measure.
const javascriptSum = []
const wasmSum = []
const numberOfTests = 50;
const arrSize = 600000;

// Observe the performance measures for each entry names.
const obs = new PerformanceObserver((items) => {
  const javascript = items.getEntriesByName('javascript')[0];
  const wasm = items.getEntriesByName('wasm')[0];
  if (wasm) {
    wasmSum.push(wasm.duration);
  }

  if (javascript) {
    javascriptSum.push(javascript.duration)
  }

  performance.clearMarks();
});
obs.observe({ entryTypes: ['measure'] });

/**
 * Wrap the func in test marks with the given name and data set to test against.
 */
function checkPerformance(func, name) {
  performance.mark('A');
  func();
  performance.mark('B');
  performance.measure(name, 'A', 'B');
}

/**
 * Iterative implementation of binary search.
 */
function binarySearch(_arr, start, end, x) {
  while (start <= end) {
    let mid = Math.floor((start + end) / 2);

    if (_arr[mid] === x) {
      return mid
    };

    if (_arr[mid] < x) {
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }

  return -1;
}

/**
 * Convert the array into something C++ understands then allocate the typed array into a space in memory.
 */
function transferArrayToHeap(arrToTransfer) {
  const typedArray = new Int32Array(arrToTransfer.length)

  // Populate the array with the values
  for (let i = 0; i < arrToTransfer.length; i++) {
    typedArray[i] = arrToTransfer[i]
  }
  // Allocate some space in the heap for the data/
  const heapSpace = buffer = wasm._malloc(typedArray.length * typedArray.BYTES_PER_ELEMENT)

  // Assign the data to the heap 
  wasm.HEAPU32.set(typedArray, buffer >> 2)
  return heapSpace;
}

/**
 * Print average performance reuslts.
 */
function calculateAverages() {
  console.log('Calculating averages')
  // Calculate averages from the summation.
  const javascriptAvg = javascriptSum.reduce((curr, prev) => curr + prev) / javascriptSum.length;
  const wasmAvg = wasmSum.reduce((curr, prev) => curr + prev) / wasmSum.length;
  console.log('javascript average', javascriptAvg);
  console.log('wasm average', wasmAvg);
}

// Called when the wasm module is available.
wasm.onRuntimeInitialized = function () {
  console.log('Filling array of size', arrSize, 'with random numbers, and sorting')
  const arr = new Array(arrSize).fill(Math.random).map(el => Math.floor(el() * 1000 + 1)).sort();
  arr[53] = 10;

  // Transfer allocate the arr to a space in memory.
  const memPointer = transferArrayToHeap(arr);
  console.log('Testing', numberOfTests, 'times')
  // Test x times...
  for (let i = 0; i < numberOfTests; i++) {
    checkPerformance(() => binarySearch(arr, 0, arr.length - 1, 10), 'javascript')
    checkPerformance(() => wasm.__Z12binarySearchPiiii(memPointer, 0, arr.length - 1, 10), 'wasm');
  }

  calculateAverages();

  wasm._free(memPointer);
};

