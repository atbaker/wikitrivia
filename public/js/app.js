angular.module('wikitriviaApp', [
  'btford.socket-io',
  'routes',
  'controllers',
  'services',
])

.run(function ($rootScope, $state, $stateParams) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
});
