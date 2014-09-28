'use strict';

describe('Controller: DevicesCtrl', function () {

  var $controller, ctrl, scope, data, status, $state;

  beforeEach(module('habaiApp'));

  beforeEach(function() {
    mock.services.DataMock();
    mock.services.StatusMock();
    mock.services.StateMock();
  });

  beforeEach(inject(function (_$controller_, $rootScope, _data_, _status_, _$state_) {
    $controller = _$controller_;
    data = _data_;
    status = _status_;
    $state = _$state_;

    scope = $rootScope.$new();
    data.flush();  
  }));

  describe('ancestors', function() {

    it('should resolve ancestors of root device on childrenUpdated event', function() {
      $state.params.deviceId = 'root';
      ctrl = $controller('DevicesCtrl', { $scope: scope });
      expect(scope.ancestors[0].root).toBe(true);
    });

    it('should resolve ancestors of device on childrenUpdated event', function() {
      data.setFixtures({
        devices: [{
          id: 100, 
          parent_id: null
        }, {
          id: 110, 
          parent_id: 100
        }, {
          id: 112, 
          parent_id: 110
        }]
      });
      $state.params.deviceId = '112';
      ctrl = $controller('DevicesCtrl', { $scope: scope });
      expect(scope.ancestors.length).toBe(4);
      expect(scope.ancestors[0].root).toBe(true);
      expect(scope.ancestors[1].device.id).toBe(100);
      expect(scope.ancestors[2].device.id).toBe(110);
      expect(scope.ancestors[3].device.id).toBe(112);
    });

  });

  describe('status', function() {

    beforeEach(function() {
      data.setFixtures({
        devices: [{
          id: 1
        }]
      });
    });

    it('should call status.ensure on childrenUpdated event', function() {
      $state.params.deviceId = '1';
      ctrl = $controller('DevicesCtrl', { $scope: scope });
      expect(status.ensure).toHaveBeenCalledWith(1);
    });

    it('should call status.ensure on dataUpdated event', function() {
      $state.params.deviceId = '1';
      ctrl = $controller('DevicesCtrl', { $scope: scope });
      status.ensure.reset();
      scope.$broadcast('dataUpdated');
      expect(status.ensure).toHaveBeenCalledWith(1);
    });

    it('should call status.update with current device id', function() {
      $state.params.deviceId = '1';
      ctrl = $controller('DevicesCtrl', { $scope: scope });
      scope.updateStatus();
      expect(status.update).toHaveBeenCalledWith(1);
    });

    it('should provide access to status.data as $scope.status', function() {
      ctrl = $controller('DevicesCtrl', { $scope: scope });
      expect(scope.status).toBe(status.data);
    });

  });

  describe('direction', function() {

    it('should resolve change direction for animation', function() {

      ctrl = $controller('DevicesCtrl', { $scope: scope });
      var state = {};
      data.setFixtures({
        devices: [
          {id: 100, parent_id: null},
            {id: 110, parent_id: 100},
            {id: 120, parent_id: 100},
              {id: 121, parent_id: 120},
          {id: 200, parent_id: null}
        ]
      });

      [{to: '100', from: '200', direction: ''},
      {to: '200', from: '100', direction: ''},
      {to: 'root', from: '110', direction: ''},
      {to: '110', from: 'root', direction: ''},
      {to: '200', from: 'root', direction: 'forward'},
      {to: 'root', from: '200', direction: 'backward'},
      {to: '121', from: '120', direction: 'forward'},
      {to: '120', from: '121', direction: 'backward'}]
      .forEach(function(testCase) {
        scope.$broadcast('$stateChangeSuccess', state, {deviceId: testCase.to}, state, {deviceId: testCase.from});
        expect(scope.direction).toBe(testCase.direction);
      });

    });

  });

});
