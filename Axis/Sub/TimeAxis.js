/**
 * Units: MS(milliseconds), S(second), M(minute), H(hour), D(day), MON(month), Y(year)
 *
 * preferred data interval for MS is TODO
 *
 * preferred data interval for S is 1, 2, 5, 10, 15, 30, 60, 120.
 *
 * preferred data interval for M is 1, 2, 5, 10, 15, 30, 60, 120.
 *
 * preferred data interval for H is 1, 2, 3, 6, 12, 24(1D), 48(2D), 72(3D), 96(4D), 168(7D).
 *
 * preferred data interval for D is 1, 2, 4, 7(1W), 14(1W), 28-31(1M, requires calculation of the days of that particular month..),
 * 2MON(roughly 60D), 3MON(one season, roughly 100D)
 *
 * preferred data interval for MON is 1, 2, 3(1 season), 6(half year), 12(1Y), 24(2Y), 48(4Y), 120(10Y, 1 decade).
 *
 * preferred data interval for Y is 1, 2, 3, 5, 10 或者是这些数乘以10的整数倍。
 *
 * Values bigger than the greatest data interval is not allowed. This is because with the preferred pixel interval being 100 pixels.
 * A greater data interval (than the greatest preferred) will leads to the case in which a single pixel maps to more than 1 data.
 * In this case an error should be thrown and user should told to split the data into a smaller set.
 *
 *
 * @param svg               the svg element to which we are going to append the axis
 * @param length            the length of the axis
 * @param max               this is like the end. Say you have 431 points and the unit is M(minute), then the end is 431 minutes.
 * @param originPosition    origin position
 * @param unit              should be MS, S, M, H, D, MON or Y
 * @param interval          the time interval, if interval is 5 and unit is M, then it means there is 5 minutes between each data point.
 * @constructor
 */
import {X_Axis} from "../Axis";

export function TimeAxis(svg, length, max, originPosition, unit, interval){
    this.svg = svg;
    this.originPosition = originPosition;
    this.length = length;
    this.min = 0; //this is the start
    this.max = max;
    this.preferredMarkPixelInterval = 100;
    this.markDataInterval = 0;
    this.markPixelInterval = 0;
    this.markPositions = [];
    this.labelPositions = [];
    this.originPosition = originPosition;
    this.leftPadding = 0;//left padding is 0
    this.rightPadding = 0; //right padding is also 0 in this case
    this.unit = unit;
    this.interval = interval;
}

TimeAxis.prototype = new X_Axis();
TimeAxis.prototype.constructor = TimeAxis;

/**
 * see the same method defined in Axis.js
 */
TimeAxis.prototype.adjustMarkInterval = function(){
    let dataPerPixel = (this.max - this.min) / this.length;
    let dataInterval = dataPerPixel * this.preferredMarkPixelInterval;
    let perfectDataInterval = dataInterval;

    //right now let me just simply write the code for S, M, and H
    switch(this.unit){
        case "s":
        case "m":
            this.preferredMarkDataIntervals = [1, 2, 5, 10, 15, 30, 60, 120];
            break;
        case "h":
            this.preferredMarkDataIntervals = [1, 2, 3, 6, 12, 24, 48, 72, 96, 168];
            break;
    }

    let largest = this.preferredMarkDataIntervals[this.preferredMarkDataIntervals.length - 1];
    if(dataInterval > largest){
        dataInterval = largest;
    } else {
        for(let i = 0; i < this.preferredMarkDataIntervals.length; i++){
            if(dataInterval < (this.preferredMarkDataIntervals[i] + util.pickFirstAvailable(this.preferredMarkDataIntervals[i+1], this.preferredMarkDataIntervals[i])) / 2){
                dataInterval =  this.preferredMarkDataIntervals[i];
                break;
            }
        }
    }
    this.markDataInterval = dataInterval;
    this.markPixelInterval = (dataInterval / perfectDataInterval) * this.preferredMarkPixelInterval;
};

/**
 * see the same method defined in Axis.js X_Axis.
 */
TimeAxis.prototype.drawLabels = function(){
    let labelGroup = draw.createGroup();
    let start = this.min;
    for(let i = 0; i < this.labelPositions.length; i = i + 2){
        let label = start + this.markDataInterval * i / 2; //divide i by 2 because i = i + 2 in the loop
        label = this.appendUnit(label);
        labelGroup.appendChild(draw.createText(this.labelPositions[i], this.labelPositions[i+1], label, 11, "middle", false));
    }
    this.svg.appendChild(labelGroup);
};

/**
 * depending on the unit and the data interval, this function may switch to a greater unit. For example, if the data interval is
 * 15 and the unit is m, then this function simply append letter "m" to 15 and make the label "15m". However, if the data interval
 * is 60 and the unit is m, the this function transforms "60m" to "1h" and "120m" to "2h".
 */
TimeAxis.prototype.appendUnit = function(label){
    //TODO: right now i have only implement the case in which the unit is "minute" or "second".
    switch(this.unit){
        case "s":
            if(this.markDataInterval === 60 || this.markDataInterval === 120){
                return label / 60 + "m";
            } else {
                return label + "s";
            }
        case "m":
            if(this.markDataInterval === 60 || this.markDataInterval === 120){
                return label / 60 + "h";
            } else {
                return label + "m";
            }
    }
};

/**
 * see the the same method in X_Axis  (Axis.js)
 * @returns {{startPoint: number, pixelPerData: number, min: number}}
 */
TimeAxis.prototype.analyzeReturn = function(){
    let startPoint = this.originPosition[0] + this.leftPadding;
    let pixelPerData = this.markPixelInterval / this.markDataInterval;
    let min = this.min;

    /*this is xDrawInfo*/
    return {
        startPoint: startPoint,
        length: this.length, //excluding left and right padding.
        pixelPerData: pixelPerData,
        min: min
    }
};