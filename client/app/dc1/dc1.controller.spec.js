'use strict';

describe('Controller: Dc1Ctrl', function () {

  // load the controller's module
  beforeEach(module('s2vizApp'));

  var Dc1Ctrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    Dc1Ctrl = $controller('Dc1Ctrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
