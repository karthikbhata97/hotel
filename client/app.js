var app = angular.module("myApp", ['ngRoute']);

app.config(function($routeProvider) {
  $routeProvider
  .when('/login', {
    templateUrl: '/views/login.html',
    controller: 'loginController'
  })
  .when('/home', {
    templateUrl: '/views/home.html',
    controller: 'homeController'
  })
  .otherwise({
    redirectTo: '/login'
  })
})


app.controller('mainController', function($scope) {
  $scope.main = "Inhouse project!";
})
