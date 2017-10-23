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
        else
        $location.path('/home');
      }

      else {
        alert(data.data.message);
      }
    }, function(err){})
  }

  $scope.signup = function() {
    $http({
      url: '/signup',
      method: 'post',
      data: {
        "username": $scope.username,
        "password": $scope.password
      }
    }).then(function(data) {
      alert(data.data.message)
      if(data.data.success) {
        $location.path('/login');
      }

    }, function(err){})
  }
})
