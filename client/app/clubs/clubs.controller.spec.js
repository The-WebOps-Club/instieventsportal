'use strict';

describe('Controller: ClubsCtrl', function () {

  // load the controller's module
  beforeEach(module('instieventsportalApp'));

  var ClubsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ClubsCtrl = $controller('ClubsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
