// public/js/controllers.js

angular.module('controllers', [])

.controller('HomeCtrl', function($scope, Question) {
  $scope.foo = 'bar';
  $scope.questions = Question.query();
})

.controller('HostCtrl', function($scope, $rootScope, socket, questions) {
  $rootScope.questions = questions;
  $rootScope.nextQuestion = 0;

  socket.emit('register', 'host');

  socket.on('clientUpdate', function(data) {
    $scope.clients = data;
  });
})

.controller('HostLobbyCtrl', function($scope) {

})

.controller('HostQuestionCtrl', function($scope, question) {
  $scope.question = question;
})

.controller('HostQuestionSubmitCtrl', function($scope, socket) {
  socket.on('answerSubmitted', function(clientId) {
    $scope.clients[clientId].answerSubmitted = true;
  });
})

.controller('ClientCtrl', function(socket, $state) {
  socket.emit('register', 'client');

  socket.on('question.submit', function(message) {
    $state.go('client.question.submit', {id: message});
  });
})

.controller('ClientLobbyCtrl', function($scope, socket) {
  $scope.setName = function(name) {
    socket.emit('setName', name);
  };
})

.controller('ClientQuestionCtrl', function($scope, questionId) {
  $scope.questionId = questionId;
})

.controller('ClientQuestionSubmitCtrl', function($scope, socket) {
  $scope.submitAnswer = function(answer) {
    socket.emit('submitAnswer', answer);
  };
});
