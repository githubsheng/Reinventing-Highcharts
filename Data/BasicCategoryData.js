/**
 * Created by wangsheng on 12/6/14.
 */

/**
 * creates a basic category data.
 * @param categoryBasePositions     the collection of the positions of the center bottom of category columns.
 * @param multiSeriesData           input.series
 * @constructor
 */
function BasicCategoryData(multiSeriesData, xDrawInfo, yDrawInfo){
    this.multiSeriesData = multiSeriesData;
    this.xDrawInfo = xDrawInfo;
    this.yDrawInfo = yDrawInfo;
}

BasicCategoryData.prototype = new Data();
BasicCategoryData.prototype.constructor = BasicCategoryData;

/**
 * public method. called by the weaver to draw the columns, and also set proper event listeners on those columns
 */
BasicCategoryData.prototype.draw = function(){
    var random = new RandomPicker();
    for(var i = 0; i <  this.xDrawInfo.categoryBasePositions.length; i = i + 2){
        this.drawSingleColumn(this.xDrawInfo.categoryBasePositions[i], this.xDrawInfo.categoryBasePositions[i + 1], this.multiSeriesData[i/2][1], this.xDrawInfo.columnWidth, random);
    }
};

/**
 * method for internal use only. draws a column for a basic category chart.
 * @param categoryBasePositionX
 * @param categoryBasePositionY
 * @param singleSeriesData
 * @param columnWidth
 * @param random
 */
BasicCategoryData.prototype.drawSingleColumn = function(categoryBasePositionX, categoryBasePositionY, singleSeriesData, columnWidth,  random){
    //singleSeriesData[0] since in basic category, seriesData is an array of only one element.
    var columnPixelHeight = (singleSeriesData[0] - this.yDrawInfo.min) * this.yDrawInfo.pixelPerPoint;

    var column = draw.createRectangular(categoryBasePositionX - columnWidth/2, categoryBasePositionY - columnPixelHeight, columnWidth, columnPixelHeight);
    var color = random.pickSeriesColor();
    draw.setStrokeFill(column, color.strokeColor, 2, color.fillColor);
    this.svg.appendChild(column);
};

BasicCategoryData.prototype.drawTipTemplate = function(){
  //TODO
};

BasicCategoryData.prototype.showTip = function(){
  //TODO
};

BasicCategoryData.prototype.hideTip = function(){
    //TODO
};