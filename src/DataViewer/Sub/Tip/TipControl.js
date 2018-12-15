/**
 * this class is responsible for creating and managing all the tool tips
 * @param htmlContainer     the html container to which the tool tips will be appended
 * @param topShift          how much do we want to shift the tooltip upwards
 * @param isSingleLine      if tool tip content contains only a single line.
 * @constructor
 */
import {SharedSeriesInfo} from "./Sub/SharedControl/SharedSeriesInfo";

export function TipControl(htmlContainer, topShift, isSingleLine){
    this.tip = null;
    this.hideTipTimeout = 0;
    this.isShown = false;
    this.isSingleLine= isSingleLine;
    this.htmlContainer = htmlContainer;
    this.topShift = topShift;
    this.sharedSeriesInfo = new SharedSeriesInfo();
}

/**
 * create the tip (html element) and configure its style properly
 * @param funcCreateHtmlSingleLineTipStructure      accepts a parameter (which is a div) and inserts html elements inside this div to form a tip template. If null or undefined then the method will use its default setting.
 * @param funcCreateHtmlMultipleLineTipStructure     accepts a parameter (which is a div) and inserts html elements inside this div to form a tip template. If null or undefined then the method will use its default setting.
 */
TipControl.prototype.createTip = function (funcCreateHtmlSingleLineTipStructure, funcCreateHtmlMultipleLineTipStructure) {
    //draw the tip at origin 0 0 and do the top shift.
    let tip = document.createElement("div");
    this.tip = tip;

    if(this.isSingleLine){
        if(funcCreateHtmlSingleLineTipStructure !== null && funcCreateHtmlSingleLineTipStructure !== undefined){
            funcCreateHtmlSingleLineTipStructure(tip);
        } else {
            let seriesNameSpan = document.createElement("span");
            tip.appendChild(seriesNameSpan);
            seriesNameSpan.appendChild(document.createTextNode("null"));
            tip.appendChild(document.createTextNode(" -- "));
            let dataSpan = document.createElement("span");
            tip.appendChild(dataSpan);
            dataSpan.appendChild(document.createTextNode("null"));
        }

    } else {
        if(funcCreateHtmlMultipleLineTipStructure !== null && funcCreateHtmlMultipleLineTipStructure !== undefined){
            funcCreateHtmlMultipleLineTipStructure(tip);
        } else {
            tip.appendChild(document.createTextNode("null"));//slot for series name
            tip.appendChild(document.createElement("br"));
            tip.appendChild(document.createTextNode("null")); //slot for data.
        }
    }

    tip.setAttribute("class", "mc-tip");

    //after appending the div to document I can then safely call getBoundingClientRect
    this.htmlContainer.appendChild(tip);
    let bcr = tip.getBoundingClientRect();
    tip.style.marginTop = (-bcr.height - 2 - this.topShift) + "px";
    tip.style.borderColor = "black";
    tip.style.display = "none";
    tip.style.webkitTransitionDuration = "0.3s";
    tip.style.MozTransitionDuration = "0.3s";
    tip.style.transitionDuration = "0.3s";
};


TipControl.prototype.showTip = function(pixelX, pixelY, sharedSeriesInfoRegisterIdx, nodesStrideIdx){
    if(this.isSingleLine){
        this.showSingleLineTip(pixelX, pixelY, sharedSeriesInfoRegisterIdx, nodesStrideIdx);
    } else {
        this.showDoubleLineTip(pixelX, pixelY, sharedSeriesInfoRegisterIdx, nodesStrideIdx);
    }
};

TipControl.prototype.showSingleLineTip = function (pixelX, pixelY, sharedSeriesInfoRegisterIdx, nodesStrideIdx) {
    //change the text.
    let seriesName = this.sharedSeriesInfo.getSeriesName(sharedSeriesInfoRegisterIdx);
    let mcColor = this.sharedSeriesInfo.getSeriesMCcolor(sharedSeriesInfoRegisterIdx);
    let dataY = this.sharedSeriesInfo.getDataY(sharedSeriesInfoRegisterIdx, nodesStrideIdx);

    this.genericShowTip(pixelX, pixelY, seriesName, mcColor, 0, dataY);
};

