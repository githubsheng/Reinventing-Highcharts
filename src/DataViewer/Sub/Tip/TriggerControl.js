/**
 * this class is used to enable the tool tips. it mainly adds various of event listeners. these
 * listeners use tip control to display / move / style / hide the tool tips.
 * @param tipControl        tip control
 * @param seriesName        name of the series
 * @param mcColor           color of the tool tip
 * @constructor
 */
import {draw} from "../../../Draw/Draw";
import {util} from "../../../Util/Util";

export function TriggerControl(tipControl, seriesName, mcColor){
    this.tipControl = tipControl;
    this.seriesName = seriesName;
    this.mcColor = mcColor;
    this.sharedSeriesInfo = this.tipControl.sharedSeriesInfo;
}

/**
 * enable tool tip for a column
 * @param columnTrigger
 * @param htmlContainer
 * @param seriesName
 * @param mcColor
 * @param nodes
 */
TriggerControl.prototype.enableColumnTrigger = function(columnTrigger, htmlContainer, seriesName, mcColor, nodes){
    let _this = this;
    //register this thing first.
    let sharedSeriesInfo = this.sharedSeriesInfo;
    let sharedSeriesInfoRegisterIdx = sharedSeriesInfo.registerSingleSeries(seriesName, mcColor, null, nodes);

    columnTrigger.addEventListener("mouseover", function(event){
        let pixelX = _this.sharedSeriesInfo.getPixelX(sharedSeriesInfoRegisterIdx, 0);
        let pixelY = event.clientY - htmlContainer.getBoundingClientRect().top;
        _this.tipControl.showTip(pixelX, pixelY, sharedSeriesInfoRegisterIdx, 0);
        event.stopPropagation();
    });

    columnTrigger.addEventListener("mouseout", function(event){
        _this.tipControl.hideTip();
        event.stopPropagation();
    });
};

/**
 * This method requires the target has the following property:
 * 1. ws_nodesStrideIdx
 * @param nodeMouseOverSectionGroup     but really it can be of any shape, a column, a node
 * @param seriesName
 * @param mcColor
 * @param highlightedNode               this method activates(translates it into proper position and show it) this 'highlightedNode'.
 * @param nodes
 */
TriggerControl.prototype.enableNodeTrigger = function(nodeMouseOverSectionGroup, seriesName, mcColor, highlightedNode, nodes){
    //register this thing first.
    let sharedSeriesInfo = this.sharedSeriesInfo;
    let sharedSeriesInfoRegisterIdx = sharedSeriesInfo.registerSingleSeries(seriesName, mcColor, highlightedNode, nodes);
    let _this = this;

    let isShown = false; //set the flag yeah.
    function highlightNode(pixelX, pixelY) {
        if (!isShown) {
            draw.setVisibility(highlightedNode, true);
            isShown = true;
        }
        draw.translate(highlightedNode, pixelX, pixelY);
    }

    function deHighlightNode() {
       if (isShown) {
           draw.setVisibility(highlightedNode, false);
           isShown = false;
       }
    }
    nodeMouseOverSectionGroup.addEventListener("mouseover", function (event) {
        let pixelX = sharedSeriesInfo.getPixelX(sharedSeriesInfoRegisterIdx, event.target.ws_nodesStrideIdx);
        let pixelY = sharedSeriesInfo.getPixelY(sharedSeriesInfoRegisterIdx, event.target.ws_nodesStrideIdx);
        highlightNode(pixelX, pixelY);
        _this.tipControl.showTip(pixelX, pixelY, sharedSeriesInfoRegisterIdx, event.target.ws_nodesStrideIdx);
        event.stopPropagation();
    });

    nodeMouseOverSectionGroup.addEventListener("mouseout", function (event) {
        deHighlightNode();
        _this.tipControl.hideTip();
        event.stopPropagation();
    });

};

/**
 * enable tool tip for a routine (ie. a line, most likely not straight )
 * @param htmlContainer     to which we will append the tool tip element
 * @param seriesName
 * @param mcColor
 * @param nodes
 * @param routineGroup
 * @param constantInterval
 * @param xDrawInfo
 */
TriggerControl.prototype.enableRoutineTrace = function(htmlContainer, seriesName, mcColor, nodes, routineGroup, constantInterval, xDrawInfo){
    //register this thing first.
    let sharedSeriesInfo = this.sharedSeriesInfo;
    let sharedSeriesInfoRegisterIdx = sharedSeriesInfo.registerSingleSeries(seriesName, mcColor, null, nodes);

    let _this = this;
    let previousIdx = -1; //this idex is the stride idx. and stride idx happens to be the same of dataXarray idx.
    let mouseX = 0;
    let traceIntervalId = 0;

    //this handler has different definitions based on whether the data has constant data interval or irregular data interval
    let findAndHighLight;

    if(constantInterval !== false){
        findAndHighLight = function(){
            let mouseXinSVGcoordinates = mouseX - htmlContainer.getBoundingClientRect().left;
            let estimatedDataX = (mouseXinSVGcoordinates - xDrawInfo.startPoint)/xDrawInfo.pixelPerData + xDrawInfo.min;
            let strideIdx = Math.round((estimatedDataX - xDrawInfo.min)/constantInterval);
            if(strideIdx!==previousIdx){
                previousIdx = strideIdx;
                let pixelX = _this.sharedSeriesInfo.getPixelX(sharedSeriesInfoRegisterIdx, strideIdx);
                let pixelY = _this.sharedSeriesInfo.getPixelY(sharedSeriesInfoRegisterIdx, strideIdx);
//                highlightNode(pixelX, pixelY);
                _this.tipControl.showTip(pixelX, pixelY, sharedSeriesInfoRegisterIdx, strideIdx);
            }
        };
    } else {
        //extract the dataX and make it a standalone array where stride is 1 and offset is 0.
        let dataXarray = [];
        for(let i = 0; i < nodes.length; i = i + 4){
            dataXarray.push(nodes[i + 2]); //offset is 2.
        }

        findAndHighLight = function(){
            let mouseXinSVGcoordinates = mouseX - htmlContainer.getBoundingClientRect().left;
            let estimatedDataX = (mouseXinSVGcoordinates - xDrawInfo.startPoint)/xDrawInfo.pixelPerData + xDrawInfo.min;

            //binary search, find the nearest node.
            let strideIdx = util.findElementIdxUsingBinarySearch(dataXarray, estimatedDataX); //the returned strideIdx is of dataXarray
            if(strideIdx !== previousIdx) {
                previousIdx = strideIdx;
                let pixelX = _this.sharedSeriesInfo.getPixelX(sharedSeriesInfoRegisterIdx, strideIdx);
                let pixelY = _this.sharedSeriesInfo.getPixelY(sharedSeriesInfoRegisterIdx, strideIdx);
//                highlightedNode(pixelX, pixelY);
                _this.tipControl.showTip(pixelX, pixelY, sharedSeriesInfoRegisterIdx, strideIdx);
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
//        deHighlightNode();
        _this.tipControl.hideTip();
    });
};