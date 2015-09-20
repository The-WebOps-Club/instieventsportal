'use strict';

describe('Controller: SubscribedClubsCtrl', function () {

  // load the controller's module
  beforeEach(module('instieventsportalApp'));

  var SubscribedClubsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SubscribedClubsCtrl = $controller('SubscribedClubsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
