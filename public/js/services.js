// public/js/services.js

angular.module('services', ['ngResource'])

.factory('Question', function($resource) {
  return $resource('api/questions/:id', {id: '@id'});
})

.factory('Article', function($resource) {
  return $resource('api/articles');
})

.factory('socket', function (socketFactory) {
  return socketFactory();
});
