var app = angular.module("myApp");


app.controller("homeController", function($scope, $http, $resource, $route) {

    var hotel_list = $resource('/gethotels');
    hotel_list.query(function(result){
      $scope.hotel_feed = result;
    })

    var food = $resource('/foodfeed');
    food.query(function(result){
      $scope.food_feed = result[0].data;

    })

});

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
        alert("Failed")
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
          alert("Failed")
        }
      }, function(err){});
    }




})
