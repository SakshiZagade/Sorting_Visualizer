function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function drawArray(container, array, highlight = -1) {
  container.innerHTML = "";
  array.forEach((value, index) => {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${value * 2}px`;
    if (index === highlight) bar.classList.add("active");
    container.appendChild(bar);
  });
}

async function bubbleSort(array, container) {
  let arr = [...array];
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      drawArray(container, arr, j);
      await sleep(50);
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  drawArray(container, arr);
  return arr;
}

async function selectionSort(array, container) {
  let arr = [...array];
  for (let i = 0; i < arr.length; i++) {
    let min = i;
    for (let j = i + 1; j < arr.length; j++) {
      drawArray(container, arr, j);
      await sleep(50);
      if (arr[j] < arr[min]) min = j;
    }
    [arr[i], arr[min]] = [arr[min], arr[i]];
  }
  drawArray(container, arr);
  return arr;
}

async function insertionSort(array, container) {
  let arr = [...array];
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
      drawArray(container, arr, j);
      await sleep(50);
    }
    arr[j + 1] = key;
  }
  drawArray(container, arr);
  return arr;
}

async function mergeSort(array, container) {
  async function merge(arr, l, m, r) {
    let n1 = m - l + 1;
    let n2 = r - m;
    let L = arr.slice(l, m + 1);
    let R = arr.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;

    while (i < n1 && j < n2) {
      if (L[i] <= R[j]) {
        arr[k++] = L[i++];
      } else {
        arr[k++] = R[j++];
      }
      drawArray(container, arr, k);
      await sleep(50);
    }

    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
  }

  async function mergeSortUtil(arr, l, r) {
    if (l < r) {
      let m = Math.floor((l + r) / 2);
      await mergeSortUtil(arr, l, m);
      await mergeSortUtil(arr, m + 1, r);
      await merge(arr, l, m, r);
    }
  }

  let arr = [...array];
  await mergeSortUtil(arr, 0, arr.length - 1);
  drawArray(container, arr);
  return arr;
}

async function quickSort(array, container) {
  async function quickSortUtil(arr, low, high) {
    if (low < high) {
      let pi = await partition(arr, low, high);
      await quickSortUtil(arr, low, pi - 1);
      await quickSortUtil(arr, pi + 1, high);
    }
  }

  async function partition(arr, low, high) {
    let pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      drawArray(container, arr, j);
      await sleep(50);
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
  }

  let arr = [...array];
  await quickSortUtil(arr, 0, arr.length - 1);
  drawArray(container, arr);
  return arr;
}

async function heapSort(array, container) {
  async function heapify(arr, n, i) {
    let largest = i;
    let l = 2 * i + 1;
    let r = 2 * i + 2;

    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;

    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      drawArray(container, arr, i);
      await sleep(50);
      await heapify(arr, n, largest);
    }
  }

  let arr = [...array];
  let n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) await heapify(arr, n, i);
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    await heapify(arr, i, 0);
  }
  drawArray(container, arr);
  return arr;
}

const complexities = {
  bubble: "O(n²)",
  selection: "O(n²)",
  insertion: "O(n²)",
  merge: "O(n log n)",
  quick: "O(n log n)",
  heap: "O(n log n)"
};

async function startComparison() {
  const input = document.getElementById("user-array").value;
  const arr = input.split(",").map(Number);
  const algo1 = document.getElementById("algorithm1").value;
  const algo2 = document.getElementById("algorithm2").value;

  const algo1Title = document.getElementById("algo1-title");
  const algo2Title = document.getElementById("algo2-title");
  const array1 = document.getElementById("array1");
  const array2 = document.getElementById("array2");
  const algo1Complexity = document.getElementById("algo1-complexity");
  const algo2Complexity = document.getElementById("algo2-complexity");

  algo1Title.textContent = algo1.replace(/\b\w/g, c => c.toUpperCase()) + " Sort";
  algo2Title.textContent = algo2.replace(/\b\w/g, c => c.toUpperCase()) + " Sort";
  algo1Complexity.textContent = "Time Complexity: " + complexities[algo1];
  algo2Complexity.textContent = "Time Complexity: " + complexities[algo2];

  const sortFunctions = { bubble: bubbleSort, selection: selectionSort, insertion: insertionSort, merge: mergeSort, quick: quickSort, heap: heapSort };

  await sortFunctions[algo1]([...arr], array1);
  await sortFunctions[algo2]([...arr], array2);
}
