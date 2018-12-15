/**
 * draw the part of pie, for a single series.
 * this is mainly used in BasicPieDataViewer, so please reference that class for the meaning of the params.
 * @param svg
 * @param htmlContainer
 * @param tipControl
 * @param svgTrigger
 * @param startAngle
 * @param endAngle
 * @param radiusForLabel
 * @param radiusForPie
 * @param radiusForConnectionLineTurn
 * @param center
 * @param seriesName
 * @param mcColor
 * @param dataY
 * @param slotsController
 * @constructor
 */
import {draw} from "../../../../Draw/Draw";
import {util} from "../../../../Util/Util";

export function SinglePieSeriesViewer(svg, htmlContainer, tipControl, svgTrigger, startAngle, endAngle, radiusForLabel, radiusForPie, radiusForConnectionLineTurn, center, seriesName, mcColor, dataY, slotsController){
    this.svg = svg;
    this.htmlContainer = htmlContainer;
    this.tipControl = tipControl;
    this.svgTrigger = svgTrigger;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.radiusForLabel = radiusForLabel;
    this.radiusForPie = radiusForPie;
    this.radiusForConnectionLineTurn = radiusForConnectionLineTurn;
    this.center = center;
    this.seriesName = seriesName;
    this.mcColor = mcColor;
    this.dataY = dataY;
    this.slotsController = slotsController;
}

/**
 * draw the part of the pie, for a single series
 */
SinglePieSeriesViewer.prototype.draw = function(){
    //slice.
    let slice = draw.createArcOfCircle(this.center[0], this.center[1], this.radiusForPie, this.startAngle, this.endAngle);
    draw.setStrokeFill(slice, "white", 1.5, this.mcColor.fillColor);
    this.svg.appendChild(slice);

    //enable trigger.
    this.enablePieSliceTrigger();
};

SinglePieSeriesViewer.prototype.getConnectorInfo = function(){
    //calculate the connector that connects to label. The connector is the one on the edge of our visual circle.
    let sliceDataLabelConnectorPosition = util.polarToCartesian(this.center[0], this.center[1], this.radiusForPie, (this.endAngle + this.startAngle)/2);
    let connectionLineTurnPos = util.polarToCartesian(this.center[0], this.center[1], this.radiusForConnectionLineTurn, (this.endAngle + this.startAngle)/2);

    let isLeft = false;
    if(sliceDataLabelConnectorPosition[0] < this.center[0]){
        isLeft = true;
    }

    //test start
//    let circle = draw.createCircle(sliceDataLabelConnectorPosition[0], sliceDataLabelConnectorPosition[1], 2);
//    this.svg.appendChild(circle);
    //test end.

    return {
        position: sliceDataLabelConnectorPosition,
        connectionLineTurnPos: connectionLineTurnPos,
        isLeft: isLeft,
        slotIdx: -1, //to save the slot idx information.
        text : this.seriesName + ": " + this.dataY,
        mcColor: this.mcColor
    };
};

/**
 * if the labels are already shown we probably do not need to show tooltip.
 */
SinglePieSeriesViewer.prototype.enablePieSliceTrigger = function(){
    //slice trigger.
    let sliceTrigger = draw.createArcOfCircle(this.center[0], this.center[1], this.radiusForPie, this.startAngle, this.endAngle);
    draw.setStrokeFill(sliceTrigger, false, false, "white");
    draw.setVisibility(sliceTrigger, false);
    draw.setPointerEvent(sliceTrigger, true, false);
    this.svgTrigger.appendChild(sliceTrigger);

    //calculate slice trigger center.
    let sliceTriggerCenter = util.polarToCartesian(this.center[0], this.center[1], this.radiusForPie/2, (this.endAngle + this.startAngle)/2);

    let pieSliceTriggerControl = new PieSliceTriggerControl();
    pieSliceTriggerControl.enablePieSliceTrigger(sliceTrigger, sliceTriggerCenter, this.tipControl, this.seriesName, this.mcColor, this.dataY);
};
