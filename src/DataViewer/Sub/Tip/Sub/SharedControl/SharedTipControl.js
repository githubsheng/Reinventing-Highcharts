/**
 * a tool tip shared by multiple series. mainly used in stack chart.
 * please reference `TipControl` for the meaning of the parameters
 * @param htmlContainer
 * @param topShift
 * @constructor
 */
import {SharedSeriesInfo} from "./SharedSeriesInfo";
import {TipControl} from "../../TipControl";

export function SharedTipControl(htmlContainer, topShift){
    this.htmlContainer = htmlContainer;
    this.topShift = topShift;
    this.isSingleLine = false; //since it is shared, there are multiple series that need to display themselves.
    this.sharedSeriesInfo = new SharedSeriesInfo();
}

SharedTipControl.prototype = new TipControl();
SharedTipControl.prototype.constructor = SharedTipControl;

/**
 *
 * @param seriesNames an array.
 */
SharedTipControl.prototype.createTip = function(seriesNames){
    function funcCreateHtmlSingleLineTipStructure(tip){
        //is never going to be called.
    }

    function funcCreateHtmlMultipleLineTipStructure(tip){
        let dataXslot = document.createTextNode("null")
        tip.appendChild(dataXslot);//slot for x axis value.
        tip.ws_dataXslot = dataXslot;
        tip.ws_dataYslots = [];
        for(let i = 0; i < seriesNames.length; i++){
            let div = document.createElement("div");
            tip.appendChild(div);
            let seriesNameSpan = document.createElement("span");
            div.appendChild(seriesNameSpan);
            seriesNameSpan.appendChild(document.createTextNode(seriesNames[i]));
            div.appendChild(document.createTextNode(" -- "));
            let dataSpan = document.createElement("span");
            div.appendChild(dataSpan);
            let dataYslot= document.createTextNode("null");
            dataSpan.appendChild(dataYslot);
            tip.ws_dataYslots.push(dataYslot);
        }
    }

    TipControl.prototype.createTip.call(this, funcCreateHtmlSingleLineTipStructure, funcCreateHtmlMultipleLineTipStructure);
};

SharedTipControl.prototype.showSingleLineTip = function () {
    //never going to get called.
};

SharedTipControl.prototype.showDoubleLineTip = function(pixelX, pixelY, sharedSeriesInfoRegisterIdx, nodesStrideIdx){
    //change the text.
    let mcColor = this.sharedSeriesInfo.getSeriesMCcolor(sharedSeriesInfoRegisterIdx);
    let dataX = this.sharedSeriesInfo.getDataX(sharedSeriesInfoRegisterIdx, nodesStrideIdx);

    this.tip.ws_dataXslot.nodeValue = dataX;

    for (let i = 0; i < this.tip.ws_dataYslots.length; i++){
        this.tip.ws_dataYslots[i].nodeValue = this.sharedSeriesInfo.getDataY(i, nodesStrideIdx);
    }

    this.applyTranslationAndColor(pixelX, pixelY, mcColor);
};