/**
 * Created by wangsheng on 1/6/14.
 */

var weaver = {
    weave: function (type, input /* in the future also various kinds of options */) {
        switch (type) {
            case "basicLineLinear":
                this.weaveBasicLineLinear(input);
                break;
        }

    },
    weaveBasicLineLinear: function (input) {
        var dataAnalyst = new BasicLineLinearDataAnalyst(input);
        var dar = dataAnalyst.analyze(); //data analyze result.

        var legend = new Legend(input.series, input.legend);
        legend.analyze();

        var layout = new BasicLineLayout(input.mainTitle, input.subTitle, input.yAxisTitle,
            input.xAxisTitle, legend);

        var xLeftPadding = xRightPadding = 10;
        var lar = layout.analyze(); //layout analyze result.

        var xAxis = new X_LinearAxis(lar.xAxisLength - xLeftPadding - xRightPadding, dar.minX, dar.maxX, lar.originPosition, xLeftPadding, xRightPadding);
        var yAxis = new Y_LinearAxis(lar.yAxisLength, dar.minY, dar.maxY, lar.originPosition, xAxis);

        var xDrawInfo = xAxis.analyze(); //drawing information related to X axis.
        var yDrawInfo = yAxis.analyze();

        var d = new BasicLineData(input, xDrawInfo, yDrawInfo);

        layout.draw();
        xAxis.draw();
        yAxis.draw();
        d.draw();
    }
};