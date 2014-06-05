/**
 * Created by wangsheng on 26/5/14.
 */

/**
 * Axis serves as the parent of X_Axis and Y_Axis and its prototype holds common functions shared by X_Axis and Y_Axis.
 *
 * @constructor
 */
function Axis(){
    this.preferredMarkDataIntervals = [1, 2, 2.5, 5, 10];
    this.svg = document.querySelector("#svg-playground");
}

/**
 * assume the axis is linear and calculate the interval based on min, max, preferred pixel and length values. This method
 * does not adjust min max value.
 */
Axis.prototype.adjustMarkInterval = function(){
    var dataPerPixel = (this.max - this.min) / this.length;
    var dataInterval = dataPerPixel * this.preferredMarkPixelInterval;
    var perfectDataInterval = dataInterval;

    var magnitude = Math.pow(10, Math.floor(Math.log(dataInterval) / Math.log(10)));
    dataInterval = dataInterval / magnitude;
    for(var i = 0; i < this.preferredMarkDataIntervals.length; i++){
        if(dataInterval < (this.preferredMarkDataIntervals[i] + util.pickFirstAvailable(this.preferredMarkDataIntervals[i+1], this.preferredMarkDataIntervals[i])) / 2){
            dataInterval =  this.preferredMarkDataIntervals[i];
            break;
        }
    }

    dataInterval = dataInterval * magnitude;
    this.markDataInterval = dataInterval;
    this.markPixelInterval = (dataInterval / perfectDataInterval) * this.preferredMarkPixelInterval;
};

/**
 * Construct an X axis. The default implementation is for linear axis, that is, X_LinearAxis. I chose this implementation because
 * most other types of axises are similar to linear axis.
 */
function X_Axis(){}

X_Axis.prototype = new Axis();
X_Axis.prototype.constructor = X_Axis;

/**
 * get all statuses and numbers correct.
 */
X_Axis.prototype.analyze = function(){
    this.adjustMarkInterval();
    this.calculateMarkPositions();
    this.calculateLabelPositions();

    var startPoint = this.originPosition[0] + this.leftPadding;
    var pixelPerData = this.markPixelInterval / this.markDataInterval;
    var min = this.min;

    return {
        startPoint: startPoint,
        pixelPerPoint: pixelPerData,
        min: min
    };
};

/**
 * draw the whole axis, this method should only be called AFTER the axis is analyzed.
 */
X_Axis.prototype.draw = function(){
    this.drawMarks();
    this.drawLabels();
};

/**
 * draw the marks of the axis based on the calculated mark position
 */
X_Axis.prototype.drawMarks = function(){
    var dValue = "";
    for(var i = 0; i < this.markPositions.length; i = i + 2) {
        var x1 = this.markPositions[i];
        var y1 = this.markPositions[i + 1];
        var x2 = x1;
        var y2 = y1 + 5;
        dValue = dValue + "M" + x1 + " " + y1 + " L" + x2 + " " + y2 + " ";
    }
    dValue = dValue.trim();
    var marks = draw.createPath(dValue);
    draw.setStrokeFill(marks, "darkgray", false, false);
    this.svg.appendChild(marks);
};

/**
 * draw the labels of the axis based on the calculated label position
 */
X_Axis.prototype.drawLabels = function(){
    var text = this.min;
    for(var i = 0; i < this.labelPositions.length; i = i + 2){
        text = this.min + this.markDataInterval * i / 2; //divide i by 2 because i = i + 2 in the loop
        this.svg.appendChild(draw.createText(this.labelPositions[i], this.labelPositions[i+1], text, 11, "middle"));
    }
};

/**
 * calculate the mark positions. The first mark starts at origin + padding
 */
X_Axis.prototype.calculateMarkPositions = function(){
    var x = this.originPosition[0] + this.leftPadding;
    var y = this.originPosition[1];
    var currentDataPoint = this.min;
    while(currentDataPoint < this.max || currentDataPoint === this.max) {
        this.markPositions.push(x);
        this.markPositions.push(y);
        x = x + this.markPixelInterval;
        currentDataPoint = currentDataPoint + this.markDataInterval;
    }
};

/**
 * calculate the label positions. By default the label positions are a little bit below the mark position.
 */
X_Axis.prototype.calculateLabelPositions = function(){
    for(var i = 0; i < this.markPositions.length; i = i + 2){
        this.labelPositions.push(this.markPositions[i]);
        this.labelPositions.push(this.markPositions[i + 1] + 16);
    }
};

