'use strict';

angular.module('instieventsportalApp')
  .controller('ScheduleCtrl', function ($scope) {
    $scope.events = [{
    	date:"25 August",
    	description:"description",
    	title:"Manual Robotics"
    },
    {
    	date:"25 August",
    	description:"description",
        title:"Fire n Ice" 
    }];
  });
