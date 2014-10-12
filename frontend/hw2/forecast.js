function forecast(CountryLevel, CandidateCountry) {
	var encode = {
		A1: 0,  B2: 1,  C1: 2,  D2: 3,
		E1: 4,  F2: 5,  G1: 6,  H2: 7,
		B1: 8,  A2: 9,  D1: 10, C2: 11,
		F1: 12, E2: 13, H1: 14, G2: 15
	};
	var candidate = encode[CandidateCountry];
	var data = [];
	var i;

	for (i in CountryLevel) {
		if (encode[i] == undefined) {
			return false;
		}
		data[encode[i]] = CountryLevel[i]
	}

	if (arguments.length != 2
		|| typeof arguments[0] != 'object'
		|| typeof arguments[1] != 'string'
		|| candidate == undefined
		|| data.length != 16) {
		return false;
	}

	return getChampion(data, candidate, 16);
}

//total is power of 2, such as 2, 4, 8...
function getChampion(data, candidate, total) {
	if (total == 2) {
		var	home = data[candidate];
		var away = data[1 - candidate];

		if (home == 0 && away == 0) {
			return 0.5;
		}
		else {
			return home / (home + away);
		}
	}
	else {
		var subdata1 = new Array(total / 2);
		var subdata2 = new Array(total / 2);
		var delta1 = candidate < total / 2 ? 0 : total / 2;
		var delta2 = total / 2 - delta1;
		var p, coe, tmp;
		var i;

		for (i = 0; i < total / 2; i++) {
			subdata1[i] = data[i + delta1];
			subdata2[i] = data[i + delta2];
		}

		p = getChampion(subdata1, candidate - delta1, total / 2);
		coe = 0;
		for (i = 0; i < total / 2; i++) {
			tmp = getChampion(subdata2, i, total / 2);
			coe += (tmp * getChampion([data[candidate], data[i + delta2]], 0, 2));
		}

		return p * coe;
	}
}

//test
console.log(forecast({
				A1: 10,  B2: 10,  C1: 10,  D2: 10,
				E1: 10,  F2: 10,  G1: 10,  H2: 10,
				B1: 10,  A2: 10,  D1: 10, C2: 10,
				F1: 10, E2: 10, H1: 10, G2: 10
			}, 'A1'));