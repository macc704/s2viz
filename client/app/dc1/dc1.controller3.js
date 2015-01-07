'use strict';

angular.module('s2vizApp')
    .controller('Dc1Ctrl3', function($scope) {

        d3.json('/csv/la-week-tfidf.json', function(err, data) {

            var links = data;
            var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%SZ").parse;
            links.forEach(function(d) {
                var date = d.when;
                d.date = parseDate(date);
                d.total = 100;
                d.http_200 = 1;
            });

            $scope.master = []; // MASTER DATA STORED BY YEAR

            links.forEach(function(d) {
                if (d.weight > 0) {
                    d.importer1 = d.from;
                    d.importer2 = d.to;
                    d.flow1 = d.weight;
                    d.flow2 = d.weight;

                    $scope.master.push(d);
                }
            })
            $scope.drawChords($scope.master);
            dc.renderAll();
        });
    });