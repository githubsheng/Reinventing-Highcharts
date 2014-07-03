/**
 * Created by wangsheng on 1/6/14.
 */

var weaver = {
    createSVGandDivContainer: function(container){
        container.setAttribute("class", "mc-container");
        var bcr = container.getBoundingClientRect();
        var width = bcr.width;
        var height = bcr.height;

        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttributeNS(null, "width", width.toString());
        svg.setAttributeNS(null, "height", height.toString());

        var svgTriggerLayer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgTriggerLayer.setAttributeNS(null, "width", width.toString());
        svgTriggerLayer.setAttributeNS(null, "height", height.toString());
        svgTriggerLayer.style.position = "absolute";
        svgTriggerLayer.style.left = "0";
        svgTriggerLayer.style.top = "0";

        var div = document.createElement("div");
        div.setAttribute("class", "mc-div-draw-layer");

        container.appendChild(svg);
        container.appendChild(div); //tip layer should be above the
        container.appendChild(svgTriggerLayer);

        return {
            svg: svg,
            div: div,
            svgTrigger: svgTriggerLayer
        }
    },

    weave: function (type, input /* in the future also various kinds of options */, container) {
        var subContainers = this.createSVGandDivContainer(container);
        var svg = subContainers.svg;
        var div = subContainers.div;
        var svgTrigger = subContainers.svgTrigger;

        colors.initLinearGradients(svg);//this draws a <defs> containing all those linear gradients that can be used by others.

        switch (type) {
            case "basicLineIrregular":
                this.weaveBasicLineIrregular(input, svg, svgTrigger, div);
                break;
            case "basicLineRegular":
                this.weaveBasicLineRegular(input, svg, svgTrigger, div);
                break;
            case "basicCategory":
                this.weaveBasicCategory(input, svg, svgTrigger, div);
                break;
            case "singleTime":
                this.weaveSingleTime(input, svg, svgTrigger, div);
                break;
            case "basicStackRegular":
                this.weaveBasicStackRegular(input, svg, svgTrigger, div);
                break;
            case "basicPieChart":
                this.weaveBasicPieChart(input, svg, svgTrigger, div);
                break;
        }
    },


    weaveBasicLineIrregular: function (input, svg, svgTrigger,  htmlContainer) {
        var legend = new Legend(svg, input.series, input.legend/*this is really legendPosition*/);
        legend.analyze();

        var layout = new GeneralLayout(svg, input.mainTitle, input.subTitle, input.yAxisTitle,
            input.xAxisTitle, legend);

        var xLeftPadding = 10;
        var xRightPadding = 10;
        var lar = layout.analyze(); //layout analyze result.
        var xAxisDataAreaLength = lar.xAxisLength - xLeftPadding - xRightPadding;

        var dar = new BasicLineIrregularDataAnalyst(input, xAxisDataAreaLength).analyze(); //data analyze result.

        /* Even though the data intervals are irregular, but the marks on the x axis is linear and regular.*/
        var xAxis = new X_LinearAxis(svg, xAxisDataAreaLength, dar.minX, dar.maxX, lar.originPosition, xLeftPadding, xRightPadding);
        var yAxis = new Y_LinearAxis(svg, lar.yAxisLength, dar.minY, dar.maxY, lar.originPosition, xAxis, false, false);

        var xDrawInfo = xAxis.analyze(); //drawing information related to X axis.
        var yDrawInfo = yAxis.analyze();

        var dataViewer = new BasicLineIrregularDataViewer(htmlContainer, svg, svgTrigger, input, xDrawInfo, yDrawInfo, dar.isContinual);

        layout.draw();
        xAxis.draw();
        yAxis.draw();
        dataViewer.draw();
    },

    weaveBasicLineRegular: function(input, svg, svgTrigger, htmlContainer){
        var legend = new Legend(svg, input.series, input.legend/*this is really legendPosition*/);
        legend.analyze();

        var layout = new GeneralLayout(svg, input.mainTitle, input.subTitle, input.yAxisTitle,
            input.xAxisTitle, legend);

        var xLeftPadding = 0;
        var xRightPadding = 0;
        var lar = layout.analyze(); //layout analyze result.
        var xAxisDataAreaLength = lar.xAxisLength - xLeftPadding - xRightPadding;

        var dar = new BasicLineRegularDataAnalyst(input, xAxisDataAreaLength).analyze();

        var xAxis = new X_LinearAxis(svg, xAxisDataAreaLength, input.start, dar.maxX, lar.originPosition, xLeftPadding, xRightPadding);
        var yAxis = new Y_LinearAxis(svg, lar.yAxisLength, dar.minY, dar.maxY, lar.originPosition, xAxis, false, false);

        var xDrawInfo = xAxis.analyze(); //drawing information related to X axis.
        var yDrawInfo = yAxis.analyze();

        var dataViewer = new BasicLineRegularDataViewer(htmlContainer, svg, svgTrigger, input, xDrawInfo, yDrawInfo, dar.isContinual);

        layout.draw();
        xAxis.draw();
        yAxis.draw();
        dataViewer.draw();
    },

    weaveBasicCategory: function(input, svg, svgTrigger,  htmlContainer){
        var legend = new Legend(svg, input.series, input.legend/*this is really legendPosition*/, "rectangular");
        legend.analyze();

        var layout = new GeneralLayout(svg, input.mainTitle, input.subTitle, input.yAxisTitle,
            input.xAxisTitle, legend);

        var lar = layout.analyze(); //layout analyze result.
        var dar = new BasicCategoryDataAnalyst(input).analyze();

        var xLeftPadding = 0;
        var xRightPadding = 0;

        //because leftPadding and rightPadding are both 0 therefore xAxisDataAreaLength is equal to lar.xAxisLength.
        var xAxis = new X_CategoryAxis(svg, lar.xAxisLength -xLeftPadding-xRightPadding, lar.originPosition,
            dar.seriesNames, xLeftPadding, xRightPadding);
        var yAxis = new Y_LinearAxis(svg, lar.yAxisLength, dar.minY, dar.maxY, lar.originPosition, xAxis, false, false);

        var xDrawInfo = xAxis.analyze();
        var yDrawInfo = yAxis.analyze();

        var d = new BasicCategoryDataViewer(htmlContainer, svg, svgTrigger, input, xDrawInfo, yDrawInfo);

        layout.draw();
        xAxis.draw();
        yAxis.draw();
        d.draw();
    },

    weaveSingleTime: function(input, svg, svgTrigger,  htmlContainer){
        var legend = new Legend(svg, input.series, input.legend/*this is really legendPosition*/, "rectangular");
        legend.analyze();

        var layout = new GeneralLayout(svg, input.mainTitle, input.subTitle, input.yAxisTitle,
            input.xAxisTitle, legend);

        var lar = layout.analyze(); //layout analyze result.

        var dar = new BasicLineRegularDataAnalyst(input, lar.xAxisLength).analyze();

        var xAxis = new TimeAxis(svg, lar.xAxisLength, dar.maxX, lar.originPosition, input.unit, input.interval);
        var yAxis = new Y_LinearAxis(svg, lar.yAxisLength, dar.minY, dar.maxY, lar.originPosition, xAxis, false, false);

        var xDrawInfo = xAxis.analyze();
        var yDrawInfo = yAxis.analyze();

        var d = new BasicSingleTimeData(htmlContainer, svg, svgTrigger, input, xDrawInfo, yDrawInfo, dar.isContinual);

        layout.draw();
        xAxis.draw();
        yAxis.draw();
        d.draw();
    },

    weaveBasicStackRegular: function(input, svg, svgTrigger, htmlContainer){
        var legend = new Legend(svg, input.series, input.legend/*this is really legendPosition*/);
        legend.analyze();

        var layout = new GeneralLayout(svg, input.mainTitle, input.subTitle, input.yAxisTitle,
            input.xAxisTitle, legend);

        var xLeftPadding = 0;
        var xRightPadding = 0;
        var lar = layout.analyze(); //layout analyze result.
        var xAxisDataAreaLength = lar.xAxisLength - xLeftPadding - xRightPadding;

        var dar = new BasicStackRegularDataAnalyst(input, xAxisDataAreaLength).analyze();

        var xAxis = new X_LinearAxis(svg, xAxisDataAreaLength, input.start, dar.maxX, lar.originPosition, xLeftPadding, xRightPadding);
        var yAxis = new Y_LinearAxis(svg, lar.yAxisLength, dar.minY, dar.maxY, lar.originPosition, xAxis, true, false);

        var xDrawInfo = xAxis.analyze(); //drawing information related to X axis.
        var yDrawInfo = yAxis.analyze();

        var dataViewer = new BasicStackRegularDataViewer(htmlContainer, svg, svgTrigger, input, xDrawInfo, yDrawInfo, dar.isContinual);

        layout.draw();
        xAxis.draw();
        yAxis.draw();
        dataViewer.draw();
    },

    weaveBasicPieChart: function(input, svg, svgTrigger, htmlContainer){
        var legend = new Legend(svg, input.series, input.legend/*this is really legendPosition*/);
        legend.analyze();

        var layout = new LayoutNoAxes(svg, input.mainTitle, input.subTitle, legend);
        var lar = layout.analyze();

        var origin = lar.originPosition;
        var xAxisLength = lar.xAxisLength;
        var yAxisLength = lar.yAxisLength;



        //for test only
        var circle = draw.createCircle(origin[0], origin[1], 2);
        draw.setStrokeFill(circle, false, false, "blue");
        svg.appendChild(circle);

        var line1 = draw.createStraightLine(origin[0], origin[1], origin[0], origin[1] - yAxisLength);
        var line2 = draw.createStraightLine(origin[0], origin[1], origin[0] + xAxisLength, origin[1]);

        svg.appendChild(line1);
        svg.appendChild(line2);

        layout.draw();
    }
};