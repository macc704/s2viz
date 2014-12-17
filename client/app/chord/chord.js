'use strict';

angular.module('s2vizApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('chord', {
        url: '/chord',
        templateUrl: 'app/chord/chord.html',
        controller: 'ChordCtrl'
      });
  });