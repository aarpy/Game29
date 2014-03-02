'use strict'

angular.module('game29App')
  .service 'Socket', ($rootScope) ->
    socket = io.connect()
    return socketEvents =
      on: (eventName, callback) ->
        socket.on eventName, ->
          args = arguments
          $rootScope.$apply ->
            callback.apply socket, args
          return
        return

      emit: (eventName, data, callback) ->
        socket.emit eventName, data, ->
          args = arguments
          $rootScope.$apply ->
            callback.apply socket, args if callback
          return
        return