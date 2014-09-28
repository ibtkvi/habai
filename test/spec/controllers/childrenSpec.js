'use strict';

describe('Controller: ChildrenCtrl', function () {

  var ChildrenCtrl, $controller, scope, $state, devicesStateDataObject, data;

  beforeEach(module('habaiApp'));

  beforeEach(function() {
    mock.services.StateMock();
    mock.services.DataMock();
  });

  beforeEach(inject(function (_$controller_, $rootScope, _$state_, _data_) {
    
    $controller = _$controller_;

    $state = _$state_;
    devicesStateDataObject = $state.get('devices').data;
    
    data = _data_;
    
    scope = $rootScope.$new();
    data.flush();
    
  }));

  describe('children resolve', function() {

    it('should resolve children', function() {
      data.setFixtures({
        devices: [
          {id: 100, parent_id: null, my_port: 1, parent_port: null, ports: 96},
            // ep 1
            // ep 2
            {id: 110, parent_id: 100, my_port: 1, parent_port: 4, ports: 24},
            {id: 120, parent_id: 100, my_port: 1, parent_port: 5, ports: 5}
        ],
        endPoints: [
          {id: 1, device_id: 100, device_port: 2},
          {id: 2, device_id: 100, device_port: 3}
        ]
      });
      $state.params.deviceId = '100';
      ChildrenCtrl = $controller('ChildrenCtrl', { $scope: scope });
      expect(scope.children[1][0].endPoint).toBe(data.getEndPoint(1));
      expect(scope.children[2][0].endPoint).toBe(data.getEndPoint(2));
      expect(scope.children[3][0].device).toBe(data.getDevice(110));
      expect(scope.children[4][0].device).toBe(data.getDevice(120));
      expect(scope.children.length).toBe(96);
    });

    it('should resolve children of root device', function() {
      data.setFixtures({
        devices: [
          {id: 1, parent_id: null, my_port: 1, parent_port: null, ports: 96}
        ],
        endPoints: [
          {id: 1, device_id: null, device_port: null}
        ]
      });
      $state.params.deviceId = 'root';
      ChildrenCtrl = $controller('ChildrenCtrl', { $scope: scope });
      expect(scope.children.length).toBe(2);
      expect(scope.children[0][0].device).toBe(data.getDevice(1));
      expect(scope.children[1][0].endPoint).toBe(data.getEndPoint(1));
    });

    it('should set customer for end point', function() {
      data.setFixtures({
        devices: [{
          id: 1,
          my_port: 1,
          ports: 10
        }],
        endPoints: [{
          id: 1,
          customer_id: 1,
          device_id: 1,
          device_port: 2
        }],
        customers: [{
          id: 1
        }]
      });
      $state.params.deviceId = '1';
      ChildrenCtrl = $controller('ChildrenCtrl', { $scope: scope });
      expect(scope.children[1][0].customer).toBe(data.getCustomer(1));
    });

    it('should set upward flag on parent device', function() {
      data.setFixtures({
        devices: [{
          id: 1,
          ports: 10,
          my_port: 1,
          parent_id: null
        }, {
          id: 2,
          ports: 10,
          my_port: 1,
          parent_id: 1,
          parent_port: 2
        }]
      });
      $state.params.deviceId = '2';
      ChildrenCtrl = $controller('ChildrenCtrl', { $scope: scope });
      expect(scope.children[0][0].upward).toBe(true);
    });

    it('should update children on dataUpdated event', function() {
      data.setFixtures({
        devices: [{
          id: 1,
          ports: 10,
          my_port: 1
        }]
      });
      $state.params.deviceId = '1';
      ChildrenCtrl = $controller('ChildrenCtrl', { $scope: scope });
      var prev = scope.children;
      scope.$broadcast('dataUpdated');
      expect(scope.children).not.toBe(prev);
    });

  });

  describe('highlight', function() {

    beforeEach(function() {
      data.setFixtures({
        devices: [{
          id: 1,
          ports: 10,
          my_port: 1
        }],
        endPoints: [{
          id: 1,
          customer_id: 1,
          device_id: 1,
          device_port: 2
        }],
        customers: [{
          id: 1
        }]
      });
      devicesStateDataObject.selectedCustomerId = 1;
      $state.params.deviceId = '1';
      ChildrenCtrl = $controller('ChildrenCtrl', { $scope: scope });
    });

    it('should set end point highlighted', function() {
      expect(scope.children[1][0].highLighted).toBe(true);
    });

    it('should reset selected customer', function() {
      expect(devicesStateDataObject.selectedCustomerId).toBe(null);
    });

    it('should set row highlighted if it has one or more highlighted item', function() {
      expect(scope.children[1].highLighted).toBe(true);
    });

  });

  describe('other devices of customer', function() {

    it('should set other devices', function() {
      data.setFixtures({
        devices: [{
          id: 1,
          my_port: 1,
          ports: 10
        }, {
          id: 2,
          my_port: 1,
          ports: 10
        }],
        endPoints: [{
          id: 1,
          customer_id: 1,
          device_id: 1,
          device_port: 2
        }, {
          id: 2,
          customer_id: 1,
          device_id: 2,
          device_port: 2
        }],
        customers: [{
          id: 1
        }]
      });
      $state.params.deviceId = '1';
      ChildrenCtrl = $controller('ChildrenCtrl', { $scope: scope });
      expect(scope.children[1][0].otherDevices.length).toBe(1);
      expect(scope.children[1][0].otherDevices[0].device).toBe(data.getDevice(2));
    });

    it('should set other devices if other device is root', function() {
      data.setFixtures({
        devices: [{
          id: 1,
          my_port: 1,
          ports: 10
        }],
        endPoints: [{
          id: 1,
          customer_id: 1,
          device_id: 1,
          device_port: 2
        }, {
          id: 2,
          customer_id: 1,
          device_id: null,
          device_port: null
        }],
        customers: [{
          id: 1
        }]
      });
      $state.params.deviceId = '1';
      ChildrenCtrl = $controller('ChildrenCtrl', { $scope: scope });
      expect(scope.children[1][0].otherDevices.length).toBe(1);
      expect(scope.children[1][0].otherDevices[0].root).toBe(true);
    });

    it('should set other devices if current device is root', function() {
      data.setFixtures({
        devices: [{
          id: 1,
          my_port: 1,
          ports: 10
        }],
        endPoints: [{
          id: 1,
          customer_id: 1,
          device_id: 1,
          device_port: 2
        }, {
          id: 2,
          customer_id: 1,
          device_id: null,
          device_port: null
        }],
        customers: [{
          id: 1
        }]
      });
      $state.params.deviceId = 'root';
      ChildrenCtrl = $controller('ChildrenCtrl', { $scope: scope });
      expect(scope.children[1][0].otherDevices.length).toBe(1);
      expect(scope.children[1][0].otherDevices[0].device).toBe(data.getDevice(1));
    });

    it('should set selectedCustomerId and redirect to device', function() {
      ChildrenCtrl = $controller('ChildrenCtrl', { $scope: scope });
      scope.gotoOtherDevice(1, 2);
      expect($state.go).toHaveBeenCalledWith('.', {deviceId: 1});
      expect(devicesStateDataObject.selectedCustomerId).toBe(2);
    });

  });

});
