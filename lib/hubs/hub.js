var Game = require('../models/game');

// Keep track of which names are used so that there are no duplicates
var userNames = (function () {
    var names = {};

    var claim = function (name) {
        if (!name || names[name]) {
            return false;
        } else {
            names[name] = true;
            return true;
        }
    };

    // find the lowest unused "guest" name and claim it
    var getGuestName = function () {
        var name,
            nextUserId = 1;

        do {
            name = 'Guest ' + nextUserId;
            nextUserId += 1;
        } while (!claim(name));

        return name;
    };

    // serialize claimed names as an array
    var get = function () {
        var res = [];
        for (var user in names) {
            res.push(user);
        }

        return res;
    };

    var free = function (name) {
        if (names[name]) {
            delete names[name];
        }
    };

    return {
        claim: claim,
        free: free,
        get: get,
        getGuestName: getGuestName
    };
}());

function getRoomNames(io) {
    var roomNames = [];
    for (var roomKey in io.sockets.manager.rooms) {
        if (roomKey.length === 0) roomNames.push('default');
        else roomNames.push(roomKey.slice(1));
    }
    return roomNames;
}

var game = new Game();

// TODO: User name is not updated when user changes name
// TODO: Disconnect event is not notified to all users
// export function for listening to the socket
module.exports = function (socket, io) {
    var name = userNames.getGuestName();
    console.log('user joined: ' + name);

    socket.userName = name;
    socket.room = '';

    // send the new user their name and a list of users
    socket.emit('init', {
        name: name,
        users: userNames.get(),
        rooms: getRoomNames(io),
        gameStarted: game.gameStarted()
    });

    // notify other clients that a new user has joined
    socket.broadcast.emit('user:join', {
        name: name
    });

    // broadcast a user's message to other users
    socket.on('send:message', function (data) {
        console.log('received send:message: ' + data.message);
        socket.broadcast.emit('send:message', {
            user: name,
            text: data.message
        });
    });

    // validate a user's name change, and broadcast it on success
    socket.on('change:name', function (data, fn) {
        console.log('received change:name: ' + data.name);
        if (userNames.claim(data.name)) {
            var oldName = name;
            userNames.free(oldName);

            name = data.name;

            socket.broadcast.emit('change:name', {
                oldName: oldName,
                newName: name
            });

            fn(true);
        } else {
            fn(false);
        }
    });

    // validate a user's room change, and broadcast it on success
    socket.on('change:room', function (data, fn) {
        console.log('received change:room: ' + data.room);

        socket.leave(socket.room);
        socket.join(data.room);

        // sent message to OLD room
        socket.broadcast.to(socket.room).emit('send:message', {
            user: 'chatroom',
            text: socket.userName + ' left the room'
        });

        // update socket session room title
        socket.room = data.room;
        socket.broadcast.to(data.room).emit('send:message', {
            user: 'chatroom',
            text: socket.userName + ' joined the room'
        });

        // prepare room information
        var clients = io.sockets.clients(data.room);
        var users = [];
        for (var i = 0; i < clients.length; i++) {
            users.push(clients[i].userName);
        }

        // send room information
        socket.emit('change:room', {
            room: data.room,
            users: users,
            rooms: getRoomNames(io)
        });
    });

    // user seat in the position
    socket.on('game:seat', function (data, fn) {
        if (!game.seatPlayer(socket.userName)) {
            return 'no seats available in this room';
        }

        // sent message to room
        socket.broadcast.to(socket.room).emit('game:seat', {
            name: 'socket.userName',
            position: game.playerPosition(socket.userName)
        });

        if (game.gameStarted()) {
            io.sockets.in(socket.room).emit('game:roundstarted', {
                deck: game.round.playerDecks
            });
        }

        return true;
    });

    // clean up when a user leaves, and broadcast it to other users
    socket.on('disconnect', function () {
        console.log('received disconnect: ' + name);
        socket.broadcast.emit('user:left', {
            name: name
        });
        userNames.free(name);
    });
};