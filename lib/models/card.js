var _nextId = 0;

module.exports = function Card(rank, suit) {
    return {
        rank: rank,
        suit: suit,
        id: "id" + (_nextId++)
    };
}
