'use strict';

angular.module('habaiApp')
  .factory('status', ['$http', 'data', function ($http, data) {
    
    var cache = {};

    function test(id, update) {
      data.whenReady().then(function() {
        doTest(id, update);
      });
    }

    function doTest(id, update) {

      var ips = [];

      (function(id) {
        while(id) {
          var device = data.getDevice(id);
          if(device.ip) { ips.push(device.ip); }
          id = device.parent_id;
        }
      })(id);

      data.getAllDevices().forEach(function(device) {
        if(device.parent_id === id) {
          if(device.ip) { ips.push(device.ip); }
        }
      });

      data.getAllEndPoints().forEach(function(endPoint) {
        if(endPoint.device_id === id) {
          if(endPoint.customer_id) {
            data.getCustomer(endPoint.customer_id).ip.forEach(function(ip) {
              ips.push(ip.ip);
            });
          }
        }
      });

      ips = ips.filter(function(ip) {
        return cache[ip] !== 'inprog';
      });

      if(!update) {
        ips = ips.filter(function(ip) {
          return (cache[ip] !== 'ok' && cache[ip] !== 'fail');
        });
      }

      if(!ips.length) return;

      ips.forEach(function(ip) {
        cache[ip] = 'inprog';
      });

      $http.post('/router/api', {ping: ips}).then(function(result) {
        ips.forEach(function(ip) {
          cache[ip] = result.data[ip] ? 'ok' : 'fail';
        });
      });

    }
    
    return {

      update: function (id) {
        test(id, true);
      },

      ensure: function(id) {
        test(id, false);
      },

      data: cache

    };
      
  }]);
