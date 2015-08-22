'use strict';

describe('Controller: ScheduleCtrl', function () {

  // load the controller's module
  beforeEach(module('instieventsportalApp'));

  var ScheduleCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ScheduleCtrl = $controller('ScheduleCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
