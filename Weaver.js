/**
 * Created by wangsheng on 1/6/14.
 */

var weaver = {
    weave: function (type, input /* in the future also various kinds of options */, container) {
        var subContainers = this.createSVGandDivContainer(container);
        var svg = subContainers.svg;
        var div = subContainers.div;

        colors.initLinearGradients(svg);//this draws a <defs> containing all those linear gradients that can be used by others.

        switch (type) {
            case "basicLineLinear":
                this.weaveBasicLineLinear(input, svg, div);
                break;
            case "basicCategory":
                this.weaveBasicCategory(input, svg, div);
                break;
            case "basicTime":
                this.weaveBasicTime(input, svg, div);
                break;
            case "stackTime":
                this.weaveStackTime(input, svg, div);
                break;

        }
    },

    createSVGandDivContainer: function(container){
        container.setAttribute("class", "mc-container");
        var bcr = container.getBoundingClientRect();
        var width = bcr.width;
        var height = bcr.height;

        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttributeNS(null, "width", width.toString());
        svg.setAttributeNS(null, "height", height.toString());

        var div = document.createElement("div");
        div.setAttribute("class", "mc-div-draw-layer");

        container.appendChild(svg);
        container.appendChild(div);

        return {
            svg: svg,
            div: div
        }
    },

    weaveBasicLineLinear: function (input, svg, htmlContainer) {
        var legend = new Legend(svg, input.series, input.legend/*this is really legendPosition*/);
        legend.analyze();

        var layout = new GeneralLayout(svg, input.mainTitle, input.subTitle, input.yAxisTitle,
            input.xAxisTitle, legend);

        var xLeftPadding = 10;
        var xRightPadding = 10;
        var lar = layout.analyze(); //layout analyze result.
        var xAxisDataAreaLength = lar.xAxisLength - xLeftPadding - xRightPadding;

        var dar = new BasicLineLinearDataAnalyst(input, xAxisDataAreaLength).analyze(); //data analyze result.

        var xAxis = new X_LinearAxis(svg, xAxisDataAreaLength, dar.minX, dar.maxX, lar.originPosition, xLeftPadding, xRightPadding);
        var yAxis = new Y_LinearAxis(svg, lar.yAxisLength, dar.minY, dar.maxY, lar.originPosition, xAxis);

        var xDrawInfo = xAxis.analyze(); //drawing information related to X axis.
        var yDrawInfo = yAxis.analyze();

        var dataViewer = new BasicLineLinearDataViewer(htmlContainer, svg, input, xDrawInfo, yDrawInfo, dar.isContinual);

        layout.draw();
        xAxis.draw();
        yAxis.draw();
        dataViewer.draw();
    },

    weaveBasicCategory: function(input, svg){
        var legend = new Legend(svg, input.series, input.legend/*this is really legendPosition*/, "rectangular");
        legend.analyze();

        var layout = new GeneralLayout(svg, input.mainTitle, input.subTitle, input.yAxisTitle,
            input.xAxisTitle, legend);

        var lar = layout.analyze(); //layout analyze result.
        var dar = new BasicCategoryDataAnalyst(input).analyze();

        //because leftPadding and rightPadding are both 0 therefore xAxisDataAreaLength is equal to lar.xAxisLength.
        var xAxis = new X_CategoryAxis(svg, lar.xAxisLength, lar.originPosition, dar.seriesNames);
        var yAxis = new Y_LinearAxis(svg, lar.yAxisLength, dar.minY, dar.maxY, lar.originPosition, xAxis);

        var xDrawInfo = xAxis.analyze();
        var yDrawInfo = yAxis.analyze();

        var d = new BasicCategoryDataViewer(svg, input.series, xDrawInfo, yDrawInfo);

        layout.draw();
        xAxis.draw();
        yAxis.draw();
        d.draw();
    },

    weaveBasicTime: function(input, svg){
        var legend = new Legend(svg, input.series, input.legend/*this is really legendPosition*/, "rectangular");
        legend.analyze();

        var layout = new GeneralLayout(svg, input.mainTitle, input.subTitle, input.yAxisTitle,
            input.xAxisTitle, legend);

        var lar = layout.analyze(); //layout analyze result.

        var dar = new BasicTimeDataAnalyst(input, lar.xAxisLength).analyze();

        var xAxis = new TimeAxis(svg, lar.xAxisLength, dar.maxX, lar.originPosition, input.unit);
        var yAxis = new Y_LinearAxis(svg, lar.yAxisLength, dar.minY, dar.maxY, lar.originPosition, xAxis);

        var xDrawInfo = xAxis.analyze();
        var yDrawInfo = yAxis.analyze();

        var d = new BasicSingleTimeData(svg, input.series, xDrawInfo, yDrawInfo, input.unit);

        layout.draw();
        xAxis.draw();
        yAxis.draw();
        d.draw();
    },

    weaveStackTime: function(input, svg){
        var legend = new Legend(svg, input.series, input.legend/*this is really legendPosition*/);
        legend.analyze();


    }
};