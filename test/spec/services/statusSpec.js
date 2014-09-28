'use strict';

describe('Service: status', function () {

  var status, $httpBackend, data, $rootScope;
  
  beforeEach(module('habaiApp'));

  beforeEach(function() {
    mock.services.DataMock();
  });

  beforeEach(inject(function (_status_, _$httpBackend_, _data_, _$rootScope_) {

    status = _status_;
    data = _data_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;

    data.setFixtures({
      devices: [
        {id: 100, parent_id: null, ip: '1.1.1.1'},
          {id: 110, parent_id: 100, ip: '1.1.1.2'},
        {id: 200, parent_id: null, ip: '2.2.2.2'}
      ],
      endPoints: [
        {id: 1, device_id: 110, customer_id: 1},
        {id: 2, device_id: 200, customer_id: 2}
      ],
      customers: [
        {id: 1, ip: [{ip: '3.3.3.1'},{ip: '3.3.3.2'}]},
        {id: 2, ip: [{ip: '4.4.4.1'},{ip: '4.4.4.2'}]}
      ]
    });

    data.flush();

  }));

  describe('first request', function() {
      
    beforeEach(function() {
      $httpBackend.expect('POST', '/router/api', {
        ping: ["1.1.1.2", "1.1.1.1", "3.3.3.1", "3.3.3.2"]
      }).respond({});
    });
    
    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
    });

    it('on update: should request all ip', function() {
      $rootScope.$apply(function() {
        status.update(110);
      });
    });

    it('on ensure: should request all ip', function() {
      $rootScope.$apply(function() {
        status.ensure(110);
      });
    });

  });

  describe('request while another request in progress', function() {
    
    beforeEach(function() {
      $httpBackend.expect('POST', '/router/api').respond({});
      $rootScope.$apply(function() {
        status.ensure(100);
      });
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
    });

    it('on update: should not duplicate request', function() {
      $rootScope.$apply(function() {
        status.update(100);
      });
    });

    it('on ensure: should not duplicate request', function() {
      $rootScope.$apply(function() {
        status.ensure(100);
      });
    });

    it('on update: should request ip that was not previously requested', function() {
      $httpBackend.expect('POST', '/router/api', {
        ping: ["3.3.3.1", "3.3.3.2"]
      }).respond({});
      $rootScope.$apply(function() {
        status.update(110);
      });
    });

    it('on ensure: should request ip that was not previously requested', function() {
      $httpBackend.expect('POST', '/router/api', {
        ping: ["3.3.3.1", "3.3.3.2"]
      }).respond({});
      $rootScope.$apply(function() {
        status.ensure(110);
      });
    });

  });

  describe('next requests', function() {
    
    beforeEach(function() {
      $httpBackend.expect('POST', '/router/api').respond({});
      $rootScope.$apply(function() {
        status.ensure(100);
      });
      $httpBackend.flush();
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
    });

    it('on update: should request ip again if previous request was completed', function() {
      $httpBackend.expect('POST', '/router/api', {
        ping: ["1.1.1.1", "1.1.1.2"]
      }).respond({});
      $rootScope.$apply(function() {
        status.update(100);
      });
    });

    it('on ensure: should NOT request ip again', function() {
      $rootScope.$apply(function() {
        status.ensure(100);
      });
    });

    it('on update: should request all ip again', function() {
      $httpBackend.expect('POST', '/router/api', {
        ping: ["1.1.1.2", "1.1.1.1", "3.3.3.1", "3.3.3.2"]
      }).respond({});
      $rootScope.$apply(function() {
        status.update(110);
      });
    });

    it('on ensure: should request ip that never requested before', function() {
      $httpBackend.expect('POST', '/router/api', {
        ping: ["3.3.3.1", "3.3.3.2"]
      }).respond({});
      $rootScope.$apply(function() {
        status.ensure(110);
      });
    });

  });

  describe('status.data', function() {

    it('should set status', function() {
      $httpBackend.expect('POST', '/router/api', {
        ping: ["1.1.1.1", "1.1.1.2"]
      }).respond({"1.1.1.1": "aa:bb:cc:dd:ee:ff", "1.1.1.2": ""});
      $rootScope.$apply(function() {
        status.update(100);
      });

      expect(status.data['1.1.1.1']).toBe('inprog');
      expect(status.data['1.1.1.2']).toBe('inprog');
      $httpBackend.flush();
      expect(status.data['1.1.1.1']).toBe('ok');
      expect(status.data['1.1.1.2']).toBe('fail');
    });

  });

});
