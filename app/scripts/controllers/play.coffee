'use strict'

angular.module('game29App')
  .controller 'PlayCtrl', ($scope, $http, socketFactory) ->

    $scope.room = ''
    $scope.rooms = ['room1', 'room2'];
    $scope.messages = [
      { user: 'test1', text: 'message1' }
      { user: 'test2', text: 'message2' }
    ]

    $http.get('/api/awesomeThings').success (awesomeThings) ->
      $scope.awesomeThings = awesomeThings

    socket = socketFactory()

    socket.on 'init', (data) ->
      $scope.name = data.name
      $scope.users = data.users
      $scope.rooms = data.rooms
      seatPlayer()

    socket.on 'send:message', (message) ->
      $scope.messages.push message

    socket.on 'change:name', (data) ->
      changeName data.oldName, data.newName

    socket.on 'change:room', (data) ->
      $scope.room = data.room
      $scope.users = data.users
      $scope.rooms = data.rooms

    socket.on 'user:join', (data) ->
      $scope.messages.push
        user: 'chatroom'
        text: "User #{data.name} has joined."
      $scope.users.push data.name

    # add a message to the conversation when a user disconnects or leaves the room
    socket.on 'user:left', (data) ->
      $scope.messages.push
        user: 'chatroom'
        text: "User #{ data.name } has left."

      _.remove $scope.users, (user) ->
        user is data.name

    socket.on 'game:seat', (data) ->
      console.log 'game:seat recieved on the client'
      $scope.messages.push
        user: 'chatroom'
        text: "User #{data.name} has seated at #{data.position} position."
        
    socket.on 'game:roundstarted', (data) ->
      console.log 'game:roundstarted - '
      console.log data
      @game = new App.Controllers.Game data
        
    changeName = (oldName, newName) ->
      # rename user in list of users
      for user, index in $scope.users
        if user is oldName
          $scope.users[index] = newName
          break

      $scope.messages.push
        user: 'chatroom',
        text: "User #{oldName} is now known as #{newName}."

    changeRoom = (oldRoom, newRoom, newUsers) ->
      $scope.messages.length = 0
      $scope.messages.push
        user: 'chatroom',
        text: "Changing room from #{oldRoom} to #{newRoom}."

      $scope.name = $scope.newRoom
      $scope.newRoom = ""
      $scope.users = newUsers

    seatPlayer = () ->
      console.log "sending game:seat to server"
      socket.emit "game:seat",
        name: $scope.name
      , (result) ->
        console.log "recieved game:seat response from server"
        unless result
          alert "There was an error game:seat your room #{result}"

    $scope.changeName = ->
      socket.emit "change:name",
        name: $scope.newName
      , (result) ->
        unless result
          alert "There was an error changing your name"
        else
          changeName $scope.name, $scope.newName
          $scope.name = $scope.newName
          $scope.newName = ""

    $scope.sendMessage = ->
      socket.emit "send:message",
        message: $scope.message

      # add the message to our model locally
      $scope.messages.push
        user: $scope.name
        text: $scope.message

      # clear message box
      $scope.message = ""

    $scope.changeRoom = ->
      console.log "sending change:room to server"
      socket.emit "change:room",
        room: $scope.newRoom
      , (result) ->
        console.log "recieved change:room response from server"
        unless result
          alert "There was an error changing your room"
        else
          changeRoom $scope.room, result.users

    $scope.seatPlayer = ->
      seatPlayer()

    $scope.restartGame = () ->
      console.log "sending game:restart to server"
      socket.emit "game:restart",
        name: $scope.name
      , (result) ->
        console.log "recieved game:restart response from server"
        unless result
          alert "There was an error game:restart your room #{result}"

