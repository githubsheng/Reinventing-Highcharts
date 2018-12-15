/**
 * draws the stacks for regular data.
 *
 * @param htmlContainer     the html container (html layer) is needed as we need to append the tooltip to it.
 * @param svg               to which we will append the svg elements
 * @param svgTrigger        tooltip trigger
 * @param input             the data points
 * @param xDrawInfo         the analysis of x axis, we need to draw the lines / nodes according to the axis (of course)
 * @param yDrawInfo         the analysis of y axis
 * @param isContinual       draw nodes / lines
 * @constructor
 */
import {draw} from "../../Draw/Draw";
import {RandomPicker} from "../../Util/RandomPicker";
import {SingleStackSeriesViewer} from "../Sub/SingleSeriesViewer/SingleStackSeriesViewer";
import {SharedTipControl} from "../Sub/Tip/Sub/SharedControl/SharedTipControl";

export function BasicStackRegularDataViewer(htmlContainer, svg, svgTrigger, input, xDrawInfo, yDrawInfo, isContinual){
    this.htmlContainer = htmlContainer;
    this.svg = svg;
    this.svgTrigger = svgTrigger;
    this.input = input;
    this.xDrawInfo = xDrawInfo;
    this.yDrawInfo = yDrawInfo;
    this.topTip = null;
    this.isContinual = isContinual;
}

/**
 * This method draws the data between x and y axes. And it also configure the event listener.
 */
BasicStackRegularDataViewer.prototype.draw = function(){
    let svgDrawGroup = draw.createGroup();
    let svgTriggerGroup = draw.createGroup();
    let randomPicker = new RandomPicker();
    let tipControl = new SharedTipControl(this.htmlContainer, 7);

    let seriesNames = [];
    for(let i = 0; i < this.input.series.length; i++){
        seriesNames.push(this.input.series[i][0]);
    }

    tipControl.createTip(seriesNames);//call it here after all

    //since all series are of the same length i will just use the length of the first one.
    let stackedData = new Array(this.input.series[0][1].length);
    for(let i = 0; i < stackedData.length; i++){
        stackedData[i] = 0;
    }

    //since the last drawn covers up the previous drawn, I need to store them first and then reverse the order.
    let seriesDrawInfos = [];
    for(let i = 0; i < this.input.series.length; i++){
        let seriesName = this.input.series[i][0];
        let nodes = this.analyzeSingleSeriesData(this.input.series[i][1], stackedData);
        seriesDrawInfos.push([seriesName, nodes]);
    }
    seriesDrawInfos.reverse();

    for(let i = 0; i < seriesDrawInfos.length; i++){
        let seriesName = seriesDrawInfos[i][0];
        let nodes = seriesDrawInfos[i][1];
        let sssv = new SingleStackSeriesViewer(this.htmlContainer, svgDrawGroup, svgTriggerGroup, nodes,
        randomPicker.pickNodeShape(), randomPicker.pickSeriesColor(), this.isContinual, this.input.interval, seriesName,
        tipControl, this.xDrawInfo, this.yDrawInfo, 3, false);
        sssv.draw();
    }

    this.svg.appendChild(svgDrawGroup);
    this.svgTrigger.appendChild(svgTriggerGroup);
};

/**
 * returns an array that contains both pixel information and data information. The stride is 4 and the first 2 are pixel positions
 * while the last one are data information. The third is not really needed and therefore is set to 0;
 * @param singleSeriesData
 * @returns {Array}
 */
BasicStackRegularDataViewer.prototype.analyzeSingleSeriesData = function(singleSeriesData, stackedData){
    let nodes = [];
    let interval = this.input.interval;

    for(let i = 0; i < singleSeriesData.length; i++){
        let pixelX = this.xDrawInfo.startPoint + i * interval * this.xDrawInfo.pixelPerData;
        stackedData[i] = singleSeriesData[i] + stackedData[i];
        let pixelY = this.yDrawInfo.startPoint - (stackedData[i] - this.yDrawInfo.min) * this.yDrawInfo.pixelPerData;
        nodes.push(pixelX);
        nodes.push(pixelY);
        nodes.push(this.input.start + this.input.interval * i);
        nodes.push(singleSeriesData[i]);
    }
    return nodes;
};


