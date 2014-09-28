'use strict';

describe('Service: data', function () {

  var data, $httpBackend, $rootScope;
  
  beforeEach(module('habaiApp'));

  beforeEach(inject(function (_data_, _$httpBackend_, _$rootScope_) {
    data = _data_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
  }));

  describe('data preload', function() {

    beforeEach(function() {
      $httpBackend.expect('GET', '/devices').respond([]);
      $httpBackend.expect('GET', '/end_points').respond([]);
      $httpBackend.expect('GET', '/customers').respond([]);
    });

    it('should preload data on init', function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.flush(3);
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should resolve promise when all 3 requests complete', function() {
      var resolved = false;
      data.whenReady().then(function() {
        resolved = true;
      });
      expect(resolved).toBe(false);
      $httpBackend.flush(2);
      expect(resolved).toBe(false);
      $httpBackend.flush(1);
      expect(resolved).toBe(true);
    });

  });

  describe('device CUD', function() {

    beforeEach(function() {
      $httpBackend.when('GET', '/devices').respond([{id: 1}]);
      $httpBackend.when('GET', '/end_points').respond([]);
      $httpBackend.when('GET', '/customers').respond([]);
      $httpBackend.flush();
    });

    it('should send POST on create', function() {
      $httpBackend.expect('POST', '/devices').respond({id: 2});
      $rootScope.$apply(function() {
        data.createDevice({});
      });
      $httpBackend.verifyNoOutstandingExpectation();
    });

    it('should send PUT on update', function() {
      $httpBackend.expect('PUT', '/devices/1').respond({id: 1});
      var device = data.getDevice(1);
      $rootScope.$apply(function() {
        data.updateDevice(device);
      });
      $httpBackend.verifyNoOutstandingExpectation();
    });

    it('should send DELETE on delete', function() {
      $httpBackend.expect('DELETE', '/devices/1').respond({});
      $rootScope.$apply(function() {
        data.deleteDevice(1);
      });
      $httpBackend.verifyNoOutstandingExpectation();
    });

  });

  describe('end point CUD', function() {

    beforeEach(function() {
      $httpBackend.when('GET', '/devices').respond([]);
      $httpBackend.when('GET', '/end_points').respond([{id: 2}]);
      $httpBackend.when('GET', '/customers').respond([]);
      $httpBackend.flush();
    });
    
    it('should send POST on create', function() {
      $httpBackend.expect('POST', '/end_points').respond({id: 3});
      $rootScope.$apply(function() {
        data.createEndPoint({});
      });
      $httpBackend.verifyNoOutstandingExpectation();
    });

    it('should send PUT on update', function() {
      $httpBackend.expect('PUT', '/end_points/2').respond({id: 2});
      var endPoint = data.getEndPoint(2);
      $rootScope.$apply(function() {
        data.updateEndPoint(endPoint);
      });
      $httpBackend.verifyNoOutstandingExpectation();
    });

    it('should send DELETE on delete', function() {
      $httpBackend.expect('DELETE', '/end_points/2').respond({});
      $rootScope.$apply(function() {
        data.deleteEndPoint(2);
      });
      $httpBackend.verifyNoOutstandingExpectation();
    });

  });

  describe('dataUpdated event', function() {

    var dataUpdatedEventHandler;

    beforeEach(function() {
      $httpBackend.when('GET', '/devices').respond([{id: 1}]);
      $httpBackend.when('GET', '/end_points').respond([]);
      $httpBackend.when('GET', '/customers').respond([]);
      $httpBackend.flush();
      dataUpdatedEventHandler = jasmine.createSpy();
      $rootScope.$on('dataUpdated', dataUpdatedEventHandler);
    });

    it('should broadcast dataUpdated event on create after server acknowledge', function() {
      $httpBackend.when('POST', '/devices').respond({id: 2});
      $rootScope.$apply(function() {
        data.createDevice({});
      });
      expect(dataUpdatedEventHandler).not.toHaveBeenCalled();
      $httpBackend.flush();
      expect(dataUpdatedEventHandler).toHaveBeenCalled();
    });

    it('should broadcast dataUpdated event on update immediately', function() {
      $httpBackend.when('PUT', '/devices/1').respond({id: 1});
      var device = data.getDevice(1);
      $rootScope.$apply(function() {
        data.updateDevice(device);
      });
      expect(dataUpdatedEventHandler).toHaveBeenCalled();
    });

    it('should broadcast dataUpdated event on delete immediately', function() {
      $httpBackend.when('DELETE', '/devices/1').respond({});
      $rootScope.$apply(function() {
        data.deleteDevice(1);
      });
      expect(dataUpdatedEventHandler).toHaveBeenCalled();
    });

  });

  describe('data methods', function() {

    beforeEach(function() {
      $httpBackend.when('GET', '/devices').respond([{id: 1}]);
      $httpBackend.when('GET', '/end_points').respond([{id: 2}]);
      $httpBackend.when('GET', '/customers').respond([{id: 3}]);
      $httpBackend.flush();
    });

    it('should return device by id', function() {
      expect(data.getDevice(1).id).toBe(1);
    });
    
    it('should return end point by id', function() {
      expect(data.getEndPoint(2).id).toBe(2);
    });
    
    it('should return customer by id', function() {
      expect(data.getCustomer(3).id).toBe(3);
    });

    it('should return all devices', function() {
      var array = data.getAllDevices();
      expect(array.length).toBe(1);
      expect(array[0].id).toBe(1);
    });

    it('should return all end points', function() {
      var array = data.getAllEndPoints()
      expect(array.length).toBe(1);
      expect(array[0].id).toBe(2);
    });
    
    it('should return all customers', function() {
      var array = data.getAllCustomers()
      expect(array.length).toBe(1);
      expect(array[0].id).toBe(3);
    });
    
  });

});
