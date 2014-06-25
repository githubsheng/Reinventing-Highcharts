/**
 * Created by wangsheng on 23/6/14.
 */

/**
 * Created by wangsheng on 23/6/14.
 */

function SingleLineSeriesViewer(htmlContainer, svg, nodes, nodeShape, mcColor,
                                isContinual, isRegular, seriesName, tipControl,
                                xDrawInfo, yDrawInfo){
    //this.svgSingleSeries = draw.createGroup(); inherited from parent class.
    this.htmlContainer = htmlContainer; //if use the default inherited 'showTip' method then this field must be set.
    this.svg = svg;
    this.nodes = nodes;
    this.nodeShape = nodeShape;
    this.mcColor = mcColor;
    this.isRegular = isRegular;
    this.isContinual = isContinual;
    this.seriesName = seriesName;
    this.xDrawInfo = xDrawInfo;
    this.yDrawInfo = yDrawInfo;

    var bcr = this.svg.getBoundingClientRect();
    this.svgLeft = bcr.left;
    this.svgRight = bcr.right;

    this.highlightedNode = nodeDrawer.drawHighlightedNode(nodeShape, mcColor);
    this.tipControl = tipControl;
}

SingleLineSeriesViewer.prototype = new SingleSeriesViewer();
SingleLineSeriesViewer.prototype.constructor = SingleSeriesViewer;

SingleLineSeriesViewer.prototype.draw = function(){
    this.drawLine();
    //this.drawNodes();
    this.enableRoutineTrace();
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
//    if(!this.isContinual){
//        return;
//    }

    var lineTrigger = draw.createStraightLines(this.nodes, 4, 0);
    draw.setStrokeFill(lineTrigger, this.mcColor.strokeColor, 10, "none");
    draw.setVisibility(lineTrigger, false);
    lineTrigger.setAttributeNS(null, "pointer-events", "stroke");
    this.svgSingleSeries.appendChild(lineTrigger);

    if(this.isRegular){
        var _this = this;
        lineTrigger.addEventListener("mouseover", function(event){
            var pixelX = event.clientX - _this.svgLeft;
            var dataX = Math.round((pixelX - _this.xDrawInfo.startPoint)/_this.xDrawInfo.pixelPerData);
            var dataY = _this.nodes[dataX * 4 + 2];
            var pixelY = _this.nodes[dataX * 4 + 1];
            //TODO: I need to have instant show tip function.
            _this.tipControl.showDoubleLineTip(pixelX, pixelY, dataX, dataY, _this.seriesName, _this.mcColor);
        });
    } else {
        var _this = this;
        var previousIdx = 0;
        var mouseX = 0;
        var traceIntervalId = 0;

        //extract the dataX and make it a standalone array where stride is 1 and offset is 0.
        var dataXarray = [];
        for(var i = 0; i < this.nodes.length; i = i + 4){
            dataXarray.push(this.nodes[i + 2]); //offset is 2.
        }

        function findAndHighLight(){
            //TODO: I need to have instant show tip function.
            var pixelX = mouseX - _this.svgLeft;
            var estimatedDataX = (pixelX - _this.xDrawInfo.startPoint)/_this.xDrawInfo.pixelPerData + _this.xDrawInfo.min;

            //binary search, find the nearest node.
            var idx = util.findElementIdxUsingBinarySearch(dataXarray, estimatedDataX); //the returned idx is of dataXarray
            if(idx === previousIdx) {
                return;
            } else {
                previousIdx = idx;
                //convert it to the idx of this.nodes idx
                idx = idx * 4;
                _this.tipControl.showDoubleLineTip(_this.nodes[idx + 0], _this.nodes[idx + 1],
                    _this.nodes[idx + 2], _this.nodes[idx + 3], _this.seriesName, _this.mcColor);
            }
        };

        //the mouse move event might be trigger like 280+ times per second.
        lineTrigger.addEventListener("mousemove",  function(event){
            mouseX = event.clientX;
        });

        //but we will only do checking 5 times per second since finding the right element is computational stressful.
        lineTrigger.addEventListener("mouseover",  function(){
            traceIntervalId = window.setInterval(findAndHighLight, 200);
        });

        lineTrigger.addEventListener("mouseout",  function(){
            window.clearInterval(traceIntervalId);
        });

//        lineTrigger.addEventListener("mouseout", function(event){
//            _this.tipControl.hideTip();
//        });
    }






// 87 63 52 23
//    if(this.isRegular){
//        stack.addEventListener("mousemove", function(event){
//
//            //show the tip.
//            basicTimeData.showTip(dataX, dataY, pixelX, pixelY, singleSeriesName, color, true);
//            draw.translate(visualNode, pixelX, pixelY);
//            draw.setVisibility(visualNode, true);
//        });
//
//        stack.addEventListener("mouseout", function(){
//            basicTimeData.hideTip();
//            draw.setVisibility(visualNode, false);
//        });
//
//    } else if (!this.isRegular){
//
//    }
};

