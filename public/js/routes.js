// public/js/routes.js

angular.module('routes', ['ui.router'])

.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: 'views/home.html',
      controller: 'HomeCtrl',
      data: {
        pageTitle: 'Home'
      }
    });
  
  $urlRouterProvider.otherwise('/');
  $locationProvider.html5Mode(true);
});
