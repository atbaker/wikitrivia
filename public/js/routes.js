// public/js/routes.js

angular.module('routes', ['ui.router'])

.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'views/home.html',
      controller: 'HomeCtrl',
      data: {
        pageTitle: 'Home'
      }
    })

    // setup an abstract state for the tabs directive
    .state('game', {
      url: '/game',
      abstract: true,
      template: '<ui-view/>',
      controller: 'GameCtrl'
    })

    .state('game.lobby', {
      url: '/lobby',
      templateUrl: 'views/lobby.html',
      controller: 'LobbyCtrl',
      data: {
        pageTitle: 'Lobby'
      }
    });
  
  $urlRouterProvider.otherwise('/');
  $locationProvider.html5Mode(true);
});
