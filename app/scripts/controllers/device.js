'use strict';

angular.module('habaiApp')
  .controller('DeviceCtrl', ['$scope', 'data', '$state', function ($scope, data, $state) {

    var id = parseId($state.params.editingDeviceId),
        devicesStateDataObject = $state.get('devices').data;

    $scope.waitingForServer = false;

    if(id === 'new') {
      $scope.device = {
        name: '',
        ports: 24,
        my_port: 1,
        parent_id: devicesStateDataObject.selectedDeviceId
      };
      $scope.deletable = false;
    } else {
      $scope.device = angular.copy(data.getDevice(id));
      $scope.deletable = deletable(id);
    }

    $scope.deleteDevice = function() {
      data.deleteDevice($scope.device.id);
      goBack();
    };

    $scope.saveDevice = function() {
      if($scope.device.id) {
        var orig = data.getDevice($scope.device.id);
        angular.extend(orig, $scope.device);
        data.updateDevice(orig);
        goBack();
      } else {
        $scope.waitingForServer = true;
        data.createDevice($scope.device).then(function() {
          $scope.waitingForServer = false;
          goBack();
        });
      }
    };

    $scope.goBack = goBack;

    function deletable(id) {
      var deletable = true;
      data.getAllDevices().forEach(function(device) {
        if(device.parent_id === id) {
          deletable = false;
        }
      });
      data.getAllEndPoints().forEach(function(endPoint) {
        if(endPoint.device_id === id) {
          deletable = false;
        }
      });
      return deletable;
    }

    function goBack() {
      $state.go('devices.show.device', {deviceId: devicesStateDataObject.selectedDeviceId});
    }

    function parseId(str) {
      return parseInt(str) || 'new';
    }

  }]);
