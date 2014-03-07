var Rank = require('../../../lib/models/rank.js');

function logRank(number) {
	var r1 = new Rank(number);
	console.log("letter: " + r1.letter());
	if (r1.nextLower() !== null) {
		console.log("  lower: " + r1.nextLower().letter());
	}
	if (r1.nextHigher() !== null) {
		console.log("  upper: " + r1.nextHigher().letter());
	}
}

for (var i = 0; i <=12; i++) {
	logRank(i);
}

var Ranks = require('../../../lib/models/ranks.js');
console.log("ranks length: " + Ranks.length);

Ranks = require('../../../lib/models/ranks.js');
console.log("ranks length: " + Ranks.length);

var Rank2 = require('../../../lib/models/rank.js');
var Rank3 = require('../../../lib/models/rank.js');

Ranks = require('../../../lib/models/ranks.js');
console.log("ranks length: " + Ranks.length);

