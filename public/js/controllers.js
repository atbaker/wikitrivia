// public/js/controllers.js

angular.module('controllers', [])

.controller('HomeCtrl', function($scope, $state) {
  $scope.joinSession = function(sessionNumber) {
    $state.go('client.lobby', {sessionNumber: sessionNumber});
  };
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

  socket.emit('register', {client: 'host'});

  socket.on('sessionNumber', function(sessionNumber) {
    $rootScope.sessionNumber = sessionNumber;
  });

  socket.on('clientUpdate', function(data) {
    $scope.clients = data;
  });

  socket.on('results', function(results) {
    $scope.clients = results.players;

    var getNames = function(socketIds, players) {
      var names = [];
      for (var i=0; i<socketIds.length; i++) {
        names.push(players[socketIds[i]].name);
      }
      return names;
    };
    
    $scope.goodLies = [];
    $scope.badLies = [];
    for (var answerText in results.answers) {
      var answer = results.answers[answerText];

      // Clean up the answer data a little
      answer.text = answerText;
      answer.submitters = getNames(answer.submitters, results.players);
      answer.choosers = getNames(answer.choosers, results.players);

      if (!answer.truth) {
        if (answer.choosers.length > 0) {
          // Someone picked this lie - it's a good one
          $scope.goodLies.push(answer);
        } else {
          $scope.badLies.push(answer);
        }
      } else {
        $scope.truth = answer;
        console.log($scope.truth.choosers);
        console.log($scope.truth.submitters);
      }
    }
  });
})

.controller('HostLobbyCtrl', function($scope) {

})

.controller('HostQuestionCtrl', function($scope, $rootScope) {
  $scope.question = $rootScope.currentQuestion;

  $rootScope.$watch('currentQuestion', function() {
    $scope.question = $rootScope.currentQuestion;
  });
})

.controller('HostQuestionSubmitCtrl', function($scope, $rootScope, socket) {
  socket.on('answerSubmitted', function(clientId) {
    $scope.clients[clientId].answerSubmitted = true;
  });
})

.controller('HostQuestionChooseCtrl', function($scope, $rootScope, socket) {
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

.controller('ClientCtrl', function($scope, $state, socket) {
  $scope.submitted = false;

  socket.on('question.submit', function(questionCounter) {
    $state.go('client.question.submit', {questionCounter: questionCounter});
  });

  socket.on('question.choose', function(data) {
    $state.go('client.question.choose', {questionCounter: data.currentQuestion, choices: data.choices});
  });

  socket.on('question.review', function(questionCounter) {
    $state.go('client.question.review', {questionCounter: questionCounter});
  });

  socket.on('final', function() {
    $state.go('client.final');
  });
})

.controller('ClientLobbyCtrl', function($scope, $stateParams, socket) {
  socket.emit('register', {client: 'client', sessionNumber: $stateParams.sessionNumber});

  $scope.setName = function(name) {
    $scope.submitted = true;
    socket.emit('setName', name);
  };
})

.controller('ClientQuestionCtrl', function($scope, $stateParams) {
  $scope.questionCounter = $stateParams.questionCounter + 1;
})

.controller('ClientQuestionSubmitCtrl', function($scope, socket) {
  $scope.submitAnswer = function(answer) {
    $scope.submitted = true;
    socket.emit('submitAnswer', answer);
  };
})

.controller('ClientQuestionChooseCtrl', function($scope, $stateParams, socket) {
  $scope.choices = $stateParams.choices;

  $scope.submitChoice = function(choice) {
    $scope.submitted = true;
    socket.emit('submitChoice', choice);
  };
});
