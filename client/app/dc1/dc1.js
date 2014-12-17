'use strict';

angular.module('s2vizApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('dc1', {
        url: '/dc1',
        templateUrl: 'app/dc1/dc1.html',
        controller: 'Dc1Ctrl'
      });
  });