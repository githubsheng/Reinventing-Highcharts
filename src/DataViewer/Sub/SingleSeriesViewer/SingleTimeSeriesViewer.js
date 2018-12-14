import {draw} from "../../../Draw/Draw";
import {SingleStackSeriesViewer} from "./SingleStackSeriesViewer";

/**
 * draws a line for a single time series
 * please reference `SingleLineSeriesViewer` for the meanings of the parameters.
 * @param htmlContainer
 * @param svg
 * @param svgTrigger
 * @param nodes
 * @param nodeShape
 * @param mcColor
 * @param isContinual
 * @param constantInterval      if not regular is should be false, otherwise it should be the interval value
 * @param seriesName
 * @param tipControl
 * @param xDrawInfo
 * @param yDrawInfo
 * @param lineWidth             the width of the outline
 * @param isLinearGradient      does the stack's color uses linear gradient
 * @constructor
 */
export function SingleTimeSeriesViewer(htmlContainer, svg, svgTrigger, nodes, nodeShape, mcColor,
                                 isContinual, constantInterval,
                                 seriesName, tipControl, xDrawInfo, yDrawInfo, lineWidth, isLinearGradient){
    this.htmlContainer = htmlContainer; //if use the default inherited 'showTip' method then this field must be set.
    this.svg = svg;
    this.svgTrigger = svgTrigger;
    this.nodes = nodes;
    this.nodeShape = nodeShape;
    this.mcColor = mcColor;
    this.constantInterval = constantInterval;
    this.isContinual = isContinual;
    this.seriesName = seriesName;
    this.xDrawInfo = xDrawInfo;
    this.yDrawInfo = yDrawInfo;
    this.lineWidth = lineWidth;
    this.isLinearGradient = isLinearGradient;

    this.svgLayerGroup = draw.createGroup();
    this.svgTriggerGroup = draw.createGroup();
    this.tipControl = tipControl;
}

SingleTimeSeriesViewer.prototype = new SingleStackSeriesViewer();
SingleTimeSeriesViewer.prototype.constructor = SingleTimeSeriesViewer;

SingleTimeSeriesViewer.prototype.drawHighlightNode = function(){
    return null;
};
