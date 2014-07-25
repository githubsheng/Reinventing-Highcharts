/**
 * Created by wangsheng on 1/6/14.
 */

var weaver = {
    createContainers: function(container, options){
        container.setAttribute("class", "mc-container");
        var bcr = container.getBoundingClientRect();
        var width = bcr.width;
        var height = bcr.height;
        var svg;
        var tipContainer;
        var svgTriggerLayer;
        var canvas;
        var canvasTrigger;
        var offScreenCanvas;

        //this one is always hidden and does not matter
        if(options.offScreenCanvas){
            offScreenCanvas = document.createElement("canvas");
            offScreenCanvas.style.display = "none";
            container.appendChild(offScreenCanvas);
        }

        if(options.svg){
            svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.style.position = "absolute";
            svg.style.left = "0px";
            svg.style.top = "0px";
            svg.setAttributeNS(null, "width", width.toString());
            svg.setAttributeNS(null, "height", height.toString());
            container.appendChild(svg);
        }

        if(options.canvas){
            canvas = document.createElement("canvas");
            container.appendChild(canvas);

            //position can only be set after the relevant layout has been analyzed.
        }

        if(options.tipContainer){
            tipContainer = document.createElement("div");
            tipContainer.setAttribute("class", "mc-div-draw-layer");
            container.appendChild(tipContainer); //tip layer should be above the
        }

        if(options.svgTrigger){
            svgTriggerLayer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svgTriggerLayer.setAttributeNS(null, "width", width.toString());
            svgTriggerLayer.setAttributeNS(null, "height", height.toString());
            svgTriggerLayer.style.position = "absolute";
            svgTriggerLayer.style.left = "0";
            svgTriggerLayer.style.top = "0";
            container.appendChild(svgTriggerLayer);
        }

        if(options.canvasTrigger){
            canvasTrigger = document.createElement("div");
            container.appendChild(canvasTrigger);
        }



        return {
            svg: svg,
            div: tipContainer, //which is really tip container....bad naming but lazy to rename it..
            svgTrigger: svgTriggerLayer,
            canvas: canvas,
            offScreenCanvas: offScreenCanvas,
            canvasTrigger: canvasTrigger
        }
    },


    weave: function (type, input /* in the future also various kinds of options */, container) {
        switch (type) {
            case "basicLineIrregular":
                this.weaveBasicLineIrregular(input, container);
                break;
            case "basicLineRegular":
                this.weaveBasicLineRegular(input, container);
                break;
            case "basicCategory":
                this.weaveBasicCategory(input, container);
                break;
            case "singleTime":
                this.weaveSingleTime(input, container);
                break;
            case "basicStackRegular":
                this.weaveBasicStackRegular(input, container);
                break;
            case "basicPieChart":
                this.weaveBasicPieChart(input, container);
                break;
            case "3dGrid":
                this.weave3dGrid(input, container);
                break;
        }
    },


    weaveBasicLineIrregular: function (input, container) {
        var subContainers = this.createContainers(container, {svg: true, svgTrigger: true, tipContainer: true});
        var svg = subContainers.svg;
        var tipContainer = subContainers.div;
        var svgTrigger = subContainers.svgTrigger;
        colors.initLinearGradients(svg);//this draws a <defs> containing all those linear gradients that can be used by others.

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

        var dataViewer = new BasicLineIrregularDataViewer(tipContainer, svg, svgTrigger, input, xDrawInfo, yDrawInfo, dar.isContinual);

        layout.draw();
        xAxis.draw();
        yAxis.draw();
        dataViewer.draw();
    },

    weaveBasicLineRegular: function(input, container){
        var subContainers = this.createContainers(container, {svg: true, svgTrigger: true, tipContainer: true});
        var svg = subContainers.svg;
        var tipContainer = subContainers.div;
        var svgTrigger = subContainers.svgTrigger;
        colors.initLinearGradients(svg);//this draws a <defs> containing all those linear gradients that can be used by others.

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

        var dataViewer = new BasicLineRegularDataViewer(tipContainer, svg, svgTrigger, input, xDrawInfo, yDrawInfo, dar.isContinual);

        layout.draw();
        xAxis.draw();
        yAxis.draw();
        dataViewer.draw();
    },

    weaveBasicCategory: function(input, container){
        var subContainers = this.createContainers(container, {svg: true, svgTrigger: true, tipContainer: true});
        var svg = subContainers.svg;
        var tipContainer = subContainers.div;
        var svgTrigger = subContainers.svgTrigger;
        colors.initLinearGradients(svg);//this draws a <defs> containing all those linear gradients that can be used by others.

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

        var d = new BasicCategoryDataViewer(tipContainer, svg, svgTrigger, input, xDrawInfo, yDrawInfo);

        layout.draw();
        xAxis.draw();
        yAxis.draw();
        d.draw();
    },

    weaveSingleTime: function(input, container){
        var subContainers = this.createContainers(container, {svg: true, svgTrigger: true, tipContainer: true});
        var svg = subContainers.svg;
        var tipContainer = subContainers.div;
        var svgTrigger = subContainers.svgTrigger;
        colors.initLinearGradients(svg);//this draws a <defs> containing all those linear gradients that can be used by others.

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

        var d = new BasicSingleTimeData(tipContainer, svg, svgTrigger, input, xDrawInfo, yDrawInfo, dar.isContinual);

        layout.draw();
        xAxis.draw();
        yAxis.draw();
        d.draw();
    },

    weaveBasicStackRegular: function(input, container){
        var subContainers = this.createContainers(container, {svg: true, svgTrigger: true, tipContainer: true});
        var svg = subContainers.svg;
        var tipContainer = subContainers.div;
        var svgTrigger = subContainers.svgTrigger;
        colors.initLinearGradients(svg);//this draws a <defs> containing all those linear gradients that can be used by others.

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

        var dataViewer = new BasicStackRegularDataViewer(tipContainer, svg, svgTrigger, input, xDrawInfo, yDrawInfo, dar.isContinual);

        layout.draw();
        xAxis.draw();
        yAxis.draw();
        dataViewer.draw();
    },

    weaveBasicPieChart: function(input, container){
        var subContainers = this.createContainers(container, {svg: true, svgTrigger: true, tipContainer: true});
        var svg = subContainers.svg;
        var tipContainer = subContainers.div;
        var svgTrigger = subContainers.svgTrigger;
        colors.initLinearGradients(svg);//this draws a <defs> containing all those linear gradients that can be used by others.

        var legend = new Legend(svg, input.series, input.legend/*this is really legendPosition*/);
        legend.analyze();

        var layout = new LayoutNoAxes(svg, input.mainTitle, input.subTitle, legend);
        var lar = layout.analyze();

        var analyst = new BasicPieDataAnalyst(input);
        var dar = analyst.analyze();

        var dataViewer = new BasicPieDataViewer(tipContainer, svg, svgTrigger, input, lar.center, lar.dataDrawAreaX,
        lar.dataDrawAreaY, lar.radiusForLabel, lar.radiusForPie, lar.radiusForConnectionLine,  dar.total);
        dataViewer.draw();

        layout.draw();
    },

    /**
     *
     * @param input
     */
    weave3dGrid: function(input, container){
        /**
         * svg               this is used to draw layout, legends as well as 2D data.
         * svgTrigger        this is used as trigger in 2d data. This needs to be set "display:none" in 3d context.
         * tipContainer      both tips in 3d context and in 2d context can be put here.
         * canvas            this is the place I use webgl to draw the 3d grids. This needs to be set "display:none" in 2d context.
         * offScreenCanvas   this is the place I use 2d canvas to generate label image data. This needs to be set "display:none" all the time.
         * canvasTrigger     this is used as the trigger in 3d context. Notice that this htmlTrigger should be of the same size
         *                   of canvas and positioned exactly at the same place.
         */
        var subContainers = this.createContainers(container, {svg: true, svgTrigger: true, tipContainer: true, canvas: true, offScreenCanvas: true, canvasTrigger: true});
        //set the sub container's background color to white...
        container.style.background = "white";

        var svg = subContainers.svg;
        var tipContainer = subContainers.div;
        var svgTrigger = subContainers.svgTrigger;
        var canvas = subContainers.canvas;
        var offScreenCanvas = subContainers.offScreenCanvas;
        var canvasTrigger = subContainers.canvasTrigger;
        colors.initLinearGradients(svg);//this draws a <defs> containing all those linear gradients that can be used by others.


        var legendList = [];
        var rowLegend = new Legend(svg, input.series, input.rowLegend/*this is really legendPosition*/, "rectangular");
        rowLegend.analyze(input.series.rows, true);
        var columnLegend = new Legend(svg, input.series, input.columnLegend/*this is really legendPosition*/);
        columnLegend.analyze(input.series.columns, false);
        legendList.push(rowLegend);
        legendList.push(columnLegend);

        var layout = new MultipleLegendLayout(svg, input.mainTitle, input.subTitle, legendList);
        var lar = layout.analyze();

        var relativePositionOfCanvasAndItsTrigger = [lar.originPosition[0], lar.originPosition[1]-lar.dataDrawAreaY];
        var canvasDimension = [lar.dataDrawAreaX, lar.dataDrawAreaY];

        canvas.style.position = "absolute";
        canvas.style.left = relativePositionOfCanvasAndItsTrigger[0] + "px";
        canvas.style.top = relativePositionOfCanvasAndItsTrigger[1] + "px";
        canvas.width = canvasDimension[0];
        canvas.height = canvasDimension[1];

        //show it when in 3d context (default context)
        canvasTrigger.style.position = "absolute";
        canvasTrigger.style.left = relativePositionOfCanvasAndItsTrigger[0] + "px";
        canvasTrigger.style.top = relativePositionOfCanvasAndItsTrigger[1] + "px";
        canvasTrigger.style.width = canvasDimension[0] + "px";
        canvasTrigger.style.height = canvasDimension[1] + "px";

        //set the tip container to be of the same size of canvas, and sits at the same spot. When turning on 2d context,
        //then it should be of the same size and position as the svg layer.
        tipContainer.style.left = relativePositionOfCanvasAndItsTrigger[0] + "px";
        tipContainer.style.top = relativePositionOfCanvasAndItsTrigger[1] + "px";
        tipContainer.style.width = canvasDimension[0] + "px";
        tipContainer.style.height = canvasDimension[1] + "px";


        svgTrigger.style.display = "none"; //show it when in 2d context

        layout.draw();
        threeDgridWebgl.draw(input, canvas, offScreenCanvas, canvasTrigger, tipContainer);
    }
};