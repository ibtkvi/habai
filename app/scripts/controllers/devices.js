'use strict';


angular.module('habaiApp')
  .controller('DevicesCtrl', ['$scope', 'data', 'status', '$state', function ($scope, data, status, $state) {

    var deviceId;
    
    $scope.$on('dataUpdated', update);

    $scope.$on('$stateChangeSuccess', function(event, to, toParams, from, fromParams) {
      if(to === from) {
        $scope.direction = getDirection(parseDeviceId(toParams.deviceId), parseDeviceId(fromParams.deviceId));
      }
      update();
    });

    update();
    
    function update() {
      deviceId = parseDeviceId($state.params.deviceId);
      $scope.ancestors = getAncestors(deviceId);
      status.ensure(deviceId);
    }

    $scope.status = status.data;    
    
    $scope.updateStatus = function() {
      if(deviceId !== undefined) status.update(deviceId);
    };

    function getAncestors(id) {
      var ancestors = [];
      while(id) {
        var device = data.getDevice(id);
        ancestors.unshift({device: device, id: 'device:' + device.id});
        id = device.parent_id;
      }
      ancestors.unshift({root: true, id: 'root'});
      return ancestors;
    }

    function getDirection(nextId, prevId) {
      if(nextId) {
        if(data.getDevice(nextId).parent_id === prevId) {
          return 'forward';
        }
      }
      if(prevId) {
        if(data.getDevice(prevId).parent_id === nextId) {
          return 'backward';
        }
      }
      return '';
    }

    function parseDeviceId(str) {
      return parseInt(str) || null;
    }

  }]);
