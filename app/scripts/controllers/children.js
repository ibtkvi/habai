'use strict';

angular.module('habaiApp')
  .controller('ChildrenCtrl', ['$scope', 'data', '$state', function ($scope, data, $state) {

    var deviceId = parseInt($state.params.deviceId) || null,
        devicesStateData = $state.get('devices').data;

    devicesStateData.selectedDeviceId = deviceId;

    $scope.isRoot = !deviceId;
    
    $scope.$on('dataUpdated', update);
    
    update();
    
    function update() {
      $scope.children = getChildren(deviceId);
    }
    
    $scope.gotoOtherDevice = function(id, customer_id) {
      devicesStateData.selectedCustomerId = customer_id;
      $state.go('.', {deviceId: id || 'root'});
    };

    function getChildren(id) {

      var children = [];
      
      if(id) {
        for(var i = 0; i < data.getDevice(id).ports; i++) {
          children.push([]);
        };
        data.getAllDevices().forEach(function(device) {
          if(device.id === id) {
            children[device.my_port - 1].push(device.parent_id ? {device: data.getDevice(device.parent_id), upward: true} : {root: true});
          }
          if(device.parent_id === id) {
            children[device.parent_port - 1].push({device: device});
          }
        });
        data.getAllEndPoints().forEach(function(endPoint) {
          if(endPoint.device_id === id) {
            children[endPoint.device_port - 1].push(prepareEndPoint(endPoint));
          }
        });        
      } else {
        data.getAllDevices().forEach(function(device) {
          if(!device.parent_id) {
            children.push([{device: device}]);
          }
        });
        data.getAllEndPoints().forEach(function(endPoint) {
          if(!endPoint.device_id) {
            children.push([prepareEndPoint(endPoint)]);
          }
        });    
      }

      children.forEach(function(childs) {
        var highLighted = false;
        childs.forEach(function(child) {
          if(child.highLighted) highLighted = true;
        });
        childs.highLighted = highLighted;
      });

      devicesStateData.selectedCustomerId = null;

      return children;

      function prepareEndPoint(endPoint) {

        return { 
          endPoint: endPoint,
          customer: data.getCustomer(endPoint.customer_id),
          ip: getIp(),
          highLighted: endPoint.customer_id && endPoint.customer_id === devicesStateData.selectedCustomerId,
          otherDevices: endPoint.customer_id ? getOtherDevices() : []
        };

        function getOtherDevices() {
          var otherDevices = [];
          getAllDevices(endPoint.customer_id).forEach(function(device) {
            if(device && device.id !== endPoint.device_id) {
              otherDevices.push({ device: device });
            }
            else if(!device && endPoint.device_id) {
              otherDevices.push({ root: true });
            }
          });
          return otherDevices;
        }

        function getIp() {
          var customer = data.getCustomer(endPoint.customer_id);
          if(customer) {
            var selected_ip = endPoint.selected_ip ? endPoint.selected_ip.split(',') : null;
            if(selected_ip) {
              return customer.ip.filter(function(ip) {
                return selected_ip.indexOf(ip.ip) !== -1;
              })
            } else {
              return customer.ip;
            } 
          }
          return null;
        }

      }

    }

    function getAllDevices(id) {
      var allDevices = [];
      data.getAllEndPoints().forEach(function(endPoint) {
        if(endPoint.customer_id === id) {
          var device = data.getDevice(endPoint.device_id);
          if(allDevices.indexOf(device) === -1) {
            allDevices.push(device);
          }
        }
      });
      return allDevices;
    }

  }]);
