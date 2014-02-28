"use strict"

angular.module("game29App")
  .factory "User", ($resource) ->
    $resource "/api/users/:id",
      id: "@id"
    ,
      update:
        method: "PUT"
        params: {}

      get:
        method: "GET"
        params:
          id: "me"

