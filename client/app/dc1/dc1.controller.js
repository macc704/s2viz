'use strict';

angular.module('s2vizApp')
    .controller('Dc1Ctrl', function($scope) {
        var data = [{
            date: "12/27/2012",
            http_404: 2,
            http_200: 190,
            http_302: 100
        }, {
            date: "12/28/2012",
            http_404: 2,
            http_200: 10,
            http_302: 100
        }, {
            date: "12/29/2012",
            http_404: 1,
            http_200: 300,
            http_302: 200
        }, {
            date: "12/30/2012",
            http_404: 2,
            http_200: 90,
            http_302: 0
        }, {
            date: "12/31/2012",
            http_404: 20,
            http_200: 90,
            http_302: 0
        }, {
            date: "01/01/2013",
            http_404: 2,
            http_200: 90,
            http_302: 0
        }, {
            date: "01/02/2013",
            http_404: 1,
            http_200: 10,
            http_302: 1
        }, {
            date: "01/03/2013",
            http_404: 2,
            http_200: 90,
            http_302: 0
        }, {
            date: "01/04/2013",
            http_404: 2,
            http_200: 90,
            http_302: 0
        }, {
            date: "01/05/2013",
            http_404: 2,
            http_200: 90,
            http_302: 0
        }, {
            date: "01/06/2013",
            http_404: 2,
            http_200: 200,
            http_302: 1
        }, {
            date: "01/07/2013",
            http_404: 1,
            http_200: 200,
            http_302: 100
        }];

        // var parseDate = d3.time.format("%m/%d/%Y").parse;
        // data.forEach(function(d) {
        //     d.date = parseDate(d.date);
        //     d.total = d.http_404 + d.http_200 + d.http_302;
        // });

        var parseDate = d3.time.format("%m/%d/%Y").parse;
        data.forEach(function(d) {
            d.date = parseDate(d.date);
            d.total = d.http_404 + d.http_200 + d.http_302;
            d.Year = d.date.getFullYear(); //yearの属性を追加
        });

        //dataからcrossfilterのインスタンスを作成
        var ndx = crossfilter(data);
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

        //dcのlineChartインスタンスを作成
        var hitslineChart = dc.lineChart("#chart-line-hitsperday");
        //parameter設定
        hitslineChart
            .width(450).height(200)
            .dimension(dateDim)
            .group(hits)
            .x(d3.time.scale().domain([minDate, maxDate]));


        //pie

        //パイチャートのdimensionを作成
        var yearDim = ndx.dimension(function(d) {
            return +d.Year;
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

        var datatable = dc.dataTable("#dc-data-table");
        datatable
            .dimension(dateDim)
            .group(function(d) {
                return d.Year;
            })
            .columns([
                function(d) {
                    return d.date.getDate() + "/" + (d.date.getMonth() + 1) + "/" + d.date.getFullYear();
                },
                function(d) {
                    return d.http_200;
                },
                function(d) {
                    return d.http_302;
                },
                function(d) {
                    return d.http_404;
                },
                function(d) {
                    return d.total;
                }
            ]);
        //チャートを描画
        dc.renderAll();
    });