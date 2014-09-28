'use strict';

angular.module('habaiApp', ['ngAnimate', 'ngResource', 'ui.router', 'mg.class'])

	.config(['$httpProvider', function($httpProvider) {

		$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

		$httpProvider.defaults.xsrfCookieName = 'xsrf-token';
		$httpProvider.defaults.xsrfHeaderName = 'X-Xsrf-Token';
		
		$httpProvider.interceptors.push(['$q', function($q) {
			return {
				'responseError': function(rejection) {
					if(rejection.status === 401) {
						window.location = rejection.headers('location');
					}
					return $q.reject(rejection);
				}
			};
		}]);
		
	}])

	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise('/devices/root');

		$stateProvider

		.state('devices', {
			abstract: true,
			data: {
				lastUsedCustomerId: null,
				selectedCustomerId: null,
				selectedDeviceId: null
			},
			controller: 'DevicesLoaderCtrl',
			templateUrl: 'views/dataLoader.html'
		})
		
			.state('devices.show', {
				abstract: true,
				url: '/devices',
				controller: 'DevicesCtrl',
				templateUrl: 'views/devices.html'
			})

				.state('devices.show.device', {
					url: '/:deviceId',
					controller: 'ChildrenCtrl',
					templateUrl: 'views/children.html'
				})

			.state('devices.customer', {
				url: '/customer/:customerId',
				controller: 'CustomerCtrl'
			})

			.state('devices.editDevice', {
				url: '/device/:editingDeviceId',
				controller: 'DeviceCtrl',
				templateUrl: 'views/editDevice.html'
			})

			.state('devices.editEndPoint', {
				url: '/end_point/:editingEndPointId',
				controller: 'EndPointCtrl',
				templateUrl: 'views/editEndPoint.html'
			})

		.state('scan', {
			url: '/scan',
			templateUrl: 'views/scan.html',
			controller: 'ScanCtrl'
		})

	}]);
