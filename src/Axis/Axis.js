/**
 * Axis serves as the parent of X_Axis and Y_Axis and its prototype holds common functions shared by X_Axis and Y_Axis.
 *
 * The methods defined in these parent class uses the following properties from a child:
 * min, max, length, preferredMarkPixelInterval, markDataInterval, markPixelInterval, originPosition, leftPadding, rightPadding,
 * labelPositions, markPositions and svg
 *
 * !important. note that i can just define the above arguments here in this constructor and have the child classes call the
 * parent constructor. but this parent constructor really just does nothing. So I will just directly assign the above
 * arguments to instance property in child constructors.
 *
 * @constructor
 */
import {draw} from "../Draw/Draw";

export function Axis(){
    this.preferredMarkDataIntervals = [1, 2, 2.5, 5, 10];
}

/**
 * draw the whole axis, this method should only be called AFTER the axis is analyzed (after we figured out where to draw what)
 */
Axis.prototype.draw = function(){
    this.drawMarks();
    this.drawLabels();
};

/**
 * assume the axis is linear and calculate the interval based on min, max, preferred pixel and length values. This method
 * does not adjust min max value.
 *
 * this method is the key why we are able to get pretty intervals.
 */
Axis.prototype.adjustMarkInterval = function(){
    let dataPerPixel = (this.max - this.min) / this.length;
    let dataInterval = dataPerPixel * this.preferredMarkPixelInterval;
    let perfectDataInterval = dataInterval;

    let magnitude = Math.pow(10, Math.floor(Math.log(dataInterval) / Math.log(10)));
    dataInterval = dataInterval / magnitude;
    for(let i = 0; i < this.preferredMarkDataIntervals.length; i++){
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
export function X_Axis(){}

X_Axis.prototype = new Axis();
X_Axis.prototype.constructor = X_Axis;

/**
 * get all statuses and numbers correct.
 * @returns {{startPoint: number, pixelPerData: number, length: number, min: number}}
 */
X_Axis.prototype.analyze = function(){
    this.adjustMarkInterval();
    this.calculateMarkPositions();
    this.calculateLabelPositions();

    return this.analyzeReturn();
};

/**
 * calculate and get the information we need so that we can correctly draw the axis later
 * @returns {{startPoint: number, pixelPerData: number, length: number, min: number}}
 */
X_Axis.prototype.analyzeReturn = function(){
    let startPoint = this.originPosition[0] + this.leftPadding;
    let pixelPerData = this.markPixelInterval / this.markDataInterval;
    let min = this.min;

    return {
        startPoint: startPoint,
        pixelPerData: pixelPerData,
        length: this.length,
        min: min
    };
};


/**
 * draw the marks of the axis based on the calculated mark position
 */
X_Axis.prototype.drawMarks = function(){
    let dValue = "";
    for(let i = 0; i < this.markPositions.length; i = i + 2) {
        let x1 = this.markPositions[i];
        let y1 = this.markPositions[i + 1];
        let x2 = x1;
        let y2 = y1 + 5;
        dValue = dValue + "M" + x1 + " " + y1 + " L" + x2 + " " + y2 + " ";
    }
    dValue = dValue.trim();
    let marks = draw.createPath(dValue);
    draw.setStrokeFill(marks, "darkgray", false, false);
    this.svg.appendChild(marks);
};

/**
 * draw the labels of the axis based on the calculated label position
 */
X_Axis.prototype.drawLabels = function(){
    let labelGroup = draw.createGroup();
    let text = this.min;
    for(let i = 0; i < this.labelPositions.length; i = i + 2){
        text = util.perfectNumber(this.min + this.markDataInterval * i / 2); //divide i by 2 because i = i + 2 in the loop
        labelGroup.appendChild(draw.createText(this.labelPositions[i], this.labelPositions[i+1], text, 11, "middle", false));
    }
    this.svg.appendChild(labelGroup);
};

/**
 * calculate the mark positions. The first mark starts at origin + padding
 */
X_Axis.prototype.calculateMarkPositions = function(){
    let x = this.originPosition[0] + this.leftPadding;
    let y = this.originPosition[1];
    let currentDataPoint = this.min;
    while(currentDataPoint < this.max || currentDataPoint === this.max) {
        this.markPositions.push(x);
        this.markPositions.push(y);
        x = x + this.markPixelInterval;
        currentDataPoint = util.perfectNumber(currentDataPoint + this.markDataInterval);
    }
};

/**
 * calculate the label positions. By default the label positions are a little bit below the mark position.
 */
X_Axis.prototype.calculateLabelPositions = function(){
    for(let i = 0; i < this.markPositions.length; i = i + 2){
        this.labelPositions.push(this.markPositions[i]);
        this.labelPositions.push(this.markPositions[i + 1] + 16);
    }
};

/**
 * Construct an Y axis. The default implementation is for linear axis, that is, Y_LinearAxis. I chose this implementation because
 * most other types of axises are similar to linear axis.
 * @constructor
 */
export function Y_Axis(){}

//extends the Axis class
Y_Axis.prototype = new Axis();
Y_Axis.prototype.constructor = Y_Axis;

/**
 * get all statuses and numbers correct. we need this information to properly draw the axis
 * @returns {{startPoint: number, pixelPerData: number, min: number}}
 */
Y_Axis.prototype.analyze = function(){
    this.adjustMarkInterval();
    this.calculateMarkPositions();
    this.calculateLabelPositions();

    let startPoint = this.originPosition[1];
    let pixelPerData = this.markPixelInterval / this.markDataInterval;
    let min = this.min;

    return {
        startPoint: startPoint,
        pixelPerData: pixelPerData,
        min: min
    };
};

/**
 * adjust both mark data interval and mark pixel interval. This method also adjusts the min value and the max value.
 * We need to adjust the min and max value because sometimes the min max values are quite ugly(say, 1.372), we want to
 * make them pretty, say (1.3) or (1.2). If we want to keep the original min max value (not making them pretty looking)
 * then we can configure the `this.doNotExpandMin` and `this.doNotExpandMax` settings.
 */
Y_Axis.prototype.adjustMarkInterval = function(){
    Axis.prototype.adjustMarkInterval.apply(this);
    let min2 = util.perfectNumber(this.markDataInterval * Math.floor(this.min / this.markDataInterval));


    if(this.min === min2 && !this.doNotExpandMin){
        this.min = util.perfectNumber(this.min - this.markDataInterval);
    } else {
        this.min = min2;
    }

    let max2 = util.perfectNumber(this.markDataInterval * Math.ceil(this.max / this.markDataInterval));
    if(this.max === max2 && !this.doNotExpandMax){
        this.max = util.perfectNumber(this.max + this.markDataInterval); //so that there is always some room unoccupied at the top.
    } else {
        this.max = max2;
    }
    let numOfIntervals = (this.max - this.min) / this.markDataInterval;
    this.markPixelInterval = this.length / numOfIntervals;
};


/**
 * calculate the mark positions assuming its a linear axis.
 */
Y_Axis.prototype.calculateMarkPositions = function(){
    let x = this.originPosition[0];
    let y = this.originPosition[1];
    let currentDataPoint = this.min;
    while(currentDataPoint < this.max || currentDataPoint === this.max) {
        this.markPositions.push(x);
        this.markPositions.push(y);
        y = y - this.markPixelInterval;
        currentDataPoint = util.perfectNumber(currentDataPoint + this.markDataInterval);
    }
};

/**
 * calculate the label positions
 */
Y_Axis.prototype.calculateLabelPositions = function(){
    for(let i = 0; i < this.markPositions.length; i = i + 2){
        this.labelPositions.push(this.markPositions[i]);
        //font size = 11 and therefore moving the font downwards by 5.5 (11/2) vertically centers the text.
        this.labelPositions.push(this.markPositions[i + 1]);
    }
};

/**
 * draw all the marks. The marks are very wide, almost as wide as the chart, and run through the data section.
 */
Y_Axis.prototype.drawMarks = function(){
    let dValue = "";
    let markWidth = this.x_axis.length
        + util.pickFirstAvailable(this.x_axis.leftPadding, 0)
        + util.pickFirstAvailable(this.x_axis.rightPadding, 0);
    for(let i = 0; i < this.markPositions.length; i = i + 2) {
        let x1 = this.markPositions[i];
        let y1 = this.markPositions[i + 1];
        let x2 = x1 + markWidth;
        let y2 = y1;
        dValue = dValue + "M" + x1 + " " + y1 + " L" + x2 + " " + y2 + " ";
    }
    dValue = dValue.trim();
    let marks = draw.createPath(dValue);
    draw.setStrokeFill(marks, "darkgray", "1", "none");
    this.svg.appendChild(marks);
};

Y_Axis.prototype.drawLabels = function(){
    let text = this.min;
    for(let i = 0; i < this.labelPositions.length; i = i + 2){
        text = util.perfectNumber(this.min + this.markDataInterval * i / 2); //divide i by 2 because i = i + 2 in the loop
        this.svg.appendChild(draw.createText(this.labelPositions[i] - 10, this.labelPositions[i+1], text, "11", "end", "middle"));
    }
};





