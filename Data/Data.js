/**
 * Created by wangsheng on 1/6/14.
 */

/**
 * Implements some methods that are shared across many different Data types.
 * @constructor
 */
function Data(){
}

/**
 * @param isSingleLine      if this is true then the series name, x lable, and y value will are be displayed in the same line.
 * draw the topTip template.
 */
Data.prototype.drawTopTipTemplate = function(topTipShift, isSingleLine){
    var group = draw.createGroup();
    draw.setVisibility(group, false);
    var talkBubble = this.drawTopTipTemplate_talkBubble(topTipShift, group);
    var text = this.drawTopTipTemplate_text(topTipShift, group, isSingleLine);
    this.svg.appendChild(group);

    this.topTip = {
        group: group,
        text: text,
        talkBubble: talkBubble,
        isSingleLine: isSingleLine
    }
};

/**
 * component to draw the topTip template. This method is only supposed to be used inside drawTopTipTemplate()
 * @param shift  shift the bubble talk a little bit.
 * @param group
 * @returns {SVGElement}
 */
Data.prototype.drawTopTipTemplate_talkBubble = function (shift, group){
    //catw = change according to width
    var dArray = [0, -shift, -5, -5-shift, -10/*catw*/, -5-shift, -10/*catw*/, -40-shift, 10/*catw*/, -40-shift, 10/*catw*/, -5-shift, 5, -5-shift, 5, -5-shift];
    var d = "M" + dArray.join(" ") + "Z";
    var talkBubble  = draw.createPath(d);
    draw.setStrokeFill(talkBubble, "#0080C3", 2, "white");
    group.appendChild(talkBubble);
    //add the d values to the talkBubble.
    talkBubble.dArray = dArray;
    return talkBubble;
};

/**
 * component to draw the topTip template. This method is only supposed to be used inside drawTopTipTemplate()
 * @param shift             see method drawTopTipTemplate_talkBubble
 * @param group             creates the text svg element and then put it inside this group.
 * @param isSingleLine      if this is true then the series name, x lable, and y value will are be displayed in the same line.
 * @returns {SVGELement}
 */
Data.prototype.drawTopTipTemplate_text = function (shift, group, isSingleLine){
    var text;

    if(isSingleLine){
        text = draw.createText(0, -22.5-shift, false, 12, "start", "middle");
    } else {
        text = draw.createText(0, -25-shift, false, 12, "start", false);
    }

    var series = draw.createTextSpan(false, false, "null", 15, "start", false);
    text.ws_seriesName = series;
    text.appendChild(series);

    var valuesLabel;
    if(isSingleLine){
        valuesLabel = draw.createTextSpan(false, false, "null", 12, "start", false);
    } else {
        valuesLabel = draw.createTextSpan(0, -10-shift, "null", 12, "start", false);
    }
    text.ws_valuesLabel = valuesLabel;

    var valuesData = draw.createTextSpan(false, false, "null", 12, "start", false);
    valuesData.setAttributeNS(null, "font-weight", "bold");
    text.ws_valuesData = valuesData;
    text.appendChild(valuesLabel);
    text.appendChild(valuesData);
    group.appendChild(text);
    return text;
};


/**
 * put the text that tells the data into the talk bubble.
 * @param dataX
 * @param dataY
 * @param seriesName
 * @returns width of the text.
 */
Data.prototype.showTopTip_configureText = function(dataX, dataY, seriesName){
    //change the text content accordingly.
    this.topTip.text.ws_seriesName.textContent = seriesName;
    if(dataX){
        this.topTip.text.ws_valuesLabel.textContent = dataX + " - ";
    } else {
        this.topTip.text.ws_valuesLabel.textContent = " - ";
    }
    this.topTip.text.ws_valuesData.textContent = dataY;

    //center the text.
    var width = this.topTip.text.getBBox().width;
    this.topTip.text.setAttributeNS(null, "x", (-width/2).toString());

    if(!this.topTip.isSingleLine){
        this.topTip.text.ws_valuesLabel.setAttributeNS(null, "x", (-width/2).toString()); //value lable needs to be aligned to the left.
    }
    return width;
};

