'use strict'

angular.module('game29App')
  .factory 'Session', ($resource) ->
    $resource '/api/session/'
