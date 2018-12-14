/**
 * this class draws a single line for a single series, and also setup the tooltip for this series
 * @param htmlContainer             html container, we append the tool tips (html elements) to it
 * @param svg                       svg container to which we will append the svg elements
 * @param svgTrigger                tooltip trigger
 * @param nodes                     nodes
 * @param nodeShape                 node shape
 * @param mcColor                   color
 * @param isContinual               if not enough space, we will draw a continous line to represent the data of this seris
 * @param constantInterval          whether its regular data or irregular data
 * @param seriesName                name of the series
 * @param tipControl                tool tip control
 * @param xDrawInfo                 extra info about x axis
 * @param yDrawInfo                 extra info about y axis
 * @constructor
 */
import {nodeDrawer} from "../../../Draw/NodeDrawer";
import {draw} from "../../../Draw/Draw";

export function SingleLineSeriesViewer(htmlContainer, svg, svgTrigger, nodes, nodeShape, mcColor,
                                       isContinual, constantInterval/*if not regular is should be false, otherwise it should be the interval value*/,
                                       seriesName, tipControl, xDrawInfo, yDrawInfo){
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

    this.svgLayerGroup = draw.createGroup();
    this.svgTriggerGroup = draw.createGroup();

    this.tipControl = tipControl;
}

/**
 * draw the line / nodes, and enable the tool tip
 */
SingleLineSeriesViewer.prototype.draw = function(){
    this.svgLayerGroup.appendChild(this.drawLine());
    this.drawNodes();
    let highlightedNode = this.drawHighlightNode();
    this.enableNodeTrigger(highlightedNode);
    this.enableRoutineTrace();
    this.svg.appendChild(this.svgLayerGroup);
    this.svgTrigger.appendChild(this.svgTriggerGroup);
};

/**
 * draw line
 * @returns {*|SVGElement}
 */
SingleLineSeriesViewer.prototype.drawLine = function(){
    let lines = draw.createStraightLines(this.nodes, 4, 0);
    draw.setStrokeFill(lines, this.mcColor.strokeColor, 2, "none");
    return lines;
};

/**
 * draw nodes
 */
SingleLineSeriesViewer.prototype.drawNodes = function(){
    if(this.isContinual){
        return;
    }

    let visualNodeGroup = draw.createGroup();
    for (let i = 0; i < this.nodes.length; i = i + 4) {
        //this is the one that users see
        let visualNode = nodeDrawer.draw(this.nodeShape, this.mcColor, this.nodes[i], this.nodes[i+1]);
        visualNodeGroup.appendChild(visualNode);
    }
    this.svgLayerGroup.appendChild(visualNodeGroup);
};

/**
 * draw highlight nodes. see `nodeDrawer.drawHighlightedNode`.
 * @returns {*} highlight nodes.
 */
SingleLineSeriesViewer.prototype.drawHighlightNode = function(){
    let highlightedNode = nodeDrawer.drawHighlightedNode(this.nodeShape, this.mcColor);
    draw.setVisibility(highlightedNode, false);
    this.svgLayerGroup.appendChild(highlightedNode);
    return highlightedNode;
};

/**
 * for each node, set a listener.
 * @param highlightedNode
 */
SingleLineSeriesViewer.prototype.enableNodeTrigger = function(highlightedNode){
    if(this.isContinual){
        return;
    }
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

/**
 * if we are drawing a continuous line, we need a line with similar shape (but bolder), to use as a trigger
 */
SingleLineSeriesViewer.prototype.enableRoutineTrace = function(){
    if(!this.isContinual){
        return;
    }

    let lineTrigger = draw.createStraightLines(this.nodes, 4, 0);
    draw.setStrokeFill(lineTrigger, this.mcColor.strokeColor, 20, "none");
    draw.setVisibility(lineTrigger, false);
    lineTrigger.setAttributeNS(null, "pointer-events", "stroke");
    this.svgTriggerGroup.appendChild(lineTrigger);

    //actually add listeners.
    let triggerControl = new TriggerControl(this.tipControl, this.seriesName, this.mcColor);
    triggerControl.enableRoutineTrace(this.htmlContainer, this.seriesName, this.mcColor, this.nodes, lineTrigger, this.constantInterval, this.xDrawInfo);
};


