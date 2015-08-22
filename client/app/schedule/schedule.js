'use strict';

angular.module('instieventsportalApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/schedule', {
        templateUrl: 'app/schedule/schedule.html',
        controller: 'ScheduleCtrl'
      });
  });
