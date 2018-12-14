/**
 * draw the time based data (using a single line)
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
import {TipControl} from "../Sub/Tip/TipControl";

export function BasicSingleTimeData(htmlContainer, svg, svgTrigger, input, xDrawInfo, yDrawInfo, isContinual){
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
 *
 * Since this method will only be called once it is ok to define some functions inside this method.
 */
BasicSingleTimeData.prototype.draw = function(){
    let seriesName = this.input.series[0][0];
    let nodes = this.analyzeSingleSeriesData(this.input.series[0][1]);

    let svgDrawGroup = draw.createGroup();
    let svgTriggerGroup = draw.createGroup();
    let randomPicker = new RandomPicker();
    let tipControl = new TipControl(this.htmlContainer, 7, false);
    tipControl.createTip();

    let sssv = new SingleTimeSeriesViewer(this.htmlContainer, svgDrawGroup, svgTriggerGroup, nodes,
        randomPicker.pickNodeShape(), randomPicker.pickSeriesColor(), this.isContinual, this.input.interval, seriesName,
        tipControl, this.xDrawInfo, this.yDrawInfo, 1, true);

    sssv.draw();

    this.svg.appendChild(svgDrawGroup);
    this.svgTrigger.appendChild(svgTriggerGroup);
};

/**
 * returns an array that contains both pixel information and data information. The stride is 4 and the first 2 are pixel positions
 * while the last one are data information. The third is not really needed and therefore is set to 0;
 * @param singleSeriesData
 * @returns {Array}
 */
BasicSingleTimeData.prototype.analyzeSingleSeriesData = function(singleSeriesData){
    let nodes = [];
    let interval = this.input.interval;
    let startTime = this.input.startTime;

    let parseTime = assembleParseTimeFunction(this.input.unit);

    for(let i = 0; i < singleSeriesData.length; i++){
        let pixelX = this.xDrawInfo.startPoint + i * interval * this.xDrawInfo.pixelPerData;
        let pixelY = this.yDrawInfo.startPoint - (singleSeriesData[i] - this.yDrawInfo.min) * this.yDrawInfo.pixelPerData;
        nodes.push(pixelX);
        nodes.push(pixelY);
        nodes.push(parseTime(i));
        nodes.push(singleSeriesData[i]);
    }


    function assembleParseTimeFunction(unit){
        switch(unit){
            case "s":
                return null;//TODO
            case "m":
                return function(idx){
                    let date = new Date(startTime + interval * idx * 60000);
                    return "(" + date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + (date.getHours()+1)
                    + ":" + (date.getMinutes()+1) + ")";
                };

            case "h":
                return null;//TODO

        }
    }

    return nodes;
};


