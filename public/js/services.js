// public/js/services.js

angular.module('services', ['ngResource'])

.factory('Question', function($resource) {
  return $resource('api/questions/:id', {id: '@id'}, {
  });
});
