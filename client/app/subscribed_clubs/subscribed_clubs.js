'use strict';

angular.module('instieventsportalApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/subscribed_clubs', {
        templateUrl: 'app/subscribed_clubs/subscribed_clubs.html',
        controller: 'SubscribedClubsCtrl'
      });
  });
