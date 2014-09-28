'use strict';

angular.module('habaiApp')
  .controller('PortSelectorCtrl', ['$scope', 'data', function ($scope, data) {

    data.whenReady().then(function() {
      $scope.$watch('id', update);
      $scope.$watch('deviceId', update);
      $scope.$watch('totalPorts', update);
    });

    $scope.select = function(id) {
      $scope.id = id;
      update();
    };

    function update() {

      $scope.ports = [];
      
      var ports;
      if($scope.totalPorts) {
        ports = $scope.totalPorts;
      } else {
        var device = data.getDevice($scope.deviceId);
        if(device) {
          ports = device.ports;
        }
      }
      
      if(ports) {
        for (var i = 1; i <= ports; i++) {
          $scope.ports.push({
            number: i, 
            selected: i === $scope.id
          });
        }
      }
      
    }

  }]);
