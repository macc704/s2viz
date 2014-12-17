'use strict';

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

        d3.json('/assets/la-week-read.json', function(err, data) {
            //console.log(data);
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
                d.http_302 = 1;
                d.http_404 = 1;
                //d.total = d.http_404 + d.http_200 + d.http_302;
                //d.Year = d.date.getFullYear(); //yearの属性を追加
            });

            //dataからcrossfilterのインスタンスを作成
            var ndx = crossfilter(links);
            //X軸をtimelineにするためdateのdimensionを作成
            var dateDim = ndx.dimension(function(d) {
                return d.date;
            });
            //Y軸にtotalを表示するためのkey-valueデータをdateDimから作成
            var hits = dateDim.group().reduceSum(function(d) {
                return d.total;
            });

            var minDate = dateDim.bottom(1)[0].date;
            var maxDate = dateDim.top(1)[0].date;

            var hitslineChart = dc.lineChart("#chart-line-hitsperday");
            hitslineChart
                .width(450).height(200)
                .dimension(dateDim)
                .group(hits)
                .x(d3.time.scale().domain([minDate, maxDate]));

            //pie

            //パイチャートのdimensionを作成
            var yearDim = ndx.dimension(function(d) {
                return d.type;
            });
            //パイチャートののkey-valueデータをyearDimから作成
            var year_total = yearDim.group().reduceSum(function(d) {
                return d.total;
            });
            var yearRingChart = dc.pieChart("#chart-ring-year");
            yearRingChart
                .width(200).height(200)
                .dimension(yearDim)
                .group(year_total)
                .innerRadius(30);

            //bar

            //Y軸にtotalを表示するためのkey-valueデータをhttpステータス毎に作成
            var status_200 = dateDim.group().reduceSum(function(d) {
                return d.http_200;
            });
            var status_302 = dateDim.group().reduceSum(function(d) {
                return d.http_302;
            });
            var status_404 = dateDim.group().reduceSum(function(d) {
                return d.http_404;
            });

            hitslineChart
                .width(450).height(200)
                .dimension(dateDim)
                .group(status_200, "200")
                .stack(status_302, "302")
                .stack(status_404, "404")
                .renderArea(true)
                .x(d3.time.scale().domain([minDate, maxDate]))
                .legend(dc.legend().x(50).y(10).itemHeight(13).gap(5))
                .yAxisLabel("Hits per day");

            $scope.master = []; // MASTER DATA STORED BY YEAR
            d3.csv('/assets/trade.csv', function(err, data2) {

                links.forEach(function(d) {
                    d.importer1 = d.from;
                    d.importer2 = d.to;
                    d.value = 1;

                    $scope.master.push(d);
                })
                $scope.drawChords($scope.master);
            });

            dc.renderAll();
        });
    });