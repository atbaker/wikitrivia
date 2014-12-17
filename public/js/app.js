angular.module('wikitriviaApp', [
  'btford.socket-io',
  'routes',
  'controllers',
  'services',
])

.filter('playerName', function ($rootScope) {
  return function (socketId, clients) {
    return clients[socketId].name;
  };
})

.run(function ($rootScope, $state, $stateParams) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
});
