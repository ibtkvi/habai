'use strict';

angular.module('habaiApp')
  .directive('portSelector', [function () {
    return {
      restrict: 'A',
      scope: {
        id: '=portSelector',
        deviceId: '=portSelectorDevice',
        totalPorts: '=portSelectorPorts'
      },
      controller: 'PortSelectorCtrl',
      templateUrl: 'views/portSelector.html'
    };
  }]);
