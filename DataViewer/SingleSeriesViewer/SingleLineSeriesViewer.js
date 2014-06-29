/**
 * Created by wangsheng on 23/6/14.
 */

/**
 * Created by wangsheng on 23/6/14.
 */

function SingleLineSeriesViewer(htmlContainer, svg, svgTrigger, nodes, nodeShape, mcColor,
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

SingleLineSeriesViewer.prototype.draw = function(){
    this.svgLayerGroup.appendChild(this.drawLine());
    this.drawNodes();
    this.enableNodeTrigger();
    this.enableRoutineTrace();
    this.svg.appendChild(this.svgLayerGroup);
    this.svgTrigger.appendChild(this.svgTriggerGroup);
};

SingleLineSeriesViewer.prototype.drawLine = function(){
    var lines = draw.createStraightLines(this.nodes, 4, 0);
    draw.setStrokeFill(lines, this.mcColor.strokeColor, 2, "none");
    return lines;
};

SingleLineSeriesViewer.prototype.drawNodes = function(){
    if(this.isContinual){
        return;
    }

    var visualNodeGroup = draw.createGroup();
    for (var i = 0; i < this.nodes.length; i = i + 4) {
        //this is the one that users see
        var visualNode = nodeDrawer.draw(this.nodeShape, this.mcColor, this.nodes[i], this.nodes[i+1]);
        visualNodeGroup.appendChild(visualNode);
    }
    this.svgLayerGroup.appendChild(visualNodeGroup);
};

SingleLineSeriesViewer.prototype.enableNodeTrigger = function(){
    if(this.isContinual){
        return;
    }

    //draw the highlighted node.
    var highlightedNode = nodeDrawer.drawHighlightedNode(this.nodeShape, this.mcColor);
    draw.setVisibility(highlightedNode, false);
    this.svgLayerGroup.appendChild(highlightedNode);

    //draw all those node trigger zones.
    var nodeMouseOverSectionGroup = draw.createGroup();
    for (var i = 0; i < this.nodes.length; i = i + 4) {
        var nodeMouseOverSection = nodeDrawer.drawTrigger(this.nodes[i], this.nodes[i + 1],
            this.nodes[i + 2], this.nodes[i + 3]);

        nodeMouseOverSectionGroup.appendChild(nodeMouseOverSection);
    }
    this.svgTriggerGroup.appendChild(nodeMouseOverSectionGroup);

    //actually add listeners.
    var triggerControl = new TriggerControl(this.tipControl, this.seriesName, this.mcColor);
    triggerControl.enableNodeTrigger(highlightedNode, nodeMouseOverSectionGroup);
};

SingleLineSeriesViewer.prototype.enableRoutineTrace = function(){
    if(!this.isContinual){
        return;
    }

    var lineTrigger = draw.createStraightLines(this.nodes, 4, 0);
    draw.setStrokeFill(lineTrigger, this.mcColor.strokeColor, 20, "none");
    draw.setVisibility(lineTrigger, false);
    lineTrigger.setAttributeNS(null, "pointer-events", "stroke");
    this.svgTriggerGroup.appendChild(lineTrigger);

    //actually add listeners.
    var triggerControl = new TriggerControl(this.tipControl, this.seriesName, this.mcColor);
    triggerControl.enableRoutineTrace(this.htmlContainer, this.nodes, lineTrigger, this.constantInterval, this.xDrawInfo);
};


