var socket = io.connect();
var app = angular.module('app', []);
app.controller('app', controller);

function controller($scope) {
  console.log('Angular controller initialized');
  $scope.loadDc = function() {
    socket.emit('data');
  };
  socket.on('data', function(data){
    $scope.dc = data;
    $scope.$apply();
  });
}
