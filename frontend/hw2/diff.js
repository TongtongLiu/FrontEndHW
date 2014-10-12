function diff(originInfo, newInfo) {
	var len1 = originInfo.length;
	var len2 = newInfo.length;
	var nameset = {};
	var result = [];
	var i;

	if (arguments.length != 2
		|| typeof arguments[0] != 'object'
		|| typeof arguments[1] != 'object') {
		return false;
	}

	for (i = 0; i < len1; i++) {
		nameset[originInfo[i].name] = 1;
	}
	for (i = 0; i < len2; i++) {
		if (!nameset[newInfo[i].name]) {
			result.push(newInfo[i]);
		}
	}

	return result;
}

var originInfo = [
	{name: 'chenhuarong', age: 233, hometown: 'fujian'},
	{name: 'jianglinnan', age: 233, hometown: 'beijing'},
	{name: 'qiankanglai', age: 23,  hometown: 'beijing'}
];

var newInfo = [
	{name: 'chenhuarong', age: 233, hometown: 'fujian'},
	{name: 'jianglinnan', age: 233, hometown: 'beijing'},
	{name: 'wangsilun', age: 21,  hometown: 'beijing'},
	{name: 'dangfan', age: 23,  hometown: 'beijing'},
];

console.log(diff(originInfo, newInfo));