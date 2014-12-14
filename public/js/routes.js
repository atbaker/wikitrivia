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

    .state('host', {
      url: '/host',
      abstract: true,
      template: '<ui-view/>',
      controller: 'HostCtrl'
    })

    .state('host.lobby', {
      url: '/lobby',
      templateUrl: 'views/host/lobby.html',
      controller: 'HostLobbyCtrl',
      data: {
        pageTitle: 'Lobby'
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
      controller: 'ClientLobbyCtrl',
      data: {
        pageTitle: 'Lobby'
      }
    });
  
  $urlRouterProvider.otherwise('/');
  $locationProvider.html5Mode(true);
});
