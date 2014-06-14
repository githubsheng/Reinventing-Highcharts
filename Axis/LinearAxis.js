/**
 * Created by wangsheng on 4/6/14.
 */
/**
 * construct a linear x axis.
 *
 * @param length the length here does not include padding. That is, this is the part that is associated with data.
 * @param min
 * @param max
 * @param originPosition
 * @param leftPadding
 * @constructor
 */
function X_LinearAxis(svg, length, min, max, originPosition, leftPadding, rightPadding){
    this.svg = svg;
    this.originPosition = originPosition;
    this.length = length;
    this.min = min;
    this.max = max;
    this.preferredMarkPixelInterval = 100;
    this.markDataInterval = 0;
    this.markPixelInterval = 0;
    this.markPositions = [];
    this.labelPositions = [];
    this.originPosition = originPosition;
    this.leftPadding = leftPadding;
    this.rightPadding = rightPadding;
}


X_LinearAxis.prototype = new X_Axis();
X_LinearAxis.prototype.constructor = X_LinearAxis;

/**
 * creates a linear y axis. It pretty much inherit all methods from Y_Axis.
 *
 * @param length
 * @param min
 * @param max
 * @param originPosition
 * @param x_axis
 * @constructor
 */
function Y_LinearAxis(svg, length, min, max, originPosition, x_axis){
    this.svg = svg;
    this.originPosition;
    this.length = length;
    this.min = min;
    this.max = max;
    this.preferredMarkPixelInterval = 75;
    this.markDataInterval = 0;
    this.markPixelInterval = 0;
    this.originPosition = originPosition;
    this.x_axis = x_axis;

    this.markPositions = [];
    this.labelPositions = [];
}

Y_LinearAxis.prototype = new Y_Axis();
Y_LinearAxis.prototype.constructor = Y_LinearAxis;

Y_LinearAxis.prototype.draw = function(){
    this.drawMarks();
    this.drawLabels();
};