TipControl.prototype.showDoubleLineTip = function(pixelX, pixelY, sharedSeriesInfoRegisterIdx, nodesStrideIdx){
    //change the text.
    let seriesName = this.sharedSeriesInfo.getSeriesName(sharedSeriesInfoRegisterIdx);
    let mcColor = this.sharedSeriesInfo.getSeriesMCcolor(sharedSeriesInfoRegisterIdx);
    let dataX = this.sharedSeriesInfo.getDataX(sharedSeriesInfoRegisterIdx, nodesStrideIdx);
    let dataY = this.sharedSeriesInfo.getDataY(sharedSeriesInfoRegisterIdx, nodesStrideIdx);

    this.genericShowDoubleLineTip(pixelX, pixelY, seriesName, mcColor, dataX, dataY);
};

TipControl.prototype.genericShowTip = function(pixelX, pixelY, seriesName, mcColor, dataX, dataY){
    if(this.isSingleLine){
        this.genericShowSingleLineTip(pixelX, pixelY, seriesName, mcColor, dataY);
    } else {
        this.genericShowDoubleLineTip(pixelX, pixelY, seriesName, mcColor, dataX, dataY);
    }
};

TipControl.prototype.genericShowSingleLineTip = function(pixelX, pixelY, seriesName, mcColor, dataY){
    this.tip.childNodes[0].childNodes[0].nodeValue = seriesName;
    this.tip.childNodes[2].childNodes[0].nodeValue = dataY;
    this.applyTranslationAndColor(pixelX, pixelY, mcColor);
};

TipControl.prototype.genericShowDoubleLineTip = function(pixelX, pixelY, seriesName, mcColor, dataX, dataY){
    this.tip.childNodes[0].nodeValue = seriesName;
    this.tip.childNodes[2].nodeValue = dataX + " -- " + dataY;
    this.applyTranslationAndColor(pixelX, pixelY, mcColor);
};

TipControl.prototype.genericShowDoubleLineTipDataYOnly = function(pixelX, pixelY, seriesName, mcColor, dataY){
    this.tip.childNodes[0].nodeValue = seriesName;
    this.tip.childNodes[2].nodeValue = dataY;
    this.applyTranslationAndColor(pixelX, pixelY, mcColor);
};

TipControl.prototype.applyTranslationAndColor = function(pixelX, pixelY, mcColor){
    //clear hideTip.
    if(this.hideTipTimeout !== 0){
        window.clearTimeout(this.hideTipTimeout);
    }

    if(!this.isShown){
        this.isShown = true;
        this.tip.style.webkitTransitionProperty = "none";
        this.tip.style.MozTransitionProperty = "none";
        this.tip.style.transitionProperty = "none";
        this.tip.style.display = "inline-block";
    } else {
        this.tip.style.webkitTransitionProperty = "-webkit-transform";
        this.tip.style.MozTransitionProperty = "-moz-transform";
        this.tip.style.transitionProperty = "transform";
    }

    let bcr = this.tip.getBoundingClientRect();
    let translate = "translate(" + (pixelX - bcr.width/2) + "px, " + pixelY + "px)";
    this.tip.style.MozTransform = translate;
    this.tip.style.webkitTransform = translate;
    this.tip.style.msTransform = translate;
    this.tip.style.transform = translate;


    this.tip.style.borderColor = mcColor.strokeColor;
};

TipControl.prototype.hideTip = function () {
    let _this = this;

    if(this.hideTipTimeout !== 0){
        window.clearTimeout(this.hideTipTimeout);
    }

    this.hideTipTimeout = window.setTimeout(function(){
       _this.isShown = false;
       _this.tip.style.display = "none";
       _this.hideTipTimeout = 0;
    }, 1000);
};

TipControl.prototype.hideTipImmediately = function(){
    if(this.hideTipTimeout !== 0){
        window.clearTimeout(this.hideTipTimeout);
    }

    this.isShown = false;
    this.tip.style.display = "none";
    this.hideTipTimeout = 0;
};

