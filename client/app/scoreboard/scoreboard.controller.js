'use strict';

angular.module('instieventsportalApp')
  .controller('ScoreboardCtrl', function ($scope) {
   $scope.data={
   	selectedIndex: 0,
   	bottom: false
   };
   $scope.headers = [
    {
      name: 'Position', 
      field: 'name'
    },{
      name:'Hostel', 
      field: 'description'
    },{
      name: 'Points', 
      field: 'last_modified'
    }
  ];
   $scope.content = [
   {
   	Position:'1',
   	Hostel :'ABC',
   	Points : '10'
   },{
   	Position:'1',
   	Hostel :'ABC',
   	Points : '10'
   }
  ];
});
