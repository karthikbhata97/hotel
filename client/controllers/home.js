var app = angular.module("myApp");

app.controller('homeController', function($scope, $http) {
  $scope.main = "Home"
  $scope.add_record = function(record) {
    $http({
      url: '/addrecord',
      method: 'post',
      data: record
    }).then(function(data) {
      if(data.data.success) {
        alert("success")
      }
      else {
        alert("Failed")
      }
    }, function(err){});
  }
})
