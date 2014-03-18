var Round = require('./round'),
    _ = require('lodash');

var game = function Game() {
    var players = [];
    var round;

    function gameStarted() { 
        return players.length > 4;
    }

    function seatPlayer(id) {
        if (!gameStarted()) {
            return false;
        }

        players.push(id);
        
        if (!gameStarted()) {
            startRound();
        }
        return true;
    }

    function playerPosition(id) {
        return _.indexOf(players, id);
    }

    function startRound() {
        round = new Round(players);
    }

    constructor();

    return {
        gameStarted: gameStarted,
        seatPlayer: seatPlayer,
        playerPosition: playerPosition,
        round: round
    };
};

module.exports = game;
