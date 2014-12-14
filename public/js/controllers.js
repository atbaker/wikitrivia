// public/js/controllers.js

angular.module('controllers', [])

.controller('HomeCtrl', function($scope, Question) {
  $scope.foo = 'bar';
  $scope.questions = Question.query();
})

.controller('HostCtrl', function($scope, socket) {
  socket.emit('register', 'host');

  socket.on('clientUpdate', function(data) {
    $scope.clients = data;
  });
})

.controller('HostLobbyCtrl', function($scope) {

})

.controller('ClientCtrl', function(socket) {
  socket.emit('register', 'client');
})

.controller('ClientLobbyCtrl', function($scope, socket) {
  $scope.setName = function(name) {
    socket.emit('setName', name);
  };
});
