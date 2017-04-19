var app = angular.module("myApp");

app.controller("homeController", function($scope, $http, $resource, $route) {
  $scope.main = "Home"

  var info=$resource('/api/userfeed');

  info.query(function(result){
    $scope.feed = result;
  })

  $scope.add_record = function(record) {
    $http({
      url: '/addrecord',
      method: 'post',
      data: record
    }).then(function(data) {
      if(data.data.success) {
        $scope.newrecord = {}
        alert("success")
      }
      else {
        alert("Failed")
      }
    }, function(err){});
  }
})
