'use strict';

describe('Controller: DeviceSelectorCtrl', function () {

  var DeviceSelectorCtrl, scope, $rootScope, data;

  beforeEach(module('habaiApp'));

  beforeEach(function() {
    mock.services.DataMock();
  });

  beforeEach(inject(function ($controller, _$rootScope_, _data_) {
    $rootScope = _$rootScope_;
    data = _data_;
    scope = $rootScope.$new();
    DeviceSelectorCtrl = $controller('DeviceSelectorCtrl', {
      $scope: scope
    });
    data.flush();
  }));

  it('should resolve ancestors/children on scope.id change', function() {
    data.setFixtures({
      devices: [
        {id: 100, parent_id: null},
          {id: 110, parent_id: 100},
            {id: 111, parent_id: 110},
            {id: 112, parent_id: 110},
        {id: 200, parent_id: null}
      ]
    });
    scope.$apply(function() {
      scope.id = 110;
    });

    expect(scope.ancestors.length).toBe(3);
    expect(scope.ancestors[0].root).toBe(true);
    expect(scope.ancestors[1].device.id).toBe(100);
    expect(scope.ancestors[2].device.id).toBe(110);

    expect(scope.children.length).toBe(2);
    expect(scope.children[0].device.id).toBe(111);
    expect(scope.children[1].device.id).toBe(112);
  });

  it('should set device selected', function() {
    data.setFixtures({
      devices: [{
        id: 1
      }]
    })
    scope.$apply(function() {
      scope.select(1);
    });
    expect(scope.id).toBe(1);
  });

});
