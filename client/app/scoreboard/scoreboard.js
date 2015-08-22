'use strict';

angular.module('instieventsportalApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/scoreboard', {
        templateUrl: 'app/scoreboard/scoreboard.html',
        controller: 'ScoreboardCtrl'
      });
  });
