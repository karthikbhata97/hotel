var app = angular.module("myApp");
app.controller("adminController", function($scope, $http, $resource, $route) {
  $scope.main = "Home"
  var hotel_list = $resource('/gethotels');
  hotel_list.query(function(result){
    $scope.hotel_feed = result;
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
          $scope.newrecord = {}
        }
        else {
          alert("data.data.message")
        }
      }, function(err){});
    }
})
