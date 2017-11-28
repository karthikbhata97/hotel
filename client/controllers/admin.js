var app = angular.module("myApp");
app.controller("adminController", function($scope, $http, $resource, $route , $window) {
  $scope.loginname = $window.localStorage["user"].toUpperCase();
  $scope.main = "Home"
  var hotel_list = $resource('/gethotels');
  hotel_list.query(function(result){
    $scope.hotel_feed = result;
  })

  var user_list = $resource('/getuserlist');
  user_list.query(function(result){
    $scope.user_list = result[0].userlist;
  })

$scope.hoteldata = {};
$scope.restdata = {};
  $scope.add_hotel = function(hoteldata) {
    $http({
      url: '/addhotel',
      method: 'post',
      data: hoteldata
    }).then(function(data) {
      if(data.data.success) {
        alert("success");
        location.reload();
        $scope.newrecord = {}
      }
      else {
        alert(data.data.message)
      }
    }, function(err){});
  }


    $scope.add_restaurant = function(restdata) {
      $http({
        url: '/addrestaurant',
        method: 'post',
        data: restdata
      }).then(function(data) {
        if(data.data.success) {
          alert("success");
          location.reload();
          $scope.newrecord = {}
        }
        else {
          alert("data.data.message")
        }
      }, function(err){});
    }

    $scope.manageuser = function(user) {
      user.active = 1 - parseInt(user.active);
      $http({
        url: '/manageuser',
        method: 'post',
        data: user
      }).then(function(data) {
        if(data.data.success) {
          alert("success");
          location.reload();
        }
        else {
          alert("Failed to Update")
        }
      }, function(err){});
    }



})
