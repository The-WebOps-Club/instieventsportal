'use strict';

angular.module('instieventsportalApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/clubs', {
        templateUrl: 'app/clubs/clubs.html',
        controller: 'ClubsCtrl'
      });
  });
