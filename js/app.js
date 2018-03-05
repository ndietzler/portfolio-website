'use strict';

angular.module('CoffeeApp', ['ngSanitize', 'ui.router', 'ui.bootstrap']) //ngSanitize for HTML displaying
.config(function($stateProvider, $urlRouterProvider){ //configure states
	$stateProvider.state('home', {
		url: '/',
		templateUrl: 'partials/home.html'
	})
	.state('orders', {
		url: '/orders',
		templateUrl: 'partials/order.html',
		controller: 'OrderCtrl'
	})
	.state('cart', {
		url: '/orders/cart',
		templateUrl: 'partials/cart.html',
		controller: 'CartCtrl'
	})
	.state('bean', {
		url: '/orders/{id}',
		templateUrl: 'partials/bean.html',
		controller: 'BeanCtrl'
	})
	$urlRouterProvider.otherwise('/');
})

.controller('OrderCtrl', ['$scope', '$http', '$uibModal', function($scope, $http, $uibModal) {

	$http.get('data/products.json').then(function (response) {
 		$scope.products = response.data;
 	});

}])

.controller('BeanCtrl', ['$scope', '$http', '$stateParams', '$filter', 'cart', function($scope, $http, $stateParams, $filter, cart) {

	$http.get('data/products.json').then(function (response) {
 		$scope.selectedBean = $filter('filter')(response.data, {
 			id: $stateParams.id 
 		}, true)[0];
 	});

 	$scope.saveCart = function(selectedBean) {
 		cart.saveCart(selectedBean);
 		cart.addToStorage(selectedBean);
 	};

}])

.controller('CartCtrl', ['$scope', '$http', 'cart', '$uibModal', function($scope, $http, cart, $uibModal) {

	$scope.addToCart = cart.addToCart;

	$scope.calculateTotal = function() {
		var totalPrice = 0.0;
		for (var i = 0; i < $scope.addToCart.length; i++) {
			totalPrice += $scope.addToCart[i].quantity * $scope.addToCart[i].price;
		}
		return totalPrice;
	}

	$scope.increase = function(selectedBean) {
		if (selectedBean.quantity >= 1 && selectedBean.quantity < 10) {
			selectedBean.quantity++;
		}
		cart.addToStorage();
	}

	$scope.decrease = function(selectedBean) {
		if (selectedBean.quantity > 1 && selectedBean.quantity <= 10) {
			selectedBean.quantity--;
		}
		cart.addToStorage();
	}

	$scope.delete = function(selectedBean) {
		$scope.addToCart.splice($scope.addToCart.indexOf(selectedBean), 1);
		cart.addToStorage();
	}

	$scope.submit = function() {
		var modalInstance = $uibModal.open({
			templateUrl: 'partials/modal.html'
		});
		$scope.addToCart.length = 0;
		cart.addToStorage();
	}

}])

.factory('cart', function(){
	var service = {};
	service.addToCart = [];
	if (localStorage.getItem("storedCart")) {
		service.addToCart = JSON.parse(localStorage.getItem("storedCart"));
	}
	service.saveCart = function(selectedBean){
		service.addToCart.push(selectedBean);
		service.addToStorage();
	};
	service.addToStorage = function() {
		localStorage.setItem("storedCart", angular.toJson(service.addToCart));
	}
	return service; 
})






