'use strict';

angular.module('s2vizApp')
    .controller('Dc1Ctrl2', function($scope) {
 
        d3.json('/csv/la-week-read-buildon.json', function(err, data) {

            var links = data;
            //"2014-12-11T23:07:24Z"
            //            var parseDate = d3.time.format("%m/%d/%Y").parse;
            var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%SZ").parse;
            links.forEach(function(d) {
                //var date = d.when.split('T')[0];
                var date = d.when;
                d.date = parseDate(date);
                //console.log(d.date);
                d.total = 100;
                d.http_200 = 1;
                //d.http_302 = 1;
                //d.http_404 = 1;
                //d.total = d.http_404 + d.http_200 + d.http_302;
                //d.Year = d.date.getFullYear(); //yearの属性を追加
            });

            $scope.master = []; // MASTER DATA STORED BY YEAR
            //d3.csv('/assets/trade.csv', function(err, data2) {

                links.forEach(function(d) {
                    d.importer1 = d.from;
                    d.importer2 = d.to;
                    d.flow1 = 1;
                    d.flow2 = 0.1;                    

                    $scope.master.push(d);
                })
                $scope.drawChords($scope.master);
            //});

            dc.renderAll();
        });
    });