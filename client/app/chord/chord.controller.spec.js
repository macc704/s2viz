'use strict';

describe('Controller: ChordCtrl', function () {

  // load the controller's module
  beforeEach(module('s2vizApp'));

  var ChordCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ChordCtrl = $controller('ChordCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
