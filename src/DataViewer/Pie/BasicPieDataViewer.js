import {RandomPicker} from "../../Util/RandomPicker";
import {TipControl} from "../Sub/Tip/TipControl";
import {draw} from "../../Draw/Draw";
import {SinglePieSeriesViewer} from "../Sub/SingleSeriesViewer/SinglePieSeriesViewer/SinglePieSeriesViewer";
import {PieDataLabelSlotsController} from "../Sub/SingleSeriesViewer/SinglePieSeriesViewer/PieDataLabelSlotsController";

/**
 *
 *
 * this draws a pie and set up the tool tips
 * @param htmlContainer                 the html container (html layer) is needed as we need to append the tooltip to it.
 * @param svg                           to which we will append the svg elements
 * @param svgTrigger                    tooltip trigger
 * @param input                         the data points
 * @param center                        the center of the pie
 * @param dataDrawAreaX                 not sure how this is useful. remove if tested to be unused.
 * @param dataDrawAreaY                 not sure how this is useful. remove if tested to be unused.
 * @param radiusForLabel                radius of the invisible circle, along which we draw the labels
 * @param radisuForPie                  radius of the pie circle
 * @param radiusForConnectionLineTurn   radius of the invisible circle, along which we set the middle point of the connection line (cubic curve).
 * @param total                         the sum of all series
 * @constructor
 */
export function BasicPieDataViewer(htmlContainer, svg, svgTrigger, input, center, dataDrawAreaX, dataDrawAreaY, radiusForLabel, radisuForPie, radiusForConnectionLineTurn, total){
    this.htmlContainer = htmlContainer;
    this.svg = svg;
    this.svgTrigger = svgTrigger;
    this.input = input;
    this.center = center;
    this.dataDrawAreaX = dataDrawAreaX;
    this.dataDrawAreaY = dataDrawAreaY;
    this.radiusForLabel = radiusForLabel;
    this.radiusForPie = radisuForPie;
    this.radiusForConnectionLineTurn = radiusForConnectionLineTurn;
    this.total = total;
}

/**
 * draw the pie, label,s and connection lines. set up the tool tips as well.
 */
BasicPieDataViewer.prototype.draw = function(){
    let slices = this.analyze();
    let random = new RandomPicker();

    let svgGroup = draw.createGroup();
    let svgTriggerGroup = draw.createGroup();

    let tipControl = new TipControl(this.htmlContainer, 0, true);
    tipControl.createTip();

    let labelSlotsController = new PieDataLabelSlotsController();
    labelSlotsController.generateEmptySlots(19/*label height*/, this.center, this.radiusForLabel, this.svg);

    let leftConnectorsInfo = [];
    let rightConnectorsInfo = [];

    for(let i = 0; i < slices.length; i = i + 4){
        let startAngle = slices[i];
        let endAngle = slices[i+1];
        let seriesName = slices[i+2];
        let dataY = slices[i+3];
        let spsv = new SinglePieSeriesViewer(svgGroup, this.htmlContainer, tipControl, svgTriggerGroup, startAngle,
            endAngle, this.radiusForLabel, this.radiusForPie, this.radiusForConnectionLineTurn, this.center, seriesName, random.pickSeriesColor(), dataY, labelSlotsController);
        let connectorInfo = spsv.getConnectorInfo();

        if(connectorInfo.isLeft){
            leftConnectorsInfo.push(connectorInfo);
        } else {
            rightConnectorsInfo.push(connectorInfo);
        }
        spsv.draw();
    }

    if(!this.input.noDataLabel){
        leftConnectorsInfo = labelSlotsController.processConnectorInfo(leftConnectorsInfo, true);
        rightConnectorsInfo = labelSlotsController.processConnectorInfo(rightConnectorsInfo, false);
        for(let i = 0; i < leftConnectorsInfo.length; i++){
            svgGroup.appendChild(labelSlotsController.createConnectionLine(leftConnectorsInfo[i]));
            svgGroup.appendChild(labelSlotsController.createTextInSlot(leftConnectorsInfo[i].text, leftConnectorsInfo[i].slotIdx, true));
        }

        for(let i = 0; i < rightConnectorsInfo.length; i++){
            svgGroup.appendChild(labelSlotsController.createConnectionLine(rightConnectorsInfo[i]));
            svgGroup.appendChild(labelSlotsController.createTextInSlot(rightConnectorsInfo[i].text, rightConnectorsInfo[i].slotIdx, false));
        }
    }

    this.svg.appendChild(svgGroup);
    this.svgTrigger.appendChild(svgTriggerGroup);
};

BasicPieDataViewer.prototype.analyze = function(){
    let slices = []; //[startAngle, endAngle, seriesName, dataY, startAngle, endAngle, seriesName, dataY....]
    let startAngle = 0;
    for(let i = 0; i < this.input.series.length; i++){
        let single = this.input.series[i][1];
        let angle = (single / this.total) *  360;

        slices.push(startAngle); //start angle.
        slices.push(startAngle + angle); //end angle.
        slices.push(this.input.series[i][0]); //single series name.
        slices.push(single); //single series data.

        startAngle = startAngle + angle;
    }

    return slices;
};