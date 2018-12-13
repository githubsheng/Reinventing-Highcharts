/**
 * construct a linear x axis.
 * @param svg               svg element
 * @param length            the length here does not include padding. That is, this is the part that is associated with data.
 * @param min               original min value on the axis
 * @param max               original max value on the axis
 * @param originPosition    the position of the origin (of the cartesian system)
 * @param leftPadding       left padding of the x axis
 * @param rightPadding      right padding of the x axis
 * @constructor
 */
function X_LinearAxis(svg, length, min, max, originPosition, leftPadding, rightPadding){
    this.leftPadding = leftPadding;
    this.rightPadding = rightPadding;
    this.svg = svg;
    this.originPosition = originPosition;
    this.length = length - leftPadding - rightPadding;
    this.min = min;
    this.max = max;
    this.preferredMarkPixelInterval = 100;
    this.markDataInterval = 0;
    this.markPixelInterval = 0;
    this.markPositions = [];
    this.labelPositions = [];
    this.originPosition = originPosition;
}

//extends x axis
X_LinearAxis.prototype = new X_Axis();
X_LinearAxis.prototype.constructor = X_LinearAxis;

/**
 * creates a linear y axis. It pretty much inherit all methods from Y_Axis.
 *
 * @param svg               svg element
 * @param length            the length here does not include padding. That is, this is the part that is associated with data.
 * @param min               original min value on the axis
 * @param max               original max value on the axis
 * @param originPosition    the position of the origin (of the cartesian system)
 * @param x_axis            the related x axis. this is needed as we sometimes need to draw marks across the chart (parallel to x axis)
 * @param doNotExpandMin    if true, it will not make the min value to look pretty
 * @param doNotExpandMax    if true, it will not make the max value to look pretty.
 * @constructor
 */
function Y_LinearAxis(svg, length, min, max, originPosition, x_axis, doNotExpandMin, doNotExpandMax){
    this.svg = svg;
    this.originPosition = originPosition;
    this.length = length;
    this.min = min;
    this.max = max;
    this.preferredMarkPixelInterval = 75;
    this.markDataInterval = 0;
    this.markPixelInterval = 0;
    this.originPosition = originPosition;
    this.x_axis = x_axis;
    this.doNotExpandMin = doNotExpandMin;
    this.doNotExpandMax = doNotExpandMax;

    this.markPositions = [];
    this.labelPositions = [];
}

Y_LinearAxis.prototype = new Y_Axis();
Y_LinearAxis.prototype.constructor = Y_LinearAxis;

/**
 * draw the y linear axis
 */
Y_LinearAxis.prototype.draw = function(){
    this.drawMarks();
    this.drawLabels();
};