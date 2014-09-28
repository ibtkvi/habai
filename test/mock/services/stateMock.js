mock.services.StateMock = function() {
  module(function($provide) {

    $provide.factory('$state', function() {

      var dataObjects = {};

      return {
        go: jasmine.createSpy(),
        get: function(state) {
          if(!dataObjects[state]) dataObjects[state] = { data: {} };
          return dataObjects[state];
        },
        params: {}
      };
      
    });

  });
};
