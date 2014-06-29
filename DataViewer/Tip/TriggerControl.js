/**
 * Created by wangsheng on 27/6/14.
 */


function TriggerControl(tipControl, seriesName, mcColor){
    this.tipControl = tipControl;
    this.seriesName = seriesName;
    this.mcColor = mcColor;
}




TriggerControl.prototype.enableNodeTrigger = function(highlightedNode, nodeMouseOverSectionGroup){
    var isShown = false; //set the flag yeah.
    var _this = this;

    function highlightNode(pixelX, pixelY){
        if(!isShown){
            draw.setVisibility(highlightedNode, true);
            isShown = true;
        }
        draw.translate(highlightedNode, pixelX, pixelY);

    }

    function deHighlightNode(){
        if(isShown){
            draw.setVisibility(highlightedNode, false);
            isShown = false;
        }
    }

    nodeMouseOverSectionGroup.addEventListener("mouseover", function (event) {
        highlightNode(event.target.ws_pixelX, event.target.ws_pixelY);
        _this.tipControl.showTip(event.target.ws_pixelX, event.target.ws_pixelY,
            event.target.ws_dataX, event.target.ws_dataY, _this.seriesName, _this.mcColor);
        event.stopPropagation();
    });

    nodeMouseOverSectionGroup.addEventListener("mouseout", function (event) {
        deHighlightNode();
        _this.tipControl.hideTip();
        event.stopPropagation();
    });

};

TriggerControl.prototype.enableRoutineTrace = function(htmlContainer, nodes, routineGroup, constantInterval, xDrawInfo){
    var _this = this;
    var previousIdx = -1; //this idex is the stride idx. and stride idx happens to be the same of dataXarray idx.
    var mouseX = 0;
    var traceIntervalId = 0;


    //this handler has different definitions based on whether the data has constant data interval or irregular data interval
    var findAndHighLight;

    if(constantInterval !== false){
        findAndHighLight = function(){
            var mouseXinSVGcoordinates = mouseX - htmlContainer.getBoundingClientRect().left;
            var estimatedDataX = (mouseXinSVGcoordinates - xDrawInfo.startPoint)/xDrawInfo.pixelPerData + xDrawInfo.min;
            var idx = Math.round((estimatedDataX - xDrawInfo.min)/constantInterval);
            if(idx!==previousIdx){
                previousIdx = idx;
                //convert the stride idx to the idx of this.nodes element idx
                idx = idx * 4;
                _this.tipControl.showTip(nodes[idx + 0], nodes[idx + 1],
                    nodes[idx + 2], nodes[idx + 3], _this.seriesName, _this.mcColor);
            }
        };
    } else {
        //extract the dataX and make it a standalone array where stride is 1 and offset is 0.
        var dataXarray = [];
        for(var i = 0; i < nodes.length; i = i + 4){
            dataXarray.push(nodes[i + 2]); //offset is 2.
        }

        findAndHighLight = function(){
            var mouseXinSVGcoordinates = mouseX - htmlContainer.getBoundingClientRect().left;
            var estimatedDataX = (mouseXinSVGcoordinates - xDrawInfo.startPoint)/xDrawInfo.pixelPerData + xDrawInfo.min;

            //binary search, find the nearest node.
            //this idx is dataXarray idx, but when you look at how dataXarray is assembled you realize this is really
            //the stride idx of nodes.
            var idx = util.findElementIdxUsingBinarySearch(dataXarray, estimatedDataX); //the returned idx is of dataXarray
            if(idx !== previousIdx) {
                previousIdx = idx;
                //convert the stride idx to the idx of this.nodes element idx
                idx = idx * 4;
                _this.tipControl.showTip(nodes[idx + 0], nodes[idx + 1],
                    nodes[idx + 2], nodes[idx + 3], _this.seriesName, _this.mcColor);
            }
        };
    }

    //the mouse move event might be trigger like 280+ times per second.
    routineGroup.addEventListener("mousemove",  function(event){
        mouseX = event.clientX;
    });

    //but we will only do checking 5 times per second since finding the right element is computational stressful.
    routineGroup.addEventListener("mouseover",  function(event){
        //reset the previousIdx. I need to do this because if the found idx is the same as the previous idx the tip won't show up.
        previousIdx = -1;
        //update the mouse position and show the tip anyway.
        mouseX = event.clientX;
        findAndHighLight();

        //now set an interval and constantly check if the mouse move to another node.
        traceIntervalId = window.setInterval(findAndHighLight, 200);
    });

    routineGroup.addEventListener("mouseout",  function(){
        window.clearInterval(traceIntervalId);
        _this.tipControl.hideTip();
    });
};