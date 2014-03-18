
var Suites = require('./suites');

var suite = function Suite(value) {
    return {
        letter: function() {
            return 'CDHS'.charAt(value);
        },
        color: function() {
            if (this.letter() === 'C' || this.letter() === 'S') {
                return 'black';
            } else {
                return 'red';
            }
        }
    };
};

// initialize the rank object
for (var i=0; i<= 3; i++) {
    Suites.push(new suite(i));
}

module.exports = suite;
