'use strict';

angular.module('habaiApp')
  .directive('chosen', ['$timeout', function ($timeout) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {

        var triggerEventOnNextTick = false;

        element.chosen(options);

        function updateChosen() {
          if(!triggerEventOnNextTick) {
            triggerEventOnNextTick = true;
            $timeout(function() {
              element.trigger('chosen:updated');
              triggerEventOnNextTick = false;
            });
          }
        }

        scope.$watchCollection(attrs.chosen, updateChosen);
        scope.$watch(attrs.ngModel, updateChosen);

        var options = {};
        ['allowSingleDeselect'].forEach(function(option) {
          if(attrs[option]) {
            options[snakeCase(option)] = scope.$eval(attrs[option]);  
          }
        });
        
        function snakeCase(input) {
          return input.replace(/[A-Z]/g, function($1) {
            return "_" + ($1.toLowerCase());
          });
        }

      }
    };
  }]);
