'use strict'

describe 'Controller: PlayCtrl', () ->

  # load the controller's module
  beforeEach module 'game29App'

  PlayCtrl = {}
  scope = {}
  $httpBackend = {}

  # Initialize the controller and a mock scope
  beforeEach inject (_$httpBackend_, $controller, $rootScope) ->
    $httpBackend = _$httpBackend_
    $httpBackend.expectGET('/api/awesomeThings').respond ['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']
    scope = $rootScope.$new()
    PlayCtrl = $controller 'PlayCtrl', {
      $scope: scope
    }

  it 'should attach a list of awesomeThings to the scope', () ->
    expect(scope.awesomeThings).to.be.undefined
    $httpBackend.flush()
    expect(scope.awesomeThings.length).to.be 4
