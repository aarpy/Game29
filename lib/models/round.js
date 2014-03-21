var Rank = require('./rank'),
    Ranks = require('./ranks'),
    Suites = require('./suites'),
    Card = require('./card'),
    _ = require('lodash');

var round = function Round(players) {
    var playerDecks = [];

    function createDeck() {
        var deck = [];
        for (var i = 6; i < Ranks.length; i++) {
            for (var j = 0; j < Suites.length; j++) {
                deck.push(new Card(Ranks[i], Suites[j]));
            }
        }
        return _.shuffle(deck);
    }

    function startRound() {
        var deck = createDeck();
        for (var i = 0; i < players.length; i++) {
            playerDecks.push({
                id: players[i],
                deck: deck.slice(i*7, 7)
            });
        }
        return playerDecks;
    }

    return {
        playerDecks: playerDecks,
        startRound: startRound
    };
};

module.exports = round;
