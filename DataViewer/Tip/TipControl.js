/**
 * Created by wangsheng on 24/6/14.
 */

function TipControl(htmlContainer, topShift, isSingleLine){
    this.tip = null;
    this.hideTipTimeout = 0;
    this.isShown = false;
    this.isSingleLine= isSingleLine;
    this.createTip(htmlContainer, topShift, isSingleLine);
}

TipControl.prototype.createTip = function (htmlContainer, topShift, isSingleLine) {
    //draw the tip at origin 0 0 and do the top shift.
    var tip = document.createElement("div");
    this.tip = tip;

    if(!isSingleLine){
        tip.appendChild(document.createTextNode("null"));//slot for series name
        tip.appendChild(document.createElement("br"));
        tip.appendChild(document.createTextNode("null")); //slot for data.

    } else {
        var seriesNameSpan = document.createElement("span");
        tip.appendChild(seriesNameSpan);
        seriesNameSpan.appendChild(document.createTextNode("null"));

        var dataSpan = document.createElement("span");
        tip.appendChild(dataSpan);
        dataSpan.appendChild(document.createTextNode("null"));
    }

    tip.setAttribute("class", "mc-tip");

    //after appending the div to document I can then safely call getBoundingClientRect
    htmlContainer.appendChild(tip);
    var bcr = tip.getBoundingClientRect();
    tip.style.marginTop = (-bcr.height - 2 - topShift) + "px";
    tip.style.borderColor = "black";
    tip.style.display = "none";
};


TipControl.prototype.showTip = function(pixelX, pixelY, dataX, dataY, seriesName, mcColor){
    if(this.isSingleLine){
        this.showSingleLineTip(pixelX, pixelY, dataX, dataY, seriesName, mcColor);
    } else {
        this.showDoubleLineTip(pixelX, pixelY, dataX, dataY, seriesName, mcColor);
    }
};

TipControl.prototype.showSingleLineTip = function (pixelX, pixelY, dataX, dataY, seriesName, mcColor) {
    //change the text.
    this.tip.childNodes[0].childNodes[0].nodeValue = seriesName;
    this.tip.childNodes[1].childNodes[0].nodeValue = dataY;
    this.applyTranslationAndColor(pixelX, pixelY, mcColor);
};

TipControl.prototype.showDoubleLineTip = function(pixelX, pixelY, dataX, dataY, seriesName, mcColor){
    //change the text.
    this.tip.childNodes[0].nodeValue = seriesName;
    this.tip.childNodes[2].nodeValue = dataX + " -- " + dataY;
    this.applyTranslationAndColor(pixelX, pixelY, mcColor);
};

TipControl.prototype.applyTranslationAndColor = function(pixelX, pixelY, mcColor){
    //clear hideTip.
    if(this.hideTipTimeout !== 0){
        window.clearTimeout(this.hideTipTimeout);
    }

    if(!this.isShown){
        this.isShown = true;
        if(this.tip.style.transition !== undefined){
            this.tip.style.transition = "none";
        } else if(this.tip.style.WebkitTransition !== undefined){
            this.tip.style.WebkitTransition = "none";
        }
        this.tip.style.display = "inline-block";
    } else {
        if(this.tip.style.transition !== undefined){
            this.tip.style.transition = "all 0.3s";
        } else if(this.tip.style.WebkitTransition !== undefined){
            this.tip.style.WebkitTransition = "all 0.3s";
        }
    }

    var bcr = this.tip.getBoundingClientRect();
    if(this.tip.style.MozTransform !== undefined){
        this.tip.style.MozTransform = "translate(" + (pixelX - bcr.width/2) + "px, " + pixelY + "px)";
    } else if(this.tip.style.webkitTransform !== undefined){
        this.tip.style.webkitTransform = "translate(" + (pixelX - bcr.width/2) + "px, " + pixelY + "px)";
    } else if(this.tip.style.msTransform !== undefined){
        this.tip.style.msTransform = "translate(" + (pixelX - bcr.width/2) + "px, " + pixelY + "px)";
    } else if(this.tip.style.transform !== undefined){
        this.tip.style.transform = "translate(" + (pixelX - bcr.width/2) + "px, " + pixelY + "px)";
    }

    this.tip.style.borderColor = mcColor.strokeColor;
};

TipControl.prototype.hideTip = function () {
    var _this = this;

    if(this.hideTipTimeout !== 0){
        window.clearTimeout(this.hideTipTimeout);
    }

    this.hideTipTimeout = window.setTimeout(function(){
       _this.isShown = false;
       _this.tip.style.display = "none";
       _this.hideTipTimeout = 0;
    }, 1000);
};
