var socket = io.connect();
var app = angular.module('app', []);
app.controller('app', controller);
app.set('view options', { pretty: true });

function controller($scope) {
  console.log('Angular controller initialized');
  $scope.loadData = function() {
    socket.emit('data');
  };
  socket.on('data', function(data){
    console.log(data);
    $scope.data = data;
    $scope.$apply();
  });
}
