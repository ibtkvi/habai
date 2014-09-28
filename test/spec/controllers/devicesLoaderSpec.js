'use strict';

describe('Controller: DevicesLoaderCtrl', function () {

  var DevicesLoaderCtrl, scope, data;
  
  beforeEach(module('habaiApp'));

  beforeEach(function() {
    mock.services.DataMock();
  });

  beforeEach(inject(function ($controller, $rootScope, _data_) {
    data = _data_;
    scope = $rootScope.$new();
    DevicesLoaderCtrl = $controller('DevicesLoaderCtrl', {
      $scope: scope
    });
  }));

  it('should set dataReady flag when data ready', function () {
    expect(scope.dataReady).toBe(false);
    data.flush();
    expect(scope.dataReady).toBe(true);
  });

});
