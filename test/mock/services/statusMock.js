mock.services.StatusMock = function() {
  module(function($provide) {
    $provide.factory('status', function($q) {

      return {
        ensure: jasmine.createSpy(),
        update: jasmine.createSpy(),
        data: {}
      };
      
    });
  });
};
