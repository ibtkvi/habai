'use strict';

angular.module('habaiApp')
  .controller('EndPointCtrl', ['$scope', 'data', '$state', function ($scope, data, $state) {

    var id = parseId($state.params.editingEndPointId),
        devicesStateDataObject = $state.get('devices').data;

    $scope.waitingForServer = false;

    if(id === 'new') {
      $scope.endPoint = {
        customer_id: devicesStateDataObject.lastUsedCustomerId,
        device_id: devicesStateDataObject.selectedDeviceId
      };
    } else {
      $scope.endPoint = angular.copy(data.getEndPoint(id));
    }


    
    var initState = angular.copy($scope.endPoint);

    $scope.selected_ip = parseSelectedIp($scope.endPoint.selected_ip);

    $scope.$watch('endPoint.device_id', function(id) {
      if(initState.device_id === id) {
        $scope.endPoint.device_port = initState.device_port;
      } else {
        $scope.endPoint.device_port = null;
      }
    });

    $scope.$watch('endPoint.customer_id', function(id) {
      $scope.allIp = [];
      var customer = data.getCustomer(id);
      if(customer) {
        customer.ip.forEach(function(ip) {
          $scope.allIp.push(ip.ip);
        });
      }
      if(initState.customer_id === id) {
        $scope.selected_ip = parseSelectedIp(initState.selected_ip);
      } else {
        $scope.selected_ip = [];
      }
    });

    $scope.$watchCollection('selected_ip', function() {
      $scope.endPoint.selected_ip = $scope.selected_ip.join(',');
    });

    function parseSelectedIp(str) {
      return str ? str.split(',') : [];
    }



    $scope.allCustomers = [];

    add(data.getAllCustomers().filter(function(customer) {
      return customer.hidden === false && customer.active === true;
    }), 'active');
    
    add(data.getAllCustomers().filter(function(customer) {
      return customer.active === false && customer.hidden === false;
    }), 'archive');
    
    add(data.getAllCustomers().filter(function(customer) {
      return customer.hidden === true;
    }), 'hidden');

    function add(arr, group) {
      arr.sort(function(a, b) {
        return a.name > b.name ? 1 : -1;
      }).forEach(function(customer) {
        $scope.allCustomers.push({customer: customer, group: group});
      })
    }



    $scope.deleteEndPoint = function() {
      data.deleteEndPoint($scope.endPoint.id);
      goBack();
    };

    $scope.saveEndPoint = function() {
      devicesStateDataObject.lastUsedCustomerId = $scope.endPoint.customer_id;
      if($scope.endPoint.id) {
        var orig = data.getEndPoint($scope.endPoint.id);
        angular.extend(orig, $scope.endPoint);
        data.updateEndPoint(orig);
        goBack();
      } else {
        $scope.waitingForServer = true;
        data.createEndPoint($scope.endPoint).then(function() {
          $scope.waitingForServer = false;
          goBack();
        });
      }
    };

    $scope.goBack = goBack;

    function goBack() {
      $state.go('devices.show.device', {deviceId: devicesStateDataObject.selectedDeviceId});
    }

    function parseId(str) {
      return parseInt(str) || 'new';
    }

  }]);
