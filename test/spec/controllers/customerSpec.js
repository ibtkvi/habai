'use strict';

describe('Controller: CustomerCtrl', function () {

  var CustomerCtrl, $controller, scope, $state, data, devicesStateDataObject;

  beforeEach(module('habaiApp'));

  beforeEach(function() {
    mock.services.DataMock();
    mock.services.StateMock();
  });
  
  beforeEach(inject(function (_$controller_, $rootScope, _$state_, _data_) {
    $controller = _$controller_;
    $state = _$state_;
    data = _data_;
    scope = $rootScope.$new();
    devicesStateDataObject = $state.get('devices').data;
  }));

  beforeEach(function() {
    data.setFixtures({
      devices: [{
        id: 1
      }],
      endPoints: [{
        id: 2,
        device_id: 1,
        customer_id: 3
      }],
      customers: [{
        id: 3
      }]
    });
    data.flush();
  });

  it('should redirect to the first device of selected customer', function() {
    $state.params.customerId = '3';
    CustomerCtrl = $controller('CustomerCtrl', { $scope: scope });
    expect($state.go).toHaveBeenCalledWith('^.show.device', {deviceId: 1});
  });

  it('should set selectedCustomerId when redirecting', function() {
    $state.params.customerId = '3';
    CustomerCtrl = $controller('CustomerCtrl', { $scope: scope });
    expect(devicesStateDataObject.selectedCustomerId).toBe(3);
  });

  it('should redirect to root device if customer has no end points', function() {
    $state.params.customerId = '99';
    CustomerCtrl = $controller('CustomerCtrl', { $scope: scope });
    expect($state.go).toHaveBeenCalledWith('^.show.device', {deviceId: 'root'});
  });

});
