'use strict';

describe('Directive: chosen', function () {

  var element, scope, chosenUpdatedEventHandler, $compile, $timeout;

  beforeEach(module('habaiApp'));

  beforeEach(inject(function ($rootScope, _$compile_, _$timeout_) {
    $compile = _$compile_;
    $timeout = _$timeout_;
    scope = $rootScope.$new();
  }));

  it('should call $.chosen on element', function () {
    $.fn.chosen = jasmine.createSpy();
    element = angular.element('<select chosen="a" ng-model="b"></select>');
    element = $compile(element)(scope);
    expect($.fn.chosen).toHaveBeenCalled();
  });

  describe('chosen:update event', function() {

    var chosenUpdatedEventHandler;
    
    beforeEach(function() {
      element = angular.element('<select chosen="a" ng-model="b"></select>');
      element = $compile(element)(scope);
      chosenUpdatedEventHandler = jasmine.createSpy();
      element.on('chosen:updated', chosenUpdatedEventHandler);
      scope.$digest();
    });

    it('should trigger event when chosen attribute changes', function() {
      scope.$apply(function() {
        scope.a = [];
      });
      expect(chosenUpdatedEventHandler).not.toHaveBeenCalled();
      $timeout.flush();
      expect(chosenUpdatedEventHandler).toHaveBeenCalled();
    });

    it('should trigger event when ng-model attribute changes', function() {
      scope.$apply(function() {
        scope.b = 1;
      });
      expect(chosenUpdatedEventHandler).not.toHaveBeenCalled();
      $timeout.flush();
      expect(chosenUpdatedEventHandler).toHaveBeenCalled();
    });

    it('should trigger event once when both ng-model and chosen attributes change', function() {
      scope.$apply(function() {
        scope.a = [];
        scope.b = 1;
      });
      $timeout.flush();
      expect(chosenUpdatedEventHandler.calls.length).toBe(1);
    });

  });
    
});
