/**
 * Created by wangsheng on 23/6/14.
 */

/**
 * Created by wangsheng on 23/6/14.
 */

function SingleLineSeriesViewer(htmlContainer, svg, nodes, nodeShape, mcColor, isContinual, seriesName, tipControl){
    //this.svgSingleSeries = draw.createGroup(); inherited from parent class.
    this.htmlContainer = htmlContainer; //if use the default inherited 'showTip' method then this field must be set.
    this.svg = svg;
    this.nodes = nodes;
    this.nodeShape = nodeShape;
    this.mcColor = mcColor;
    this.isContinual = isContinual;
    this.seriesName = seriesName;
    this.highlightedNode = nodeDrawer.drawHighlightedNode(nodeShape, mcColor);
    this.tipControl = tipControl;
}

SingleLineSeriesViewer.prototype = new SingleSeriesViewer();
SingleLineSeriesViewer.prototype.constructor = SingleSeriesViewer;

SingleLineSeriesViewer.prototype.draw = function(){
    this.drawLine();
    this.drawNodes();
    this.svg.appendChild(this.svgSingleSeries);
};

SingleLineSeriesViewer.prototype.drawLine = function(){
    var lines = draw.createStraightLines(this.nodes, 4, 0);
    draw.setStrokeFill(lines, this.mcColor.strokeColor, 2, "none");
    this.svgSingleSeries.appendChild(lines);
};

SingleLineSeriesViewer.prototype.drawNodes = function(){
    if(this.isContinual){
        return;
    }

    var visualNodeGroup = draw.createGroup();
    var nodeMouseOverSectionGroup = draw.createGroup();

    for (var i = 0; i < this.nodes.length; i = i + 4) {
        //this is the one that users see
        var visualNode = nodeDrawer.draw(this.nodeShape, this.mcColor, this.nodes[i], this.nodes[i+1]);
        var nodeMouseOverSection = nodeDrawer.drawTrigger(visualNode, this.nodes[i], this.nodes[i + 1],
            this.nodes[i + 2], this.nodes[i + 3]);

        visualNodeGroup.appendChild(visualNode);
        nodeMouseOverSectionGroup.appendChild(nodeMouseOverSection);
    }

    this.enableNodeTrigger(nodeMouseOverSectionGroup);

    //these three methods needs to be called exactly by this order.
    this.svgSingleSeries.appendChild(visualNodeGroup);
    this.drawHighlightedNode();
    this.svgSingleSeries.appendChild(nodeMouseOverSectionGroup);
};

/**
 * This is supposed to be called after visualNodeGroup is appended and before nodeMouseOverSectionGroup is appended.
 * By doing this the highlighted node is above the original visual node, but is under the trigger(so that the trigger still works)
 */
SingleLineSeriesViewer.prototype.drawHighlightedNode = function(){
    draw.setVisibility(this.highlightedNode, false);
    this.highlightedNode.ws_isShown = false; //set the flag yeah.
    this.svgSingleSeries.appendChild(this.highlightedNode);
};

SingleLineSeriesViewer.prototype.enableNodeTrigger = function(nodeMouseOverSectionGroup){
    var _this = this;
    nodeMouseOverSectionGroup.addEventListener("mouseover", function (event) {
        _this.highlightNode(event.target.ws_pixelX, event.target.ws_pixelY, _this.seriesName, _this.mcColor);
        _this.tipControl.showDoubleLineTip(event.target.ws_pixelX, event.target.ws_pixelY,
            event.target.ws_dataX, event.target.ws_dataY, _this.seriesName, _this.mcColor);
        event.stopPropagation();
    });

    nodeMouseOverSectionGroup.addEventListener("mouseout", function (event) {
        _this.deHighlightNode();
        _this.tipControl.hideTip();
        event.stopPropagation();
    });
};

SingleLineSeriesViewer.prototype.highlightNode = function(pixelX, pixelY){
    if(!this.highlightedNode.ws_isShown){
        draw.setVisibility(this.highlightedNode, true);
        this.highlightedNode.ws_isShown = true;
    }
    draw.translate(this.highlightedNode, pixelX, pixelY);
};

SingleLineSeriesViewer.prototype.deHighlightNode = function(){
    if(!this.highlightedNode.ws_isShown){
        return;
    } else {
        draw.setVisibility(this.highlightedNode, false);
        this.highlightedNode.ws_isShown = false;
    }
};

SingleLineSeriesViewer.prototype.enableRoutineTrace = function(){

};

