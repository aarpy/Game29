var Ranks = require('./ranks');

var rank = function Rank(value) {
    return {
        letter: function() {
            return 'A23456789TJQK'[value];
        },

        nextLower: function() {
            if (value === 0) {
                return null;
            } else {
                return Ranks[value - 1];
            }
        },

        nextHigher: function() {
            if (value === 12) {
                return null;
            } else {
                return Ranks[value + 1];
            }
        }
    };
};

// initialize the rank object
for (var i=0; i< 13; i++) {
    Ranks.push(new rank(i));
}
console.log('Ranks created');

module.exports = rank;
