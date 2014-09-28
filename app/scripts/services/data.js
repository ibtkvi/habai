'use strict';

angular.module('habaiApp')
  .factory('data', ['$resource', '$q', '$rootScope', function ($resource, $q, $rootScope) {

    var Device = $resource('/devices/:id', {id:'@id'}, {update: {method: 'PUT'}}),
        EndPoint = $resource('/end_points/:id', {id:'@id'}, {update: {method: 'PUT'}}),
        Customer = $resource('/customers/:id', {id:'@id'}),

        cache = {
          devices: Device.query(),
          endPoints: EndPoint.query(),
          customers: Customer.query()
        },

        dataReady = $q.all([cache.devices.$promise, cache.endPoints.$promise, cache.customers.$promise]);

    function getElementById(arr, id) {
      if(!id) return null;
      for (var i = arr.length - 1; i >= 0; i--) {
        if(arr[i].id === id) return arr[i];
      }
      return null;
    }

    function create(Resource, array, obj) {
      return Resource.save(obj).$promise.then(function(item) {
        array.push(item);
        $rootScope.$broadcast('dataUpdated');
      });
    }

    function update(array, obj) {
      var promise = obj.$update();
      $rootScope.$broadcast('dataUpdated');
      return promise;
    }

    function deleteElement(arr, id) {
      var obj = getElementById(arr, id);
      var promise = obj.$delete();
      var index = arr.indexOf(obj);
      if (index > -1) {
        arr.splice(index, 1);
      }
      $rootScope.$broadcast('dataUpdated');
      return promise;
    }
    
    return {

      whenReady: function () {
        return dataReady;
      },

      getDevice: function(id) {
        return getElementById(cache.devices, id);
      },

      getEndPoint: function(id) {
        return getElementById(cache.endPoints, id);
      },

      getCustomer: function(id) {
        return getElementById(cache.customers, id);
      },

      getAllDevices: function() {
        return cache.devices;
      },

      getAllEndPoints: function() {
        return cache.endPoints;
      },

      getAllCustomers: function() {
        return cache.customers;
      },

      createDevice: function(obj) {
        return create(Device, cache.devices, obj);
      },

      createEndPoint: function(obj) {
        return create(EndPoint, cache.endPoints, obj);
      },

      updateDevice: function(obj) {
        return update(cache.devices, obj);
      },

      updateEndPoint: function(obj) {
        return update(cache.endPoints, obj);
      },

      deleteDevice: function(id) {
        return deleteElement(cache.devices, id);
      },

      deleteEndPoint: function(id) {
        return deleteElement(cache.endPoints, id);
      }

    };

  }]);
