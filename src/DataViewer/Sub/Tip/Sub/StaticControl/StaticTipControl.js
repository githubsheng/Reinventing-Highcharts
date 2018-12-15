/**
 * manages static tool tips. please reference `TipControl` for the meaning of the parameters
 * @param htmlContainer
 * @param topShift
 * @param isSingleLine
 * @constructor
 */
import {TipControl} from "../../TipControl";

export function StaticTipControl(htmlContainer, topShift, isSingleLine){
    this.htmlContainer = htmlContainer;
    this.topShift = topShift;
    this.isSingleLine = isSingleLine;
}

StaticTipControl.prototype = new TipControl();
StaticTipControl.prototype.constructor = StaticTipControl;

StaticTipControl.prototype.createTip = function (funcCreateHtmlSingleLineTipStructure, funcCreateHtmlMultipleLineTipStructure) {
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
//    tip.style.webkitTransitionDuration = "0.3s";
//    tip.style.MozTransitionDuration = "0.3s";
//    tip.style.transitionDuration = "0.3s";
};

StaticTipControl.prototype.applyTranslationAndColor = function(pixelX, pixelY, mcColor){
    this.tip.style.display = "inline-block";

    let bcr = this.tip.getBoundingClientRect();
    let translate = "translate(" + (pixelX - bcr.width/2) + "px, " + pixelY + "px)";
    this.tip.style.MozTransform = translate;
    this.tip.style.webkitTransform = translate;
    this.tip.style.msTransform = translate;
    this.tip.style.transform = translate;

    this.tip.style.borderColor = mcColor.strokeColor;
};

StaticTipControl.prototype.hideTip = function () {
    this.hideTipImmediately();
};

StaticTipControl.prototype.hideTipImmediately = function(){
    this.tip.style.display = "none";
};