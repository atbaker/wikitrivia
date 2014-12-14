// public/js/controllers.js

angular.module('controllers', [])

.controller('HomeCtrl', function($scope, Question) {
  $scope.foo = 'bar';
  $scope.questions = Question.query();
})

.controller('GameCtrl', function($scope) {

})

.controller('LobbyCtrl', function($scope) {
  $scope.players = ['foo', 'bar'];
});
