/**
 * reads the user config and data input and constructs various types of charts
 * the is the entry point of the lib
 */
import {colors} from "./src/Draw/Color";
import {Legend} from "./src/Legend/Legend";
import {GeneralLayout} from "./src/Layout/Sub/GeneralLayout";
import {X_LinearAxis, Y_LinearAxis} from "./src/Axis/Sub/LinearAxis";
import {BasicLineRegularDataViewer} from "./src/DataViewer/BasicLine/BasicLineRegularDataViewer";
import {X_CategoryAxis} from "./src/Axis/Sub/CategoryAxis";
import {BasicCategoryDataViewer} from "./src/DataViewer/Category/BasicCategoryDataViewer";
import {TimeAxis} from "./src/Axis/Sub/TimeAxis";
import {BasicSingleTimeData} from "./src/DataViewer/Stack/BasicSingleTimeDataViewer";
import {BasicStackRegularDataViewer} from "./src/DataViewer/Stack/BasicStackRegularDataViewer";
import {BasicLineIrregularDataViewer} from "./src/DataViewer/BasicLine/BasicLineIrregularDataViewer";
import {LayoutNoAxes} from "./src/Layout/Sub/LayoutNoAxes";
import {BasicPieDataAnalyst} from "./src/DataAnalyst/Pie/BasicPieDataAnalyst";
import {BasicPieDataViewer} from "./src/DataViewer/Pie/BasicPieDataViewer";
import {MultipleLegendLayout} from "./src/Layout/Sub/MultipleLegendLayout";

