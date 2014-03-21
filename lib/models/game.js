var Round = require('./round'),
    _ = require('lodash');

var game = function Game() {
    var players = [];
    var round = new Round(players);

    function gameStarted() { 
        return players.length >= 4;
    }

    function seatPlayer(id) {
        var started = gameStarted();
        if (started) {
            return false;
        }

        players.push(id);
        
        return true;
    }

    function playerPosition(id) {
        return _.indexOf(players, id);
    }

    function startRound() {
        round.startRound();
    }

    return {
        gameStarted: gameStarted,
        startRound: startRound,
        seatPlayer: seatPlayer,
        playerPosition: playerPosition,
        round: round
    };
};

module.exports = game;