Data.prototype.showTopTip = function(dataX, dataY, pixelX, pixelY, seriesName){
    var width = this.showTopTip_configureText(dataX, dataY, seriesName);

    //change the size of the talk bubble.
    var dArray = this.topTip.talkBubble.dArray;
    dArray[4] = dArray[6] = -10 - (width / 2); //adjust the coordinates of the left edge.
    dArray[8] = dArray[10] = 10 + (width / 2); //adjust the coordinates of the right edge.

    //shift the talk bubble left or right if there is not enough room to display it.
    var distance = dArray[4] + pixelX - this.xDrawInfo.chartDisplayLeftEdgeX;
    if(distance < 0) {
        dArray[4] = dArray[6] = dArray[4] - distance; //distance is negative...
        dArray[8] = dArray[10] = dArray[8] - distance;
        this.topTip.text.setAttributeNS(null, "x", (-width/2 - distance).toString());
        this.topTip.text.ws_valuesLabel.setAttributeNS(null, "x", (-width/2 - distance).toString());
    }
    distance = dArray[8] + pixelX - this.xDrawInfo.chartDisplayRightEdgeX;
    if(distance > 0){
        dArray[4] = dArray[6] = dArray[4] - distance;
        dArray[8] = dArray[10] = dArray[8] - distance;
        this.topTip.text.setAttributeNS(null, "x", (-width/2 - distance).toString());
        this.topTip.text.ws_valuesLabel.setAttributeNS(null, "x", (-width/2 - distance).toString());
    }

    var d = "M" + dArray.join(" ") + "Z";
    this.topTip.talkBubble.setAttributeNS(null, "d", d);

    return this.topTip;
};

/**
 *
 * @param isSingleLine      if this is true then the series name, x lable, and y value will are be displayed in the same line.
 */
Data.prototype.drawLeftTipTemplate = function(isSingleLine){
    var group = draw.createGroup();
    draw.setVisibility(group, false);

    //draw the talk bubble.
    //cw = change width
    //ch = change height
    var dArray = [10, 0, 15, -5, 15, -17.5, 35/*cw*/, -17.5, 35/*cw*/, 17.5/*ch*/, 15, 17.5/*ch*/, 15, 5];
    var d = "M" + dArray.join(" ") + "Z";
    var talkBubble = draw.createPath(d);
    draw.setStrokeFill(talkBubble, "black", "1", "white");
    talkBubble.dArray = dArray;
    group.appendChild(talkBubble);

    var text;
    if(isSingleLine){
        text = draw.createText(25, 0, false, 12, "middle", "middle");
    } else {
        text = draw.createText(25, -2.5, false, 12, "middle", false);
    }

    var series = draw.createTextSpan(false, false, "null", 15, "start", false);
    text.ws_seriesName = series;
    text.appendChild(series);

    var valuesLabel;
    if(isSingleLine){
        valuesLabel = draw.createTextSpan(false, false, "null", 12, "start", false);
    } else {
        valuesLabel = draw.createTextSpan(25, 12.5, "null", 12, "start", false);
    }

    text.ws_valuesLabel = valuesLabel;
    var valuesData = draw.createTextSpan(false, false, "null", 12, "start", false);
    valuesData.setAttributeNS(null, "font-weight", "bold");
    text.ws_valuesData = valuesData;
    text.appendChild(valuesLabel);
    text.appendChild(valuesData);

    group.appendChild(text);
    this.svg.appendChild(group);

    this.leftTip = {
        group: group,
        text: text,
        talkBubble: talkBubble
    };
};

Data.prototype.showLeftTip = function(dataX, dataY, pixelX, pixelY, seriesName){
    this.leftTip.text.ws_seriesName.textContent = seriesName;
    if(dataX){
        this.leftTip.text.ws_valuesLabel.textContent = dataX + " - ";
    } else {
        this.leftTip.text.ws_valuesLabel.textContent = " - ";
    }
    this.leftTip.text.ws_valuesData.textContent = dataY;

    var width = this.leftTip.text.getBBox().width;
    var dArray = this.leftTip.talkBubble.dArray;
    dArray[6] = dArray[8] = 35 + width;
    this.leftTip.talkBubble.setAttributeNS(null, "d", "M" + dArray.join(" ") + "Z");

    draw.translate(this.leftTip.group, pixelX, pixelY);
    return this.leftTip;
};

