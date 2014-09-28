'use strict';

describe('Controller: EndPointCtrl', function () {

  var EndPointCtrl, $controller, scope, data, $state, devicesStateDataObject;
  
  beforeEach(module('habaiApp'));

  beforeEach(function() {
    mock.services.DataMock();
    mock.services.StateMock();
  });

  beforeEach(inject(function (_$controller_, $rootScope, _data_, _$state_) {
    
    $controller = _$controller_;
    data = _data_;
    $state = _$state_;
    devicesStateDataObject = $state.get('devices').data;

    scope = $rootScope.$new();
    
    data.flush();

  }));

  describe('creating new end point', function() {

    it('should create new object', function() {
      $state.params.editingEndPointId = 'new';
      EndPointCtrl = $controller('EndPointCtrl', { $scope: scope });
      expect(scope.endPoint).not.toBeUndefined();
    });

    it('should set default values to newly created object', function() {
      $state.params.editingEndPointId = 'new';
      devicesStateDataObject.selectedDeviceId = 100;
      devicesStateDataObject.lastUsedCustomerId = 200;
      EndPointCtrl = $controller('EndPointCtrl', { $scope: scope });
      expect(scope.endPoint.device_id).toBe(100);
      expect(scope.endPoint.customer_id).toBe(200);
    });

    it('should call data.createDevice', function() {
      $state.params.editingEndPointId = 'new';
      EndPointCtrl = $controller('EndPointCtrl', { $scope: scope });
      scope.saveEndPoint();
      expect(data.createEndPoint).toHaveBeenCalled();
    });

  });

  describe('edit end point', function() {
    
    it('should create shalow copy of editing device', function() {
      data.setFixtures({
        endPoints: [{
          id: 1,
          desc: 'val'
        }]
      });
      $state.params.editingEndPointId = '1';
      EndPointCtrl = $controller('EndPointCtrl', { $scope: scope });
      expect(scope.endPoint).not.toBe(data.getEndPoint(1));
      expect(scope.endPoint.desc).toBe('val');
    });

    it('should call updateEndPoint', function() {
      data.setFixtures({
        endPoints: [{
          id: 1
        }]
      });
      $state.params.editingEndPointId = '1';
      EndPointCtrl = $controller('EndPointCtrl', { $scope: scope });
      scope.saveEndPoint();
      expect(data.updateEndPoint).toHaveBeenCalled();      
    });

  });

  describe('delete end point', function() {
    
    it('should call deleteEndPoint', function() {
      data.setFixtures({
        endPoints: [{
          id: 1
        }]
      });
      $state.params.editingEndPointId = '1';
      EndPointCtrl = $controller('EndPointCtrl', { $scope: scope });
      scope.deleteEndPoint();
      expect(data.deleteEndPoint).toHaveBeenCalled();   
    });

  });

  describe('waiting for server', function() {

    it('should wait for server when creating new end point', function() {
      $state.params.editingEndPointId = 'new';
      EndPointCtrl = $controller('EndPointCtrl', { $scope: scope });
      scope.saveEndPoint();
      expect(scope.waitingForServer).toBe(true);
      expect($state.go).not.toHaveBeenCalled();
      data.flush();
      expect(scope.waitingForServer).toBe(false);
      expect($state.go).toHaveBeenCalled();
    });

    it('should NOT wait for server when editing end point', function() {
      data.setFixtures({
        endPoints: [{
          id: 1
        }]
      });
      $state.params.editingEndPointId = '1';
      EndPointCtrl = $controller('EndPointCtrl', { $scope: scope });
      scope.saveEndPoint();
      expect(scope.waitingForServer).toBe(false);
      expect($state.go).toHaveBeenCalled();
    });

    it('should NOT wait for server when deleting end point', function() {
      data.setFixtures({
        endPoints: [{
          id: 1
        }]
      });
      $state.params.editingEndPointId = '1';
      EndPointCtrl = $controller('EndPointCtrl', { $scope: scope });
      scope.deleteEndPoint();
      expect(scope.waitingForServer).toBe(false);
      expect($state.go).toHaveBeenCalled();
    });

  });

  it('should go back to selected device', function() {
    devicesStateDataObject.selectedDeviceId = 1;
    EndPointCtrl = $controller('EndPointCtrl', { $scope: scope });
    scope.goBack();
    expect($state.go).toHaveBeenCalledWith('devices.show.device', {deviceId: 1});
  });

  describe('ip', function() {

    it('should parse ip list to array on init', function() {
      data.setFixtures({
        endPoints: [{
          id: 1,
          customer_id: 2,
          selected_ip: '1.1.1.1,2.2.2.2'
        }],
        customers: [{
          id: 2, 
          ip: []
        }]
      });
      $state.params.editingEndPointId = '1';
      EndPointCtrl = $controller('EndPointCtrl', { $scope: scope });
      expect(scope.selected_ip).toEqual(['1.1.1.1','2.2.2.2']);
    });

    it('should update endPoint.selected_ip when selected_ip changes', function() {
      $state.params.editingEndPointId = 'new';
      EndPointCtrl = $controller('EndPointCtrl', { $scope: scope });
      scope.$digest();
      scope.$apply(function() {
        scope.selected_ip = ['1.1.1.1','2.2.2.2'];
      });
      expect(scope.endPoint.selected_ip).toBe('1.1.1.1,2.2.2.2');
    });

    it('should reset selected_ip when customer changes', function() {
      data.setFixtures({
        endPoints: [{
          id: 1,
          customer_id: 2,
          selected_ip: '1.1.1.1,2.2.2.2'
        }],
        customers: [{
          id: 2, 
          ip: []
        }, {
          id: 3, 
          ip: []
        }]
      });
      $state.params.editingEndPointId = '1';
      EndPointCtrl = $controller('EndPointCtrl', { $scope: scope });
      scope.$digest();
      scope.$apply(function() {
        scope.endPoint.customer_id = 3;
      });
      expect(scope.selected_ip).toEqual([]);
    });

    it('should restore selected_ip when customer changes to init value', function() {
      data.setFixtures({
        endPoints: [{
          id: 1,
          customer_id: 2,
          selected_ip: '1.1.1.1,2.2.2.2'
        }],
        customers: [{
          id: 2, 
          ip: []
        }, {
          id: 3, 
          ip: []
        }]
      });
      $state.params.editingEndPointId = '1';
      EndPointCtrl = $controller('EndPointCtrl', { $scope: scope });
      scope.$digest();
      scope.$apply(function() {
        scope.endPoint.customer_id = 3;
      });
      scope.$apply(function() {
        scope.endPoint.customer_id = 2;
      });
      expect(scope.selected_ip).toEqual(['1.1.1.1','2.2.2.2']);
    });

  });

  describe('customers', function() {

    it('should sort customers', function() {
      data.setFixtures({
        customers: [{
          id: 1,
          name: 'bbb',
          hidden: false,
          active: true
        }, {
          id: 2,
          name: 'ccc',
          hidden: false,
          active: true
        }, {
          id: 3,
          name: 'aaa',
          hidden: false,
          active: true
        }]
      });
      EndPointCtrl = $controller('EndPointCtrl', { $scope: scope });

      expect(scope.allCustomers[0].customer.name).toBe('aaa');
      expect(scope.allCustomers[1].customer.name).toBe('bbb');
      expect(scope.allCustomers[2].customer.name).toBe('ccc');
    });

    it('should put customers into groups', function() {
      data.setFixtures({
        customers: [{
          id: 1,
          name: 'bbb',
          hidden: true,
          active: true
        }, {
          id: 2,
          name: 'ccc',
          hidden: true,
          active: false
        }, {
          id: 3,
          name: 'aaa',
          hidden: false,
          active: true
        }, {
          id: 4,
          name: 'ddd',
          hidden: false,
          active: false
        }]
      });
      EndPointCtrl = $controller('EndPointCtrl', { $scope: scope });

      expect(scope.allCustomers[0].customer.id).toBe(3);
      expect(scope.allCustomers[0].group).toBe('active');

      expect(scope.allCustomers[1].customer.id).toBe(4);
      expect(scope.allCustomers[1].group).toBe('archive');

      expect(scope.allCustomers[2].customer.id).toBe(1);
      expect(scope.allCustomers[2].group).toBe('hidden');
      expect(scope.allCustomers[3].customer.id).toBe(2);
      expect(scope.allCustomers[3].group).toBe('hidden');
    });

  });

  describe('device', function() {

    it('should reset device_port to null when device changes', function() {
      data.setFixtures({
        endPoints: [{
          id: 1,
          device_id: 2,
          device_port: 3
        }]
      });
      $state.params.editingEndPointId = '1';
      EndPointCtrl = $controller('EndPointCtrl', { $scope: scope });
      scope.$digest();
      scope.$apply(function() {
        scope.endPoint.device_id = 3;
      });
      expect(scope.endPoint.device_port).toBe(null);
    });

    it('should restore device_port when device changes to init value', function() {
      data.setFixtures({
        endPoints: [{
          id: 1,
          device_id: 2,
          device_port: 3
        }]
      });
      $state.params.editingEndPointId = '1';
      EndPointCtrl = $controller('EndPointCtrl', { $scope: scope });
      scope.$digest();
      scope.$apply(function() {
        scope.endPoint.device_id = 3;
      });
      scope.$apply(function() {
        scope.endPoint.device_id = 2;
      });
      expect(scope.endPoint.device_port).toBe(3);
    });

  });

});
