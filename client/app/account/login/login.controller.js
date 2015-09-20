'use strict';

angular.module('instieventsportalApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $window) {
    console.log("yo");
    $scope.user = {};
    $scope.errors = {};
    
    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        // Auth.login({
        //   roll_no: $scope.user.roll_no,
        //   password: $scope.user.password
        // })
        // .then( function() {
        //   // Logged in, redirect to home
        //   $location.path('/');
        // })
        // .catch( function(err) {
        //   $scope.errors.other = err.message;
        // });
        console.log($scope.user.rollNo);
        console.log($scope.user.password);
      }
    };

    // $scope.loginOauth = function(provider) {
    //   $window.location.href = '/auth/' + provider;
    // };
  });
