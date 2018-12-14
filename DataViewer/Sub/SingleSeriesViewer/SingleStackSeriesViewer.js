/**
 * draws a single stack for a series in a stack chart
 * please reference `SingleLineSeriesViewer` for the meanings of the parameters.
 * @param htmlContainer
 * @param svg
 * @param svgTrigger
 * @param nodes
 * @param nodeShape
 * @param mcColor
 * @param isContinual
 * @param constantInterval
 * @param seriesName
 * @param tipControl
 * @param xDrawInfo
 * @param yDrawInfo
 * @param lineWidth             the width of the outline
 * @param isLinearGradient      does the stack's color uses linear gradient
 * @constructor
 */
import {draw} from "../../../Draw/Draw";
import {SingleLineSeriesViewer} from "./SingleLineSeriesViewer";
import {nodeDrawer} from "../../../Draw/NodeDrawer";

export function SingleStackSeriesViewer(htmlContainer, svg, svgTrigger, nodes, nodeShape, mcColor,
                                        isContinual, constantInterval/*if not regular is should be false, otherwise it should be the interval value*/,
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

SingleStackSeriesViewer.prototype = new SingleLineSeriesViewer();
SingleStackSeriesViewer.prototype.constructor = SingleStackSeriesViewer;

SingleStackSeriesViewer.prototype.draw = function(){
    this.svgLayerGroup.appendChild(this.drawStack());
    this.svgLayerGroup.appendChild(this.drawLine());
    this.drawLine();
    this.drawNodes();
    //call 'enable routine trance' before calling 'enable node trigger' so that the nodes trigger is laid above the routine trigger.
    let highlightedNode = this.drawHighlightNode();
    this.enableRoutineTrace(highlightedNode);
    this.enableNodeTrigger(highlightedNode);
    this.svg.appendChild(this.svgLayerGroup);
    this.svgTrigger.appendChild(this.svgTriggerGroup);
};

SingleStackSeriesViewer.prototype.drawLine = function(){
    let lines = draw.createStraightLines(this.nodes, 4, 0);
    draw.setStrokeFill(lines, this.mcColor.strokeColor, this.lineWidth, "none");
    return lines;
};

SingleStackSeriesViewer.prototype.drawStack = function(){
    //draw the stack, minus 0.5 so that i does not cover up the x axis.
    let rightBottom = [this.xDrawInfo.startPoint + this.xDrawInfo.length, this.yDrawInfo.startPoint - 0.5];
    let leftBottom = [this.xDrawInfo.startPoint, this.yDrawInfo.startPoint - 0.5];
    let stack = draw.createStackWithStraightLines(this.nodes, 4, 0, rightBottom, leftBottom);
    if(this.isLinearGradient){
        draw.setStrokeFill(stack, false, false, this.mcColor.linearGradientFill);
    } else {
        draw.setStrokeFill(stack, false, false, this.mcColor.fillColor);
    }

    return stack;
};

SingleStackSeriesViewer.prototype.enableNodeTrigger = function(){
    if(this.isContinual) return;

    //draw the highlighted node.
    let highlightedNode = nodeDrawer.drawHighlightedNode(this.nodeShape, this.mcColor);
    draw.setVisibility(highlightedNode, false);
    this.svgLayerGroup.appendChild(highlightedNode);

    //draw all those node trigger zones.
    let nodeMouseOverSectionGroup = draw.createGroup();
    for (let i = 0; i < this.nodes.length; i = i + 4) {
        let nodeMouseOverSection = nodeDrawer.drawTrigger(this.nodes[i], this.nodes[i + 1], i/4);
        nodeMouseOverSectionGroup.appendChild(nodeMouseOverSection);
    }
    this.svgTriggerGroup.appendChild(nodeMouseOverSectionGroup);

    //actually add listeners.
    let triggerControl = new TriggerControl(this.tipControl, this.seriesName, this.mcColor);
    triggerControl.enableNodeTrigger(nodeMouseOverSectionGroup, this.seriesName, this.mcColor, highlightedNode, this.nodes);

};


SingleStackSeriesViewer.prototype.enableRoutineTrace = function(){
    let stackTrigger = this.drawStack();
    draw.setStrokeFill(stackTrigger, false, false, "rgb(0,0,0)");
    draw.setVisibility(stackTrigger, false);
    stackTrigger.setAttributeNS(null, "pointer-events", "fill");
    this.svgTriggerGroup.appendChild(stackTrigger);

    //actually add listeners.
    let triggerControl = new TriggerControl(this.tipControl, this.seriesName, this.mcColor);
    triggerControl.enableRoutineTrace(this.htmlContainer, this.seriesName, this.mcColor, this.nodes, stackTrigger, this.constantInterval, this.xDrawInfo);
};