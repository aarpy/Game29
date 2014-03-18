var Rank = require('./rank'),
    Ranks = require('./ranks'),
    Suites = require('./suites'),
    Card = require('./card'),
    _ = require('lodash');

var round = function Round(players) {

    function createDeck() {
        var deck = [];
        for (var i = 6; i < Ranks.length; i++) {
            for (var j = 0; j < Suites.length; j++) {
                deck.push(new Card(Ranks[i], Suites[j]));
            }
        }
        return _.shuffle(deck);
    }

    function createPlayerDecks(deck) {
        var playerDecks = [];
        for (var i = 0; i < players.length; i++) {
            playerDecks.push({
                id: players[i],
                deck: deck.slice(i*7, 7)
            });
        }
        return playerDecks;
    }

    function constructor() {
        var deck = createDeck();
        this.playerDecks = createPlayerDecks(deck);
    }

    constructor();
};

module.exports = round;
