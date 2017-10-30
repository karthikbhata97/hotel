var app = angular.module("myApp", ['ngResource', 'ngRoute']);

app.config(function($routeProvider) {
  $routeProvider
  .when('/login', {
    templateUrl: '/views/login.html',
    controller: 'loginController'
  })
  .when('/signup', {
    templateUrl: '/views/signup.html',
    controller: 'loginController'
  })
  .when('/home', {
    templateUrl: '/views/home.html',
    controller: 'homeController'
  })
  .when('/admin', {
    templateUrl: '/views/admin.html',
    controller: 'adminController'
  })
  .when('/register', {
    templateUrl: '/views/register.html',
    controller: 'loginController'
  })
  .when('/hotel', {
    templateUrl: '/views/hotel.html',
    controller: 'homeController'
  })
  .when('/restaurant', {
    templateUrl: '/views/restaurant.html',
    controller: 'homeController'
  })
  .when('/addfood', {
    templateUrl: '/views/addfood.html',
    controller: 'homeController'
  })
  .otherwise({
    redirectTo: '/login'
  })
})


app.controller('mainController', function($scope) {
  $scope.main = "HOTEL MANAGEMENT SYSTEM";
})
