function search(studentInfo, condition) {
	var len = studentInfo.length;
	var result = [];
	var i, j;

	if (arguments.length != 2 || typeof arguments[0] != 'object') {
		return false;
	}

	switch (typeof condition) {
		case 'number':
			for (i = 0; i < len; i++) {
				if (studentInfo[i].age == condition) {
					result.push(studentInfo[i]);
				}
			}

			if (result.length == 0) {
				return false;
			}
			else {
				return result;
			}

		case 'string':
			for (i = 0; i < len; i++) {
				if (studentInfo[i].name == condition) {
					return studentInfo[i];
				}
			}
			return false;

		case 'object':
			for (i = 0; i < len; i++) {
				for (j in condition) {
					if (condition[j] != studentInfo[i][j]) {
						j = false;
						break;
					}
				}
				if (j) {
					result.push(studentInfo[i]);
				}
			}

			if (result.length == 0) {
				return false;
			}
			else {
				return result;
			}

		default:
			return false;
	}
}

var TAinfo = [
	{name: 'chenhuarong', age: 233, hometown: 'fujian'},
	{name: 'jianglinnan', age: 233, hometown: 'beijing'},
	{name: 'qiankanglai', age: 23,  hometown: 'beijing'}
];

console.log(search(TAinfo, 233));
console.log(search(TAinfo, 20));

console.log(search(TAinfo, 'chenhuarong'));
console.log(search(TAinfo, 'chr'));

console.log(search(TAinfo, {age: 233, hometown: 'beijing'}));
console.log(search(TAinfo, {age: 23, hometown: 'fujian'}));

