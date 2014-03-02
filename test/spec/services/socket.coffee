'use strict'

describe 'Service: Socket', () ->

  # load the service's module
  beforeEach module 'game29App'

  # instantiate service
  Socket = {}
  beforeEach inject (_Socket_) ->
    Socket = _Socket_

  it 'should do something', () ->
    expect(!!Socket).toBe true
