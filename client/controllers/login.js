var app = angular.module("myApp");

app.controller('loginController', function($scope, $location, $http) {
  $scope.main = "Login";
  $scope.username = "";
  $scope.password = "";
  $scope.access = 0;
  $scope.login = function() {
    $http({
      url: '/login',
      method: 'post',
      data: {
        "username": $scope.username,
        "password": $scope.password
      }
    }).then(function(data) {
      if(data.data.success) {
        if(data.data.admin)
        $location.path('/admin');
        else if(data.data.type=="hotel")
        $location.path('/hotel');
        else if(data.data.type=="restaurant")
        $location.path('/restaurant');
        else if(data.data.type=="user")
        $location.path('/user');
      }
      else {
        alert(data.data.message);
      }
    }, function(err){})
  }

  $scope.signup = function(data1) {
    $http({
      url: '/signup',
      method: 'post',
      data: data1
    }).then(function(data) {
      alert(data.data.message)
      if(data.data.success) {
        $location.path('/login');
      }

    }, function(err){})
  }
$scope.registrationdata = {}
$scope.registrationdata.type = "hotel"
  $scope.register = function(registrationdata){
    $http({
      url: '/signup',
      method: 'post',
      data: registrationdata
    }).then(function(data) {
      alert(data.data.message)
      if(data.data.success) {
        alert("REGISTRATION SUCCESSFULL");
        $location.path('/register');
      }
      else {
        alert("REGISTRATION FAILED");
      }

    }, function(err){})
  }




})