const weaver = {
    createContainers: function(container, options){
        container.setAttribute("class", "mc-container");
        let bcr = container.getBoundingClientRect();
        let width = bcr.width;
        let height = bcr.height;
        let svg;
        let tipContainer;
        let svgTriggerLayer;
        let canvas;
        let canvasTrigger;
        let offScreenCanvas;

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
        let subContainers = this.createContainers(container, {svg: true, svgTrigger: true, tipContainer: true});
        let svg = subContainers.svg;
        let tipContainer = subContainers.div;
        let svgTrigger = subContainers.svgTrigger;
        colors.initLinearGradients(svg);//this draws a <defs> containing all those linear gradients that can be used by others.

        let legend = new Legend(svg, input.series, input.legend/*this is really legendPosition*/);
        legend.analyze();

        let layout = new GeneralLayout(svg, input.mainTitle, input.subTitle, input.yAxisTitle,
            input.xAxisTitle, legend);

        let xLeftPadding = 10;
        let xRightPadding = 10;
        let lar = layout.analyze(); //layout analyze result.
        let xAxisDataAreaLength = lar.xAxisLength - xLeftPadding - xRightPadding;

        let dar = new BasicLineIrregularDataAnalyst(input, xAxisDataAreaLength).analyze(); //data analyze result.

        /* Even though the data intervals are irregular, but the marks on the x axis is linear and regular.*/
        let xAxis = new X_LinearAxis(svg, xAxisDataAreaLength, dar.minX, dar.maxX, lar.originPosition, xLeftPadding, xRightPadding);
        let yAxis = new Y_LinearAxis(svg, lar.yAxisLength, dar.minY, dar.maxY, lar.originPosition, xAxis, false, false);

        let xDrawInfo = xAxis.analyze(); //drawing information related to X axis.
        let yDrawInfo = yAxis.analyze();

        let dataViewer = new BasicLineIrregularDataViewer(tipContainer, svg, svgTrigger, input, xDrawInfo, yDrawInfo, dar.isContinual);

        layout.draw();
        xAxis.draw();
        yAxis.draw();
        dataViewer.draw();
    },

    weaveBasicLineRegular: function(input, container){
        let subContainers = this.createContainers(container, {svg: true, svgTrigger: true, tipContainer: true});
        let svg = subContainers.svg;
        let tipContainer = subContainers.div;
        let svgTrigger = subContainers.svgTrigger;
        colors.initLinearGradients(svg);//this draws a <defs> containing all those linear gradients that can be used by others.

        let legend = new Legend(svg, input.series, input.legend/*this is really legendPosition*/);
        legend.analyze();

        let layout = new GeneralLayout(svg, input.mainTitle, input.subTitle, input.yAxisTitle,
            input.xAxisTitle, legend);

        let xLeftPadding = 0;
        let xRightPadding = 0;
        let lar = layout.analyze(); //layout analyze result.
        let xAxisDataAreaLength = lar.xAxisLength - xLeftPadding - xRightPadding;

        let dar = new BasicLineRegularDataAnalyst(input, xAxisDataAreaLength).analyze();

        let xAxis = new X_LinearAxis(svg, xAxisDataAreaLength, input.start, dar.maxX, lar.originPosition, xLeftPadding, xRightPadding);
        let yAxis = new Y_LinearAxis(svg, lar.yAxisLength, dar.minY, dar.maxY, lar.originPosition, xAxis, false, false);

        let xDrawInfo = xAxis.analyze(); //drawing information related to X axis.
        let yDrawInfo = yAxis.analyze();

        let dataViewer = new BasicLineRegularDataViewer(tipContainer, svg, svgTrigger, input, xDrawInfo, yDrawInfo, dar.isContinual);

        layout.draw();
        xAxis.draw();
        yAxis.draw();
        dataViewer.draw();
    },

    weaveBasicCategory: function(input, container){
        let subContainers = this.createContainers(container, {svg: true, svgTrigger: true, tipContainer: true});
        let svg = subContainers.svg;
        let tipContainer = subContainers.div;
        let svgTrigger = subContainers.svgTrigger;
        colors.initLinearGradients(svg);//this draws a <defs> containing all those linear gradients that can be used by others.

        let legend = new Legend(svg, input.series, input.legend/*this is really legendPosition*/, "rectangular");
        legend.analyze();

        let layout = new GeneralLayout(svg, input.mainTitle, input.subTitle, input.yAxisTitle,
            input.xAxisTitle, legend);

        let lar = layout.analyze(); //layout analyze result.
        let dar = new BasicCategoryDataAnalyst(input).analyze();

        let xLeftPadding = 0;
        let xRightPadding = 0;

        //because leftPadding and rightPadding are both 0 therefore xAxisDataAreaLength is equal to lar.xAxisLength.
        let xAxis = new X_CategoryAxis(svg, lar.xAxisLength -xLeftPadding-xRightPadding, lar.originPosition,
            dar.seriesNames, xLeftPadding, xRightPadding);
        let yAxis = new Y_LinearAxis(svg, lar.yAxisLength, dar.minY, dar.maxY, lar.originPosition, xAxis, false, false);

        let xDrawInfo = xAxis.analyze();
        let yDrawInfo = yAxis.analyze();

        let d = new BasicCategoryDataViewer(tipContainer, svg, svgTrigger, input, xDrawInfo, yDrawInfo);

        layout.draw();
        xAxis.draw();
        yAxis.draw();
        d.draw();
    },

    weaveSingleTime: function(input, container){
        let subContainers = this.createContainers(container, {svg: true, svgTrigger: true, tipContainer: true});
        let svg = subContainers.svg;
        let tipContainer = subContainers.div;
        let svgTrigger = subContainers.svgTrigger;
        colors.initLinearGradients(svg);//this draws a <defs> containing all those linear gradients that can be used by others.

        let legend = new Legend(svg, input.series, input.legend/*this is really legendPosition*/, "rectangular");
        legend.analyze();

        let layout = new GeneralLayout(svg, input.mainTitle, input.subTitle, input.yAxisTitle,
            input.xAxisTitle, legend);

        let lar = layout.analyze(); //layout analyze result.

        let dar = new BasicLineRegularDataAnalyst(input, lar.xAxisLength).analyze();

        let xAxis = new TimeAxis(svg, lar.xAxisLength, dar.maxX, lar.originPosition, input.unit, input.interval);
        let yAxis = new Y_LinearAxis(svg, lar.yAxisLength, dar.minY, dar.maxY, lar.originPosition, xAxis, false, false);

        let xDrawInfo = xAxis.analyze();
        let yDrawInfo = yAxis.analyze();

        let d = new BasicSingleTimeData(tipContainer, svg, svgTrigger, input, xDrawInfo, yDrawInfo, dar.isContinual);

        layout.draw();
        xAxis.draw();
        yAxis.draw();
        d.draw();
    },

    weaveBasicStackRegular: function(input, container){
        let subContainers = this.createContainers(container, {svg: true, svgTrigger: true, tipContainer: true});
        let svg = subContainers.svg;
        let tipContainer = subContainers.div;
        let svgTrigger = subContainers.svgTrigger;
        colors.initLinearGradients(svg);//this draws a <defs> containing all those linear gradients that can be used by others.

        let legend = new Legend(svg, input.series, input.legend/*this is really legendPosition*/);
        legend.analyze();

        let layout = new GeneralLayout(svg, input.mainTitle, input.subTitle, input.yAxisTitle,
            input.xAxisTitle, legend);

        let xLeftPadding = 0;
        let xRightPadding = 0;
        let lar = layout.analyze(); //layout analyze result.
        let xAxisDataAreaLength = lar.xAxisLength - xLeftPadding - xRightPadding;

        let dar = new BasicStackRegularDataAnalyst(input, xAxisDataAreaLength).analyze();

        let xAxis = new X_LinearAxis(svg, xAxisDataAreaLength, input.start, dar.maxX, lar.originPosition, xLeftPadding, xRightPadding);
        let yAxis = new Y_LinearAxis(svg, lar.yAxisLength, dar.minY, dar.maxY, lar.originPosition, xAxis, true, false);

        let xDrawInfo = xAxis.analyze(); //drawing information related to X axis.
        let yDrawInfo = yAxis.analyze();

        let dataViewer = new BasicStackRegularDataViewer(tipContainer, svg, svgTrigger, input, xDrawInfo, yDrawInfo, dar.isContinual);

        layout.draw();
        xAxis.draw();
        yAxis.draw();
        dataViewer.draw();
    },

    weaveBasicPieChart: function(input, container){
        let subContainers = this.createContainers(container, {svg: true, svgTrigger: true, tipContainer: true});
        let svg = subContainers.svg;
        let tipContainer = subContainers.div;
        let svgTrigger = subContainers.svgTrigger;
        colors.initLinearGradients(svg);//this draws a <defs> containing all those linear gradients that can be used by others.

        let legend = new Legend(svg, input.series, input.legend/*this is really legendPosition*/);
        legend.analyze();

        let layout = new LayoutNoAxes(svg, input.mainTitle, input.subTitle, legend);
        let lar = layout.analyze();

        let analyst = new BasicPieDataAnalyst(input);
        let dar = analyst.analyze();

        let dataViewer = new BasicPieDataViewer(tipContainer, svg, svgTrigger, input, lar.center, lar.dataDrawAreaX,
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
        let subContainers = this.createContainers(container, {svg: true, svgTrigger: true, tipContainer: true, canvas: true, offScreenCanvas: true, canvasTrigger: true});
        //set the sub container's background color to white...
        container.style.background = "white";

        let svg = subContainers.svg;
        let tipContainer = subContainers.div;
        let svgTrigger = subContainers.svgTrigger;
        let canvas = subContainers.canvas;
        let offScreenCanvas = subContainers.offScreenCanvas;
        let canvasTrigger = subContainers.canvasTrigger;
        colors.initLinearGradients(svg);//this draws a <defs> containing all those linear gradients that can be used by others.


        let legendList = [];
        let rowLegend = new Legend(svg, input.series, input.rowLegend/*this is really legendPosition*/, "rectangular");
        rowLegend.analyze(input.series.rows, true);
        let columnLegend = new Legend(svg, input.series, input.columnLegend/*this is really legendPosition*/);
        columnLegend.analyze(input.series.columns, false);
        legendList.push(rowLegend);
        legendList.push(columnLegend);

        let layout = new MultipleLegendLayout(svg, input.mainTitle, input.subTitle, legendList);
        let lar = layout.analyze();

        let relativePositionOfCanvasAndItsTrigger = [lar.originPosition[0], lar.originPosition[1]-lar.dataDrawAreaY];
        let canvasDimension = [lar.dataDrawAreaX, lar.dataDrawAreaY];

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