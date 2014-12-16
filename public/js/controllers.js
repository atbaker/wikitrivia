// public/js/controllers.js

angular.module('controllers', [])

.controller('HomeCtrl', function($scope, Question) {
  $scope.foo = 'bar';
  $scope.questions = Question.query();
})

.controller('HostCtrl', function($scope, $rootScope, socket, $state, questions) {
  $rootScope.questions = questions;
  $rootScope.questionIndex = 0;
  $rootScope.currentQuestion = $rootScope.questions[0];

  $scope.nextQuestion = function() {
    if ($rootScope.questionIndex === $rootScope.questions.length - 1) {
      $state.go('host.final');
    } else {
      $rootScope.questionIndex++;
      $rootScope.currentQuestion = $rootScope.questions[$rootScope.questionIndex];

      // Reset the answerSubmitted and choiceSubmitted flags
      for (var client in $scope.clients) {
        $scope.clients[client].answerSubmitted = false;
        $scope.clients[client].choiceSubmitted = false;
      }

      $state.go('host.question.submit', {questionId: $rootScope.currentQuestion._id, questionIndex: $rootScope.questionIndex});
    }
  };

  socket.emit('register', 'host');

  socket.on('clientUpdate', function(data) {
    $scope.clients = data;
  });

  socket.on('results', function(results) {
    $scope.answers = results.answers;
    $scope.clients = results.players;
  });
})

.controller('HostLobbyCtrl', function($scope) {

})

.controller('HostQuestionCtrl', function($scope, $rootScope) {
  $scope.question = $rootScope.currentQuestion;
})

.controller('HostQuestionSubmitCtrl', function($scope, $rootScope, socket) {
  $scope.question = $rootScope.currentQuestion;

  socket.on('answerSubmitted', function(clientId) {
    $scope.clients[clientId].answerSubmitted = true;
  });
})

.controller('HostQuestionChooseCtrl', function($scope, socket) {
  socket.on('choices', function(choices) {
    $scope.choices = choices;
  });

  socket.on('choiceSubmitted', function(clientId) {
    $scope.clients[clientId].choiceSubmitted = true;
  });
})

.controller('HostQuestionReviewCtrl', function($scope, $rootScope, socket) {

})

.controller('HostFinalCtrl', function($scope) {
  var scoreboard = [];
  for (var client in $scope.clients) {
    scoreboard.push($scope.clients[client]);
  }
  scoreboard.sort(function(a, b) {
    if (a.score > b.score) {
      return -1;
    }
    if (a.score < b.score) {
      return 1;
    }
    return 0;
  });
  $scope.scoreboard = scoreboard;
})

.controller('ClientCtrl', function($state, socket) {
  $state.questionCounter = 0;
  socket.emit('register', 'client');

  socket.on('question.submit', function(message) {
    $state.questionCounter++;
    $state.go('client.question.submit', {id: message});
  });

  socket.on('question.choose', function(data) {
    $state.go('client.question.choose', {id: data.id, choices: data.choices});
  });

  socket.on('question.review', function(message) {
    $state.go('client.question.review', {id: message});
  });

  socket.on('final', function() {
    $state.go('client.final');
  });
})

.controller('ClientLobbyCtrl', function($scope, socket) {
  $scope.setName = function(name) {
    socket.emit('setName', name);
  };
})

.controller('ClientQuestionCtrl', function($scope) {
})

.controller('ClientQuestionSubmitCtrl', function($scope, socket) {
  $scope.submitAnswer = function(answer) {
    socket.emit('submitAnswer', answer);
  };
})

.controller('ClientQuestionChooseCtrl', function($scope, $stateParams, socket) {
  $scope.choices = $stateParams.choices;

  $scope.submitChoice = function(choice) {
    socket.emit('submitChoice', choice);
  };
});
