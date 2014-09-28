'use strict';

angular.module('habaiApp')
  .controller('DevicesLoaderCtrl', ['$scope', 'data', function ($scope, data) {
    
    $scope.dataReady = false;
    
    data.whenReady().then(function() {
      $scope.dataReady = true;
    });

  }]);
