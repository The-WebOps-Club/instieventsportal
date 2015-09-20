'use strict';

angular.module('instieventsportalApp')
  .controller('SubscribedClubsCtrl', function ($scope) {
     $scope.clubs = [
    { name: 'Writing', status: true },
    { name: 'Choreo', status: false },
    { name: 'WebOps', status: true }
  ];
  });
