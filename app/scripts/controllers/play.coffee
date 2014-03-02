'use strict'

angular.module('game29App')
  .controller 'PlayCtrl', ($scope, $http, Socket) ->

    $scope.messages = [
      { user: 'test1', text: 'message1' }
      { user: 'test2', text: 'message2' }
    ]

    $http.get('/api/awesomeThings').success (awesomeThings) ->
      $scope.awesomeThings = awesomeThings

    socket = Socket
    socket.on 'init', (data) ->
      $scope.name = data.name
      $scope.users = data.users

    socket.on 'send:message', (message) ->
      $scope.messages.push message

    socket.on 'change:name', (data) ->
      changeName data.oldName, data.newName

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

      for user, i in $scope.users
        if user is data.name
          $scope.users.splice i, 1
          break;
      return

    changeName = (oldName, newName) ->
      # rename user in list of users
      for user in $scope.users
        if user is oldName
          user = newName
          break

      $scope.messages.push
        user: 'chatroom',
        text: "User #{oldName} is now known as #{newName}."

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
      return

    $scope.sendMessage = ->
      socket.emit "send:message",
        message: $scope.message


      # add the message to our model locally
      $scope.messages.push
        user: $scope.name
        text: $scope.message


      # clear message box
      $scope.message = ""

    return