/**
 * Construct an Y axis. The default implementation is for linear axis, that is, Y_LinearAxis. I chose this implementation because
 * most other types of axises are similar to linear axis.
 * @constructor
 */
function Y_Axis(){}

Y_Axis.prototype = new Axis();
Y_Axis.prototype.constructor = Y_Axis;

/**
 * get all statuses and numbers correct.
 */
Y_Axis.prototype.analyze = function(){
    this.adjustMarkInterval();
    this.calculateMarkPositions();
    this.calculateLabelPositions();

    var startPoint = this.originPosition[1];
    var pixelPerData = this.markPixelInterval / this.markDataInterval;
    var min = this.min;
    var max = this.max;

    return {
        startPoint: startPoint,
        pixelPerPoint: pixelPerData,
        min: min
    };
};

/**
 * draw the Y axis. This implementation draws a linear Y axis and if you are drawing some other type of axises then you should
 * either ovveride this method or override the methods it calls. This method needs to be called AFTER analyze();
 */
Y_Axis.prototype.draw = function(){
    this.drawAxisBone();
    this.drawMarks();
    this.drawLabels();
};

/**
 * adjust both mark data interval and mark pixel interval.
 */
Y_Axis.prototype.adjustMarkInterval = function(){
    Axis.prototype.adjustMarkInterval.apply(this);
    this.min = this.markDataInterval * Math.floor(this.min / this.markDataInterval);
    this.max = this.markDataInterval * Math.ceil(this.max / this.markDataInterval);
    var numOfIntervals = (this.max - this.min) / this.markDataInterval;
    this.markPixelInterval = this.length / numOfIntervals;
};

/**
 * draws the backbone of the axis, that is, the long long vertical line where marks reside.
 */
Y_Axis.prototype.drawAxisBone = function(){
    var x1 = this.originPosition[0];
    var y1 = this.originPosition[1];
    var x2 = x1;
    var y2 = y1 - this.length;
    this.svg.appendChild(draw.createStraightLine(x1, y1, x2, y2));
};

/**
 * calculate the mark positions assuming its a linear axis.
 */
Y_Axis.prototype.calculateMarkPositions = function(){
    var x = this.originPosition[0];
    var y = this.originPosition[1];
    var currentDataPoint = this.min;
    while(currentDataPoint < this.max || currentDataPoint === this.max) {
        this.markPositions.push(x);
        this.markPositions.push(y);
        y = y - this.markPixelInterval;
        currentDataPoint = currentDataPoint + this.markDataInterval;
    }
};

/**
 * calculate the label positions
 */
Y_Axis.prototype.calculateLabelPositions = function(){
    for(var i = 0; i < this.markPositions.length; i = i + 2){
        this.labelPositions.push(this.markPositions[i]);
        //font size = 11 and therefore moving the font downwards by 5.5 (11/2) vertically centers the text.
        this.labelPositions.push(this.markPositions[i + 1] + 5.5);
    }
};

/**
 * draw all the marks. The marks are very wide, almost as wide as the chart, and run through the data section.
 */
Y_Axis.prototype.drawMarks = function(){
    var dValue = "";
    var markWidth = this.x_axis.length + util.pickFirstAvailable(this.x_axis.leftPadding, 0)
        + util.pickFirstAvailable(this.x_axis.rightPadding, 0);
    for(var i = 0; i < this.markPositions.length; i = i + 2) {
        var x1 = this.markPositions[i];
        var y1 = this.markPositions[i + 1];
        var x2 = x1 + markWidth;
        var y2 = y1;
        dValue = dValue + "M" + x1 + " " + y1 + " L" + x2 + " " + y2 + " ";
    }
    dValue = dValue.trim();
    var marks = draw.createPath(dValue);
    draw.setStrokeFill(marks, "darkgray", "1", "none");
    this.svg.appendChild(marks);
};

Y_Axis.prototype.drawLabels = function(){
    var text = this.min;
    for(var i = 0; i < this.labelPositions.length; i = i + 2){
        text = this.min + this.markDataInterval * i / 2; //divide i by 2 because i = i + 2 in the loop
        this.svg.appendChild(draw.createText(this.labelPositions[i] - 10, this.labelPositions[i+1], text, "11", "end"));
    }
};





