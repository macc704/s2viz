'use strict';

var gTypeDim;

angular.module('s2vizApp')
    .controller('Dc1Ctrl', function($scope) {
        // var links = [{
        //     authorTo: 'A',
        //     authorFrom: 'B',
        //     type: 'buildson',            
        //     date: "01/07/2013",
        // }, {
        //     authorTo: 'A',
        //     authorFrom: 'B',
        //     type: 'buildson',                        
        //     date: "02/07/2013",
        // }, {
        //     authorTo: 'A',
        //     authorFrom: 'B',
        //     type: 'read',                        
        //     date: "03/07/2013",
        // }, {
        //     authorTo: 'A',
        //     authorFrom: 'B',
        //     type: 'read',                                    
        //     date: "04/07/2013",
        // }, {
        //     authorTo: 'B',
        //     authorFrom: 'C',
        //     type: 'buildson',                                    
        //     date: "05/07/2013",
        // }];

        d3.json('/csv/la-week-read-buildon.json', function(err, data) {
            if (err) {
                console.log('err');
                console.log(err);
            }
            //console.log(data);
            var links = data;
            var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%SZ").parse;
            links.forEach(function(d) {
                var date = d.when;
                d.date = parseDate(date);
                d.total = 1;
                if (d.type === 'READ') {
                    d.read = 1;
                } else {
                    d.read = 0;
                }
                if (d.type === 'BUILDON') {
                    d.buildson = 1;
                } else {
                    d.buildson = 0;
                }
            });

            //dataからcrossfilterのインスタンスを作成
            var ndx = crossfilter(links);

            //line chart

            //X軸をtimelineにするためdateのdimensionを作成
            var dateDim = ndx.dimension(function(d) {
                return d.date;
            });

            var minDate = dateDim.bottom(1)[0].date;
            var maxDate = dateDim.top(1)[0].date;

            var type_read = dateDim.group().reduceSum(function(d) {
                return d.read;
            });
            var type_buildson = dateDim.group().reduceSum(function(d) {
                return d.buildson;
            });
            var hitslineChart = dc.lineChart("#chart-line-hitsperday");
            hitslineChart
                .width(700).height(200)
                .dimension(dateDim)
                .group(type_read, "Read")
                .stack(type_buildson, "Buildson")
                .renderArea(true)
                .x(d3.time.scale().domain([minDate, maxDate]))
                .legend(dc.legend().x(50).y(10).itemHeight(13).gap(5))
                .yAxisLabel("Hits per day");

            //pie chart
            var typeDim = ndx.dimension(function(d) {
                return d.type;
            });
            gTypeDim = typeDim;

            var type_total = typeDim.group().reduceSum(function(d) {
                return d.total;
            });
            var typeRingChart = dc.pieChart("#chart-ring-year");
            typeRingChart
                .width(200).height(200)
                .dimension(typeDim)
                .group(type_total)
                .innerRadius(30);

            $scope.updateChord = function() {
                $scope.master = []; // MASTER DATA STORED BY YEAR
//                console.log('updateChord');
                var filtered = typeDim.filter('READ').top(Infinity);
//                links.forEach(function(d) {
                filtered.forEach(function(d) {
                    d.importer1 = d.from;
                    d.importer2 = d.to;
                    d.flow1 = 0.1;
                    d.flow2 = 1;

                    $scope.master.push(d);
                })
                $scope.drawChords($scope.master);
                //});
            };
            //$scope.updateChord();

            var hits = dateDim.group().reduceSum(function(d) {
                //console.log('x');
                return d.total;
            });

            var x = dc.pieChart("#x");
            x
                .width(200).height(200)
                .dimension(dateDim)
                .group(hits)
                .innerRadius(30);
            x.doRedraw = function() {
                $scope.updateChord();
                gUpdateChord();
            };
            x.doRender = function() {
                $scope.updateChord();
                gUpdateChord();                
            };

            dc.renderAll();
        });
    });