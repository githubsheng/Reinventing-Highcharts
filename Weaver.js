/**
 * Created by wangsheng on 1/6/14.
 */

var weaver = {
    weave: function (type, input /* in the future also various kinds of options */, svg) {
        switch (type) {
            case "basicLineLinear":
                this.weaveBasicLineLinear(input, svg);
                break;
            case "basicCategory":
                this.weaveBasicCategory(input, svg);
        }

    },
    weaveBasicLineLinear: function (input, svg) {
        var dar = new BasicLineLinearDataAnalyst(input).analyze(); //data analyze result.

        var legend = new Legend(svg, input.series, input.legend);
        legend.analyze();

        var layout = new GeneralLayout(svg, input.mainTitle, input.subTitle, input.yAxisTitle,
            input.xAxisTitle, legend);

        var xLeftPadding = xRightPadding = 10;
        var lar = layout.analyze(); //layout analyze result.

        var xAxis = new X_LinearAxis(svg, lar.xAxisLength - xLeftPadding - xRightPadding, dar.minX, dar.maxX, lar.originPosition, xLeftPadding, xRightPadding);
        var yAxis = new Y_LinearAxis(svg, lar.yAxisLength, dar.minY, dar.maxY, lar.originPosition, xAxis);

        var xDrawInfo = xAxis.analyze(); //drawing information related to X axis.
        var yDrawInfo = yAxis.analyze();

        var d = new BasicLineLinearData(svg, input, xDrawInfo, yDrawInfo);

        layout.draw();
        xAxis.draw();
        yAxis.draw();
        d.draw();
    },

    weaveBasicCategory: function(input, svg){
        var dar = new BasicCategoryDataAnalyst(input).analyze();

        var legend = new Legend(svg, input.series, input.legend);
        legend.analyze("rectangular");

        var layout = new GeneralLayout(svg, input.mainTitle, input.subTitle, input.yAxisTitle,
            input.xAxisTitle, legend);

        var xLeftPadding = xRightPadding = 10;
        var lar = layout.analyze(); //layout analyze result.

        var xAxis = new X_CategoryAxis(svg, lar.xAxisLength - xLeftPadding - xRightPadding, lar.originPosition, dar.seriesNames);
        var yAxis = new Y_LinearAxis(svg, lar.yAxisLength, dar.minY, dar.maxY, lar.originPosition, xAxis);

        var xDrawInfo = xAxis.analyze();
        var yDrawInfo = yAxis.analyze();

        var d = new BasicCategoryData(svg, input.series, xDrawInfo, yDrawInfo);

        layout.draw();
        xAxis.draw();
        yAxis.draw();
        d.draw();
    }
};