var app = angular.module("myApp");


app.controller("homeController", function($scope, $http, $resource, $route,$window) {

    var hotel_list = $resource('/gethotels');
    hotel_list.query(function(result){
      $scope.hotel_feed = result[0].data;
    })

    var restaurant = $resource('/getrestaurant');
    restaurant.query(function(result){
      $scope.restaurant_feed = result[0].data;

    })

    $scope.get_menu = function(data) {
      // alert(JSON.parse(data))
      $http({
        url: '/foodfeed?rid='+ data.rid,
        method: 'get'
      }).then(function(data) {
        // alert(JSON.stringify(data.data))
        if(data.data[0].success) {
          // alert("success");
          $scope.menu = data.data[0].data;
          // alert($scope.menu)
        }
        else {
          alert("Failed to fetch details");
        }
      }, function(err){});
    }


        $scope.get_rooms = function(data) {
          // alert(JSON.parse(data))
          $http({
            url: '/gethotelrooms?hid='+ data.hid,
            method: 'get'
          }).then(function(data) {
            // alert(JSON.stringify(data.data))
            if(data.data.success) {
              // alert("success");
              $scope.rooms = data.data.data;
              // alert($scope.rooms)
            }
            else {
              alert("Failed to fetch details");
            }
          }, function(err){});
        }

    $scope.book = function(data){
      data.userid = $window.localStorage["user"];
      alert(data.userid);
      $http({
        url: '/bookrestaurant',
        method: 'post',
        data:data
      }).then(function(data) {
        // alert(JSON.stringify(data.data))
        if(data.data.success) {
          // alert("success");
          $scope.menu = data.data[0].data;
          // alert($scope.menu)
        }
        else {
          alert("Failed");
        }
      }, function(err){});
    }

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