Data.prototype.drawRightTipTemplate = function(isSingleLine){
    var group = draw.createGroup();
    draw.setVisibility(group, false);

    //draw the talk bubble.
    //cw = change width
    //ch = change height
    var dArray = [-10, 0, -15, -5, -15, -17.5, -35/*cw*/, -17.5, -35/*cw*/, 17.5/*ch*/, -15, 17.5/*ch*/, -15, 5];
    var d = "M" + dArray.join(" ") + "Z";
    var talkBubble = draw.createPath(d);
    draw.setStrokeFill(talkBubble, "black", "1", "white");
    talkBubble.dArray = dArray;
    group.appendChild(talkBubble);


    var text;
    if(isSingleLine){
        text = draw.createText(-25, 0, false, 12, "end", "middle");
    } else {
        text = draw.createText(-25, -2.5, false, 12, "end", false);
    }

    var series = draw.createTextSpan(false, false, "null", 15, "end", false);
    text.ws_seriesName = series;
    text.appendChild(series);

    var valuesLabel;
    if(isSingleLine){
        valuesLabel = draw.createTextSpan(false, false, "null", 12, "end", false);
    } else {
        valuesLabel = draw.createTextSpan(-25, 12.5, "null", 12, "end", false);
    }

    text.ws_valuesLabel = valuesLabel;
    var valuesData = draw.createTextSpan(false, false, "null", 12, "end", false);
    valuesData.setAttributeNS(null, "font-weight", "bold");
    text.ws_valuesData = valuesData;
    text.appendChild(valuesLabel);
    text.appendChild(valuesData);

    group.appendChild(text);
    this.svg.appendChild(group);

    this.rightTip = {
        group: group,
        text: text,
        talkBubble: talkBubble
    };
};

Data.prototype.showRightTip = function(dataX, dataY, pixelX, pixelY, seriesName){
    this.rightTip.text.ws_seriesName.textContent = seriesName;
    if(dataX){
        this.rightTip.text.ws_valuesLabel.textContent = dataX + " - ";
    } else {
        this.rightTip.text.ws_valuesLabel.textContent = " - ";
    }
    this.rightTip.text.ws_valuesData.textContent = dataY;

    var width = this.rightTip.text.getBBox().width;
    var dArray = this.rightTip.talkBubble.dArray;
    dArray[6] = dArray[8] = -35 - width;
    this.rightTip.talkBubble.setAttributeNS(null, "d", "M" + dArray.join(" ") + "Z");

    draw.translate(this.rightTip.group, pixelX, pixelY);
    return this.rightTip;
};

/**
 *
 * @param topTipShift       this parameter shift the top tip a little bit.
 * @param isSingleLine      if this is true then the series name, x lable, and y value will are be displayed in the same line.
 */
Data.prototype.drawTipTemplate = function(topTipShift, isSingleLine){
    this.drawTopTipTemplate(topTipShift, isSingleLine);
    this.drawLeftTipTemplate(isSingleLine);
    this.drawRightTipTemplate(isSingleLine);
};

/**
 * show the tip. This type of tip is the typical type that a basic line linear chart uses.
 * @param dataX
 * @param dataY
 * @param pixelX
 * @param pixelY
 */
Data.prototype.showTip = function(dataX, dataY, pixelX, pixelY, seriesName, color){
    var tip;
    //test if top tip would work.
    var dArray = this.topTip.talkBubble.dArray;
    if(dArray[7] + pixelY < this.yDrawInfo.chartDisplayTopEdgeY){
        //switch to left tip or right tip if there is not enough room to display the tip at the top.
        if(pixelX > this.xDrawInfo.chartMiddleLineX){
            tip = this.showRightTip(dataX, dataY, pixelX, pixelY, seriesName);
        } else {
            tip = this.showLeftTip(dataX, dataY, pixelX, pixelY, seriesName);
        }

    } else {
        tip = this.showTopTip(dataX, dataY, pixelX, pixelY, seriesName);
    }

    //change the outline color of the talk bubble.
    draw.setStrokeFill(tip.talkBubble, color.strokeColor, false, false);

    //translate the whole group so that it sits above the target node.
    draw.translate(tip.group, pixelX, pixelY);
    draw.setVisibility(tip.group, true);
};

/**
 * hide the tip.
 */
Data.prototype.hideTip = function(){
    draw.setVisibility(this.topTip.group, false);
    draw.setVisibility(this.leftTip.group, false);
    draw.setVisibility(this.rightTip.group, false);
};