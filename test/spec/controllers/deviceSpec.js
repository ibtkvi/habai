'use strict';

describe('Controller: DeviceCtrl', function () {

  var DeviceCtrl, $controller, scope, data, $state, devicesStateDataObject;

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

  describe('creating new device', function() {

    it('should create new object', function() {
      $state.params.editingDeviceId = 'new';
      DeviceCtrl = $controller('DeviceCtrl', { $scope: scope });
      expect(scope.device).not.toBeUndefined();
    });

    it('should set default values to newly created object', function() {
      $state.params.editingDeviceId = 'new';
      devicesStateDataObject.selectedDeviceId = 100;
      DeviceCtrl = $controller('DeviceCtrl', { $scope: scope });
      expect(scope.device.ports).toBe(24);
      expect(scope.device.my_port).toBe(1);
      expect(scope.device.parent_id).toBe(100);
    });

    it('should call data.createDevice', function() {
      $state.params.editingDeviceId = 'new';
      DeviceCtrl = $controller('DeviceCtrl', { $scope: scope });
      scope.saveDevice();
      expect(data.createDevice).toHaveBeenCalled();
    });

  });

  describe('edit device', function() {
    
    it('should create shalow copy of editing device', function() {
      data.setFixtures({
        devices: [{
          id: 1,
          name: 'val'
        }]
      });
      $state.params.editingDeviceId = '1';
      DeviceCtrl = $controller('DeviceCtrl', { $scope: scope });
      expect(scope.device).not.toBe(data.getDevice(1));
      expect(scope.device.name).toBe('val');
    });

    it('should call updateDevice', function() {
      data.setFixtures({
        devices: [{
          id: 1
        }]
      });
      $state.params.editingDeviceId = '1';
      DeviceCtrl = $controller('DeviceCtrl', { $scope: scope });
      scope.saveDevice();
      expect(data.updateDevice).toHaveBeenCalled();      
    });

  });

  describe('delete device', function() {
    
    it('should call deleteDevice', function() {
      data.setFixtures({
        devices: [{
          id: 1
        }]
      });
      $state.params.editingDeviceId = '1';
      DeviceCtrl = $controller('DeviceCtrl', { $scope: scope });
      scope.deleteDevice();
      expect(data.deleteDevice).toHaveBeenCalled();   
    });

  });

  describe('waiting for server', function() {

    it('should wait for server when creating new device', function() {
      $state.params.editingDeviceId = 'new';
      DeviceCtrl = $controller('DeviceCtrl', { $scope: scope });
      scope.saveDevice();
      expect(scope.waitingForServer).toBe(true);
      expect($state.go).not.toHaveBeenCalled();
      data.flush();
      expect(scope.waitingForServer).toBe(false);
      expect($state.go).toHaveBeenCalled();
    });

    it('should NOT wait for server when editing device', function() {
      data.setFixtures({
        devices: [{
          id: 1
        }]
      });
      $state.params.editingDeviceId = '1';
      DeviceCtrl = $controller('DeviceCtrl', { $scope: scope });
      scope.saveDevice();
      expect(scope.waitingForServer).toBe(false);
      expect($state.go).toHaveBeenCalled();
    });

    it('should NOT wait for server when deleting device', function() {
      data.setFixtures({
        devices: [{
          id: 1
        }]
      });
      $state.params.editingDeviceId = '1';
      DeviceCtrl = $controller('DeviceCtrl', { $scope: scope });
      scope.deleteDevice();
      expect(scope.waitingForServer).toBe(false);
      expect($state.go).toHaveBeenCalled();
    });

  });

  describe('deletable flag', function() {

    it('should set deletable flag FALSE when creating new device', function() {
      $state.params.editingDeviceId = 'new';
      DeviceCtrl = $controller('DeviceCtrl', { $scope: scope });
      expect(scope.deletable).toBe(false);
    });
    
    it('should set deletable flag TRUE if device has no child devices nor end points', function() {
      data.setFixtures({
        devices: [{
          id: 1
        }]
      });
      $state.params.editingDeviceId = '1';
      DeviceCtrl = $controller('DeviceCtrl', { $scope: scope });
      expect(scope.deletable).toBe(true);
    });

    it('should set deletable flag FALSE if device has one or more children devices', function() {
      data.setFixtures({
        devices: [{
          id: 1
        }, {
          id: 2,
          parent_id: 1
        }]
      });
      $state.params.editingDeviceId = '1';
      DeviceCtrl = $controller('DeviceCtrl', { $scope: scope });
      expect(scope.deletable).toBe(false);      
    });

    it('should set deletable flag FALSE if device has one or more end points', function() {
      data.setFixtures({
        devices: [{
          id: 1
        }],
        endPoints: [{
          id: 2,
          device_id: 1
        }]
      });
      $state.params.editingDeviceId = '1';
      DeviceCtrl = $controller('DeviceCtrl', { $scope: scope });
      expect(scope.deletable).toBe(false);      
    });

  });

  it('should go back to selected device', function() {
    devicesStateDataObject.selectedDeviceId = 1;
    DeviceCtrl = $controller('DeviceCtrl', { $scope: scope });
    scope.goBack();
    expect($state.go).toHaveBeenCalledWith('devices.show.device', {deviceId: 1});
  });

});
