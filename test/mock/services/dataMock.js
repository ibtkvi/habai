mock.services.DataMock = function() {
  module(function($provide) {
    $provide.factory('data', function($q, $rootScope) {

      var dataReadyDefer = $q.defer(),
          dataReadyDeferResolved = false,
          actionDoneDefer = $q.defer(),
          
          FIXTURES = {
            devices: [],
            endPoints: [],
            customers: []
          };

      function getElementById(arr, id) {
        if(!id) return null;
        for (var i = arr.length - 1; i >= 0; i--) {
          if(arr[i].id === id) return arr[i];
        }
        return null;
      }

      return {

        whenReady: function () {
          return dataReadyDefer.promise;
        },

        flush: function() {
          $rootScope.$apply(function() {
            if(!dataReadyDeferResolved) {            
              dataReadyDeferResolved = true;
              dataReadyDefer.resolve();
            } else {
              actionDoneDefer.resolve();
            }
          });
        },

        getDevice: function(id) {
          return getElementById(FIXTURES.devices, id);
        },

        getEndPoint: function(id) {
          return getElementById(FIXTURES.endPoints, id);
        },

        getCustomer: function(id) {
          return getElementById(FIXTURES.customers, id);
        },

        getAllDevices: function() {
          return FIXTURES.devices;
        },

        getAllEndPoints: function() {
          return FIXTURES.endPoints;
        },

        getAllCustomers: function() {
          return FIXTURES.customers;
        },

        createDevice: jasmine.createSpy().andReturn(actionDoneDefer.promise),

        createEndPoint: jasmine.createSpy().andReturn(actionDoneDefer.promise),

        updateDevice: jasmine.createSpy().andReturn(actionDoneDefer.promise),

        updateEndPoint: jasmine.createSpy().andReturn(actionDoneDefer.promise),

        deleteDevice: jasmine.createSpy().andReturn(actionDoneDefer.promise),

        deleteEndPoint: jasmine.createSpy().andReturn(actionDoneDefer.promise),

        setFixtures: function(fixtures) {
          angular.extend(FIXTURES, fixtures);
        }

      };

    });
  });
};