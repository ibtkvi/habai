'use strict';

describe('Controller: PortSelectorCtrl', function () {

  var PortSelectorCtrl, scope, data;
  
  beforeEach(module('habaiApp'));

  beforeEach(function() {
    mock.services.DataMock();
  });

  beforeEach(inject(function ($controller, $rootScope, _data_) {
    data = _data_;
    scope = $rootScope.$new();
    PortSelectorCtrl = $controller('PortSelectorCtrl', {
      $scope: scope
    });
    data.flush();
  }));

  it('scope.ports should be equal to ports of device', function() {
    data.setFixtures({
      devices: [{
        id: 1, 
        ports: 10
      }]
    });
    scope.$apply(function() {
      scope.deviceId = 1;
    });
    expect(scope.ports.length).toBe(10);
  });

  it('scope.ports should be equal totalPorts', function() {
    scope.$apply(function() {
      scope.totalPorts = 20;
    });
    expect(scope.ports.length).toBe(20);
  });
    
  it('should set port selected', function() {
    scope.$apply(function() {
      scope.totalPorts = 20;
    });
    scope.$apply(function() {
      scope.select(1);
    });
    expect(scope.id).toBe(1);
    expect(scope.ports[0].selected).toBe(true);
  });

});
