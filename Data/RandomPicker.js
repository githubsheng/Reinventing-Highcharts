/**
 * Created by wangsheng on 5/6/14.
 */

function RandomPicker(){
    this.seriesColors = ["blue", "red", "green", "orange"]; //TODO: add these "purple", "gray"
    this.currentSeriesColorIndex = 0;
    this.nodeShape = ["circle", "rectangular", "triangle", "reverse-triangle"];
    this.currentNodeShapeIndex = 0;
};

/**
 * pick a series color. it returns the elements in this.seriesColors in the array order.
 * @returns {*}
 */
RandomPicker.prototype.pickSeriesColor = function(){
    var color =  this.seriesColors[this.currentSeriesColorIndex];

    if(this.currentSeriesColorIndex === this.seriesColors.length - 1){
        this.currentSeriesColorIndex = 0;
    } else {
        this.currentSeriesColorIndex ++;
    }
    return colors[color];
};

/**
 * pick a node shape. It returns the elements in this.nodeShape in the array order
 * @returns {*}
 */
RandomPicker.prototype.pickNodeShape = function(){
    var shape = this.nodeShape[this.currentNodeShapeIndex];

    if(this.currentNodeShapeIndex === this.nodeShape.length - 1){
        this.currentNodeShapeIndex = 0;
    } else {
        this.currentNodeShapeIndex ++;
    }
    return shape;
};