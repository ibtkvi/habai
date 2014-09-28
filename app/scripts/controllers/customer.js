'use strict';

angular.module('habaiApp')
  .controller('CustomerCtrl', ['$scope', '$state', 'data', function ($scope, $state, data) {

    var id = parseInt($state.params.customerId),
        devicesStateDataObject = $state.get('devices').data;

    if(data.getCustomer(id)) {
      devicesStateDataObject.selectedCustomerId = id;
      devicesStateDataObject.lastUsedCustomerId = id;
    }
    
    var endPoint = getFirstEndPoint(id);
    $state.go('^.show.device', {deviceId: endPoint && endPoint.device_id ? endPoint.device_id : 'root'});
    
    function getFirstEndPoint(id) {
      var firstEndPoint = null;
      data.getAllEndPoints().forEach(function(endPoint) {
        if(endPoint.customer_id === id) {
          firstEndPoint = endPoint;
        }
      });
      return firstEndPoint;
    }

  }]);
