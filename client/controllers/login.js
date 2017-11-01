var app = angular.module("myApp");

app.controller('loginController', function($scope,$resource, $location, $http,$window) {
  $scope.main = "Login";
  $scope.username = "";
  $scope.password = "";
  $scope.access = 0;
  var hotel_list = $resource('/gethotels');
  hotel_list.query(function(result){
    $scope.hotel_feed = result[0].data;
  })
  var restaurant = $resource('/getrestaurant');
  restaurant.query(function(result){
    $scope.restaurant_feed = result[0].data;

  })
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
        if(data.data.type=="admin"){
        $location.path('/admin');
        $window.localStorage["user"] = $scope.username;
      }
        else if(data.data.type=="hotel"){
        $location.path('/addroom');
        $window.localStorage["user"] = $scope.username;}
        else if(data.data.type=="restaurant"){
        $location.path('/addfood');
        $window.localStorage["user"] = $scope.username;}
        else if(data.data.type=="user"){
        $location.path('/home');
        $window.localStorage["user"] = $scope.username;}
      }
      else {
        alert(data.data.message);
      }
    }, function(err){})
  }

  $scope.signup = function(data1) {
    data1.type="user";
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
      url: '/register',
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
