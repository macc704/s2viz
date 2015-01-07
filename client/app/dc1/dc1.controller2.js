'use strict';

var gUpdateChord;
angular.module('s2vizApp')
    .controller('Dc1Ctrl2', function($scope) {

        gUpdateChord = function() {
            $scope.master = []; // MASTER DATA STORED BY YEAR
            var filtered = gTypeDim.filter('READ').top(Infinity);
            filtered.forEach(function(d) {
                d.importer1 = d.from;
                d.importer2 = d.to;
                d.flow1 = 1;
                d.flow2 = 0.1;

                $scope.master.push(d);
            })
            $scope.drawChords($scope.master);
        };
    });