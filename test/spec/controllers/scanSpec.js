'use strict';

describe('Controller: ScanCtrl', function () {

  var ScanCtrl, scope, $httpBackend;
  
  beforeEach(module('habaiApp'));

  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_) {
    $httpBackend = _$httpBackend_;
    scope = $rootScope.$new();
    ScanCtrl = $controller('ScanCtrl', {
      $scope: scope
    });
  }));

  describe('initialization', function() {

    it('should requests customers list and status of its ip', function() {
      $httpBackend.expect('GET', '/customers').respond([{
        id: 1,
        ip: [{ip: '1.1.1.1'}, {ip: '1.1.1.2'}]
      }]);

      $httpBackend.expect('POST', '/router/api', {
        ping: ['1.1.1.1', '1.1.1.2']
      }).respond({});

      scope.$apply(function() {
        scope.initialize();
      });

      $httpBackend.flush();
      $httpBackend.verifyNoOutstandingExpectation();
    });

    it('should set flags', function() {
      expect(scope.initialized).toBe(false);
      expect(scope.initializing).toBe(false);

      $httpBackend.when('GET', '/customers').respond([]);
      $httpBackend.when('POST', '/router/api').respond({});

      scope.$apply(function() {
        scope.initialize();
      });

      expect(scope.initialized).toBe(false);
      expect(scope.initializing).toBe(true);

      $httpBackend.flush();

      expect(scope.initialized).toBe(true);
      expect(scope.initializing).toBe(false);
    });

  });

  describe('scanning', function() {
    
    it('should resolve diff on scan', function() {
      $httpBackend.expect('GET', '/customers').respond([
        {id: 1, ip: [{ip:'1.1.1.1'},{ip:'1.1.1.2'}]},
        {id: 2, ip: [{ip:'2.2.2.1'},{ip:'2.2.2.2'}]}
      ]);
      $httpBackend.expect('POST', '/router/api').respond(
        {'1.1.1.1': '', '1.1.1.2': '', '2.2.2.1': '', '2.2.2.2': ''}
      );

      scope.$apply(function() {
        scope.initialize();
      });
      $httpBackend.flush(2);

      $httpBackend.expect('POST', '/router/api').respond(
        {'1.1.1.1': '', '1.1.1.2': '', '2.2.2.1': '', '2.2.2.2': 'aa:bb:cc:dd:ee:ff'}
      );

      scope.$apply(function() {
        scope.scan();
      });
      $httpBackend.flush();

      expect(scope.diff.length).toBe(1);
      expect(scope.diff[0].customer.id).toBe(2);
      expect(scope.diff[0].ip).toEqual([{ip: '2.2.2.2', status: 'ok'}]);
    });

    it('should set flags', function() {
      $httpBackend.when('GET', '/customers').respond([
        {id: 1, ip: [{ip:'1.1.1.1'}]}
      ]);
      $httpBackend.when('POST', '/router/api').respond({});
      scope.$apply(function() {
        scope.initialize();
      });
      $httpBackend.flush();

      scope.$apply(function() {
        scope.scan();
      });
      expect(scope.scanning).toBe(true);
      expect(scope.firstScanComplete).toBe(false);
      
      $httpBackend.flush();
      expect(scope.scanning).toBe(false);
      expect(scope.firstScanComplete).toBe(true);
    });
    
  });

});
