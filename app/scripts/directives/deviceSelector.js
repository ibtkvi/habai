'use strict';

angular.module('habaiApp')
  .directive('deviceSelector', [function () {
    return {
      restrict: 'A',
      scope: {
        id: '=deviceSelector'
      },
      controller: 'DeviceSelectorCtrl',
      templateUrl: 'views/deviceSelector.html'
    };
  }]);
