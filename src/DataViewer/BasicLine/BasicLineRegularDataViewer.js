import {TipControl} from "../Sub/Tip/TipControl";
import {draw} from "../../Draw/Draw";
import {RandomPicker} from "../../Util/RandomPicker";
import {SingleLineSeriesViewer} from "../Sub/SingleSeriesViewer/SingleLineSeriesViewer";

/**
 * construct a basic line linear data. the data must be regular (ie. the data intervals between data points need to be the same)
 * @param htmlContainer     the html container (html layer) is needed as we need to append the tooltip to it.
 * @param svg               to which we will append the svg elements
 * @param svgTrigger        tooltip trigger
 * @param input             the data points
 * @param xDrawInfo         the analysis of x axis, we need to draw the lines / nodes according to the axis (of course)
 * @param yDrawInfo         the analysis of y axis
 * @param isContinual       draw nodes / lines
 * @constructor
 */
export function BasicLineRegularDataViewer(htmlContainer, svg, svgTrigger, input, xDrawInfo, yDrawInfo, isContinual){
    this.htmlContainer = htmlContainer;
    this.svg = svg;
    this.svgTrigger = svgTrigger;
    this.input = input;
    this.xDrawInfo = xDrawInfo;
    this.yDrawInfo = yDrawInfo;
    this.isContinual = isContinual;
}

/**
 * This method draws the data between x and y axes. And it also configure the event listener.
 *
 * Since this method will only be called once it is ok to define some functions inside this method.
 */
BasicLineRegularDataViewer.prototype.draw = function(){

    let svgDrawGroup = draw.createGroup();
    let svgTriggerGroup = draw.createGroup();
    let randomPicker = new RandomPicker();
    let tipControl =  new TipControl(this.htmlContainer, 7, false);
    tipControl.createTip();

    for(let i = 0; i < this.input.series.length; i++){
        let seriesName = this.input.series[i][0];
        let nodes = this.analyzeSingleSeriesData(this.input.series[i][1]);
        let sssv = new SingleLineSeriesViewer(this.htmlContainer, svgDrawGroup, svgTriggerGroup, nodes,
            randomPicker.pickNodeShape(), randomPicker.pickSeriesColor(), this.isContinual, this.input.interval, seriesName,
            tipControl, this.xDrawInfo, this.yDrawInfo);
        sssv.draw();
    }

    this.svg.appendChild(svgDrawGroup);
    this.svgTrigger.appendChild(svgTriggerGroup);


};

/**
 * returns an array that contains both pixel information and data information. The stride is 4 and the first 2 are pixel positions
 * while the last one are data information. The third is not really needed and therefore is set to 0;
 * @param singleSeriesData      the data of a single series
 * @returns {Array}             each element in the array contains the all necessary drawing information for a data point.
 */
BasicLineRegularDataViewer.prototype.analyzeSingleSeriesData = function(singleSeriesData){
    let nodes = [];
    let interval = this.input.interval;
    let start = this.input.start;
    for(let i = 0; i < singleSeriesData.length; i++){
        let pixelX = this.xDrawInfo.startPoint + i * interval * this.xDrawInfo.pixelPerData;
        let pixelY = this.yDrawInfo.startPoint - (singleSeriesData[i] - this.yDrawInfo.min) * this.yDrawInfo.pixelPerData;
        nodes.push(pixelX);
        nodes.push(pixelY);
        nodes.push(start + interval * i);
        nodes.push(singleSeriesData[i]);
    }

    return nodes;
};


