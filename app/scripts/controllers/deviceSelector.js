'use strict';

angular.module('habaiApp')
  .controller('DeviceSelectorCtrl', ['$scope', 'data', function ($scope, data) {

    $scope.$watch('id', update);

    function update() {
      $scope.ancestors = getAncestors($scope.id);
      $scope.children = getChildren($scope.id);
    }

    function getAncestors(id) {
      var ancestors = [];
      while(id) {
        var device = data.getDevice(id);
        ancestors.unshift({device: device, id: 'device:' + device.id});
        id = device.parent_id;
      }
      ancestors.unshift({root: true, id: 'root'});
      return ancestors;
    };

    function getChildren(id) {
      var children = [];
      data.getAllDevices().forEach(function(device) {
        if(device.parent_id === id) {
          children.push({device: device});
        }
      });
      return children;
    }

    $scope.select = function(id) {
      $scope.id = id;
    };

  }]);
