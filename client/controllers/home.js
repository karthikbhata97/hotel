var app = angular.module("myApp");


app.controller("homeController", function($scope, $http, $resource, $route,$window) {

    $scope.currentbooking = {}


    // var $scope.user_feed = {}
    var hotel_list = $resource('/gethotels');
    hotel_list.query(function(result){
      $scope.hotel_feed = result[0].data;
    })

    var restaurant = $resource('/getrestaurant');
    restaurant.query(function(result){
      $scope.restaurant_feed = result[0].data;
    })

    var user_feed = $resource('/userfeed?username='+$window.localStorage["user"]);
    user_feed.query(function(result){
      $scope.user_hotel_feed = result[0].hotel;

      $scope.user_restaurant_feed = result[0].restaurant;

    //   alert(JSON.stringify($scope.user_restaurant_feed));
    //    $scope.user_feed.restaurant = result[0].restaurant;
    })

    $scope.get_menu = function(data) {
      $http({
        url: '/foodfeed?rid='+ data.rid,
        method: 'get'
      }).then(function(data) {
        if(data.data[0].success) {
          $scope.menu = data.data[0].data;
        }
        else {
          alert("Failed to fetch details");
        }
      }, function(err){});
    }

    $scope.get_rooms = function(data) {
      data.checkin.setTime(data.checkin.getTime() - new Date().getTimezoneOffset()*60*1000);
       data.checkout.setTime(data.checkout.getTime() - new Date().getTimezoneOffset()*60*1000);
       alert(JSON.stringify(data));
      $scope.currentbooking = data;
      if(data.checkout<data.checkin){

      }
      $http({
            url: '/gethotelrooms',
            method: 'post',
            data:data
          }).then(function(data) {
            if(data.data.success) {
              $scope.rooms = data.data.data;
            }
            else {
              alert("Failed to fetch details");
            }
          }, function(err){});
      }

    $scope.book_restaurant = function(data){
      data.username = $window.localStorage["user"];
      data.bookdate = new Date();
      alert(data.username);
      alert(JSON.stringify(data));
      $http({
        url: '/bookrestaurant',
        method: 'post',
        data:data
      }).then(function(data) {
        if(data.data.success) {
          alert("booked successfully");
        }
        else {

          alert(JSON.stringify(data.data));
        }
      }, function(err){});
    }

    $scope.book_room = function(data){
      data.username = $window.localStorage["user"];
      data.checkin = $scope.currentbooking.checkin;
      data.checkout = $scope.currentbooking.checkout;



      alert(data.username);
      alert(JSON.stringify(data));
      $http({
        url: '/bookroom',
        method: 'post',
        data:data
      }).then(function(data) {
        if(data.data.success) {
          alert("booked successfully");
            $scope.get_rooms($scope.currentbooking);
                }
        else {
          alert(data.data.message);
        }
      }, function(err){});
    }

        $scope.addfood = function(food){
            // console.log("here");
          food.username = $window.localStorage["user"];
        //   alert(food.username);
        //   alert(JSON.stringify(food));
          $http({
            url: '/addfood',
            method: 'post',
            data:food
          }).then(function(data) {
            if(data.data.success) {
              alert("food item added successfully");
            }
            else {
              alert(data.data.message);
            }
          }, function(err){});
        }

        $scope.addrooms = function(rooms){
            // console.log("here");
          rooms.username = $window.localStorage["user"];
        //   alert(food.username);
          alert(JSON.stringify(rooms));
          $http({
            url: '/addhotelrooms',
            method: 'post',
            data:rooms
          }).then(function(data) {
            if(data.data.success) {
              alert("room added successfully");
            }
            else {
              alert(data.data.message);
            }
          }, function(err){});
        }

        $scope.changepassword = function(changepass) {
            changepass.username = $window.localStorage["user"];
          $http({
            url: '/changepassword',
            method: 'post',
            data: changepass
          }).then(function(data) {
            if(data.data.success) {
              alert("PASSWORD CHANGES SUCCESSFULLY");
              $scope.newrecord = {}
            }
            else {
              alert("FAILED TO CHANGE PASSWORD")
            }
          }, function(err){});
        }

        $scope.cancellationfood = function(item)
        {
            if(item.bookdate>new Date())
            {
                alert("CANNOT CANCEL ORDER");
                return;
            }
            alert(JSON.stringify(item));

          $http({
            url: '/cancelfood',
            method: 'post',
            data: item
          }).then(function(data) {
            if(data.data.success) {
              alert("ORDER CANCELLED SUCCESSFULLY");
              window.reload();
            }
            else {
              alert("FAILED TO CANCEL ORDER")
            }
          }, function(err){});
        }


        $scope.cancellationroom = function(item)
        {
            // alert(new Date() + new Date(item.checkin) )
            if(new Date()>new Date(item.checkin))
            {
                alert("CANNOT PROCESS CANCELLATION BEYOND CHECK-IN DATE");
                return;
            }
            // else if(new Date()>=new Date(item.checkin)) {
            //     alert("CANNOT PROCESS CANCELLATION BEYOND CHECKIN DATE");
            //     return;
            // }
            // alert(JSON.stringify(item));
          $http({
            url: '/cancelroom',
            method: 'post',
            data: item
          }).then(function(data) {
            if(data.data.success) {
              alert("BOOKING CANCELLED SUCCESSFULLY");
              window.reload();
            }
            else {
              alert(data.data.message);
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
