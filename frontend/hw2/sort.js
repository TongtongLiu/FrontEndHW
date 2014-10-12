function bubbleSort(array) {
	var len = array.length;
	var i, j, tmp;

	for (i = len - 1; i > 0; i--) {
		for (j = 0; j < i; j++) {
			if (array[j] > array[j + 1]) {
				tmp = array[j];
				array[j] = array[j + 1];
				array[j + 1] = tmp;
			}
		}
	}
}

function insertionSort(array) {
	var len = array.length;
	var i, j, key;

	for (i = 1; i < len; i++) {
		key = array[i];
		j = i - 1;
		while (j >= 0 && array[j] > key) {
			array[j + 1] = array[j];
			j--;
		}
		array[j + 1] = key;
	}
}

function selectionSort(array) {
	var len = array.length;
	var i, j, k, maxv;

	for (i = len - 1; i > 0; i--) {
		k = 0
		maxv = array[k];
		for (j = 1; j <= i; j++) {
			if (array[j] > maxv) {
				k = j;
				maxv = array[k];
			}
		}
		array[k] = array[i];
		array[i] = maxv;
	}
}

var array = [3, 5, 7, 2, 9, 0, 4, 1, 8, 6];
bubbleSort(array);
console.log(array);

array = [3, 5, 7, 2, 9, 0, 4, 1, 8, 6];
insertionSort(array);
console.log(array);

array = [3, 5, 7, 2, 9, 0, 4, 1, 8, 6];
selectionSort(array);
console.log(array);