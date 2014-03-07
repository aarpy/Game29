
var suites = [];

var suite = function Suite(value) {
    return {
        letter: function() {
            return 'CDHS'.charAt(this.value);
        },
        color: function() {
            if (this.letter() === 'C' || this.letter() === 'S') {
                return 'black';
            } else {
                return 'red';
            }
        },
        Suites: suites
    }
}

// initialize the rank object
for (var i=0; i<= 13; i++) {
    suite.ranks.push(new rank(i));
}

module.exports = suite;
