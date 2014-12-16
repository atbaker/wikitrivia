// public/js/routes.js

angular.module('routes', ['ui.router'])

.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'views/home.html',
      controller: 'HomeCtrl'
    })

    .state('host', {
      url: '/host',
      abstract: true,
      template: '<ui-view/>',
      controller: 'HostCtrl',
      resolve: {
        questions: function(Question) {
          return Question.query().$promise;
        }
      }
    })

    .state('host.lobby', {
      url: '/lobby',
      templateUrl: 'views/host/lobby.html',
      controller: 'HostLobbyCtrl'
    })

    .state('host.question', {
      url: '/question',
      abstract: true,
      template: '<ui-view/>',
      controller: 'HostQuestionCtrl'
    })

    .state('host.question.submit', {
      url: '/submit',
      templateUrl: 'views/host/question-submit.html',
      controller: 'HostQuestionSubmitCtrl',
      onEnter: function($rootScope, socket) {
        socket.emit('question.submit', {questionId: $rootScope.currentQuestion._id, questionIndex: $rootScope.questionIndex});
      }
    })

    .state('host.question.choose', {
      url: '/choose',
      templateUrl: 'views/host/question-choose.html',
      controller: 'HostQuestionChooseCtrl',
      onEnter: function($rootScope, socket) {
        socket.emit('question.choose', $rootScope.currentQuestion._id);
      }
    })

    .state('host.question.review', {
      url: '/review',
      templateUrl: 'views/host/question-review.html',
      controller: 'HostQuestionReviewCtrl',
      onEnter: function($rootScope, socket) {
        socket.emit('question.review', $rootScope.currentQuestion._id);
      }
    })

    .state('host.final', {
      url: '/final',
      templateUrl: 'views/host/final.html',
      controller: 'HostFinalCtrl',
      onEnter: function(socket) {
        socket.emit('final');
      }
    })

    .state('client', {
      url: '/client',
      abstract: true,
      template: '<ui-view/>',
      controller: 'ClientCtrl'
    })

    .state('client.lobby', {
      url: '/lobby',
      templateUrl: 'views/client/lobby.html',
      controller: 'ClientLobbyCtrl'
    })

    .state('client.question', {
      url: '/question',
      abstract: true,
      template: '<ui-view/>',
      controller: 'ClientQuestionCtrl'
    })

    .state('client.question.submit', {
      url: '/submit',
      templateUrl: 'views/client/question-submit.html',
      controller: 'ClientQuestionSubmitCtrl'
    })

    .state('client.question.choose', {
      url: '/choose',
      templateUrl: 'views/client/question-choose.html',
      controller: 'ClientQuestionChooseCtrl',
      params: {
        choices: {}
      }
    })

    .state('client.question.review', {
      url: '/review',
      templateUrl: 'views/client/question-review.html',
    })

    .state('client.final', {
      url: '/final',
      templateUrl: 'views/client/final.html',
    });
  
  $urlRouterProvider.otherwise('/');
  $locationProvider.html5Mode(true);
});
