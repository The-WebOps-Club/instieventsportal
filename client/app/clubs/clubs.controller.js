'use strict';

angular.module('instieventsportalApp')
  .controller('ClubsCtrl', function ($scope) {
    $scope.clubs = [
    {
    	image:'',
    	name:'Media Club',
    	description:'This is the media club',
    	subscribed:'Subscribed'
    }];
  });
