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
      url: '/question/:id',
      abstract: true,
      template: '<ui-view/>',
      controller: 'HostQuestionCtrl',
      resolve: {
        question: function($stateParams, $rootScope) {
          return $rootScope.questions[$stateParams.id];
        }
      }
    })

    .state('host.question.submit', {
      url: '/submit',
      templateUrl: 'views/host/question-submit.html',
      controller: 'HostQuestionSubmitCtrl',
      onEnter: function($rootScope, socket){
        socket.emit('question.submit', $rootScope.nextQuestion);
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
      url: '/question/:id',
      abstract: true,
      template: '<ui-view/>',
      controller: 'ClientQuestionCtrl',
      resolve: {
        questionId: function($stateParams) {
          return $stateParams.id;
        }
      }
    })

    .state('client.question.submit', {
      url: '/submit',
      templateUrl: 'views/client/question-submit.html',
      controller: 'ClientQuestionSubmitCtrl'
    });
  
  $urlRouterProvider.otherwise('/');
  $locationProvider.html5Mode(true);
});
