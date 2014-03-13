'use strict'

angular.module('game29App')
  .service 'socketz', ($rootScope) ->
    # AngularJS will instantiate a singleton by calling "new" on this function
    class Socket
      constructor: ->
        @socket = io.connect()

      on: (eventName, callback) ->
        @socket.on eventName, ->
          args = arguments
          socket = @socket
          $rootScope.$apply ->
            callback.apply socket, args

      emit: (eventName, data, callback) ->
        @socket.emit eventName, data, ->
          args = arguments
          socket = @socket
          $rootScope.$apply ->
            callback.apply socket, args if callback

    new Socket
