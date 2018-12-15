import {TipControl} from "../Sub/Tip/TipControl";
import {RandomPicker} from "../../Util/RandomPicker";
import {draw} from "../../Draw/Draw";
import {SingleLineSeriesViewer} from "../Sub/SingleSeriesViewer/SingleLineSeriesViewer";

/**
 * construct a basic line linear data.
 * @param htmlContainer     the html container (html layer) is needed as we need to append the tooltip to it.
 * @param svg               to which we will append the svg elements
 * @param svgTrigger        tooltip trigger
 * @param input             the data points
 * @param xDrawInfo         the analysis of x axis, we need to draw the lines / nodes according to the axis (of course)
 * @param yDrawInfo         the analysis of y axis
 * @param isContinual       draw nodes / lines
 * @constructor
 */
export function BasicLineIrregularDataViewer(htmlContainer, svg, svgTrigger, input, xDrawInfo, yDrawInfo, isContinual) {
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
 * need not be called after analyze() because there is no such method in this class.
 * draw the lines / nodes for data.
 */
BasicLineIrregularDataViewer.prototype.draw = function () {
    let tipControl = new TipControl(this.htmlContainer, 7, false);
    tipControl.createTip();

    //loop through different series
    let series = this.input.series;
    let randomPicker = new RandomPicker();

    let svgDrawGroup = draw.createGroup();
    let svgTriggerGroup = draw.createGroup();

    for(let i = 0; i < series.length; i++) {
        let singleSeriesName = series[i][0];
        let singleSeriesData = series[i][1];
        let nodes = this.analyzeSingleSeriesData(singleSeriesData);

        let mcColor = randomPicker.pickSeriesColor();
        let nodeShape = randomPicker.pickNodeShape();
        //I need to pass in the this.htmlContainer rather than a div that serves as a group because I need to
        //append the tip template to the dom in order to use its getClientBoundingRect method. And this.htmlContainer
        //is already inserted into the DOM.
        let singleLineSeriesViewer = new SingleLineSeriesViewer(this.htmlContainer, svgDrawGroup, svgTriggerGroup, nodes, nodeShape, mcColor,
            this.isContinual, false, singleSeriesName, tipControl, this.xDrawInfo, this.yDrawInfo);
        singleLineSeriesViewer.draw();
    }

    this.svg.appendChild(svgDrawGroup);
    this.svgTrigger.appendChild(svgTriggerGroup);
};


/**
 * returns an array that contains both pixel information and data information. The stride is 4 and the first 2 are pixel positions
 * while the last 2 are data information.
 * @param singleSeriesData      the data of a single series
 * @returns {Array}
 */
BasicLineIrregularDataViewer.prototype.analyzeSingleSeriesData = function(singleSeriesData){
    let nodes = []; //reset it to empty array.

    for (let ii = 0; ii < singleSeriesData.length; ii++) {
        let x = this.xDrawInfo.startPoint + (singleSeriesData[ii][0] - this.xDrawInfo.min) * this.xDrawInfo.pixelPerData;
        let y = this.yDrawInfo.startPoint - (singleSeriesData[ii][1] - this.yDrawInfo.min) * this.yDrawInfo.pixelPerData;

        nodes.push(x);
        nodes.push(y);
        nodes.push(singleSeriesData[ii][0]);
        nodes.push(singleSeriesData[ii][1]);
    }
    return nodes;
};
