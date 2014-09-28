'use strict';

angular.module('habaiApp')
  .controller('ScanCtrl', ['$scope', '$resource', '$http', '$q', function ($scope, $resource, $http, $q) {

    var customers, results = {};

    $scope.diff = undefined;

    $scope.initializing = false;
    $scope.initialized = false;
    $scope.scanning = false;
    $scope.firstScanComplete = false;

    $scope.initialize = function() {
      $scope.initializing = true;
      $resource('/customers').query().$promise.then(function(result) {
        customers = result;
        scan().then(function() {
          $scope.initializing = false;
          $scope.initialized = true;
        });
      });
    };

    $scope.scan = function() {
      $scope.scanning = true;
      scan().then(function() {
        diff();
        $scope.scanning = false;
        $scope.firstScanComplete = true;
      });
    };
    
    function scan() {
      
      var ips = [];
      customers.forEach(function(customer) {
        if(customer.ip) {
          customer.ip.forEach(function(ip) {
            ips.push(ip.ip);
          });
        }
      });
      
      if(!ips.length) return $q.when(true);

      return $http.post('/router/api', {ping: ips}).then(function(result) {
        ips.forEach(function(ip) {
          var status = result.data[ip] ? 'ok' : 'fail';
          results[ip] = {
            status: status,
            wasChanged: (results[ip] ? status !== results[ip].status : false)
          };
        });
      });
    }

    function diff() {
      $scope.diff = [];
      customers.forEach(function(customer) {
        var ips = [];
        if(customer.ip) {
          customer.ip.forEach(function(ip) {
            if(results[ip.ip].wasChanged) {
              ips.push({ip: ip.ip, status: results[ip.ip].status});
            }
          });
        }
        if(ips.length) {
          $scope.diff.push({
            customer: customer,
            ip: ips
          });
        }
      })
    }

  }]);
