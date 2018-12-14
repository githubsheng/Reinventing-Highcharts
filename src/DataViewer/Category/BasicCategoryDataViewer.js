/**
 * Created by wangsheng on 12/6/14.
 */

import {RandomPicker} from "../../Util/RandomPicker";
import {draw} from "../../Draw/Draw";
import {TipControl} from "../Sub/Tip/TipControl";

/**
 * this class is used to draw category columns
 *
 * @param htmlContainer     the html container (html layer) is needed as we need to append the tooltip to it.
 * @param svg               to which we will append the svg elements
 * @param svgTrigger        tooltip trigger
 * @param input             the data points
 * @param xDrawInfo         the analysis of x axis, we need to draw the lines / nodes according to the axis (of course)
 * @param yDrawInfo         the analysis of y axis
 * @constructor
 */
export function BasicCategoryDataViewer(htmlContainer, svg, svgTrigger, input, xDrawInfo, yDrawInfo){
    this.htmlContainer = htmlContainer;
    this.svg = svg;
    this.svgTrigger = svgTrigger;
    this.input = input;
    this.xDrawInfo = xDrawInfo;
    this.yDrawInfo = yDrawInfo;
}

/**
 * public method. called by the weaver to draw the columns, and also set proper event listeners on those columns
 */
BasicCategoryDataViewer.prototype.draw = function(){
    let random = new RandomPicker();
    let svgGroup = draw.createGroup();
    let svgTriggerGroup = draw.createGroup();
    let tipControl = new TipControl(this.htmlContainer, 7, true);
    tipControl.createTip();

    for(let i = 0; i <  this.xDrawInfo.categoryBasePositions.length; i = i + 2){
        //in this case the nodes array will contain only one node. This is because a basic column series will only have one data.
        let nodes = [
            this.xDrawInfo.categoryBasePositions[i]/*pixelX*/,
            this.xDrawInfo.categoryBasePositions[i+1],
            0/*dataX, does not matter here*/,
            this.input.series[i/2][1]
        ];

        let seriesName = this.input.series[i/2][0];

        let scv = new SingleColumnViewer();

        scv.draw(nodes[0], nodes[1], this.xDrawInfo.columnWidth, seriesName, nodes[3], random.pickSeriesColor(), nodes, svgGroup, svgTriggerGroup,
            tipControl, this.htmlContainer, this.yDrawInfo);
    }
    this.svg.appendChild(svgGroup);
    this.svgTrigger.appendChild(svgTriggerGroup);
};
