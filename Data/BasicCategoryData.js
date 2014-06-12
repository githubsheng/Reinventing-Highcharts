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

BasicCategoryData.prototype.draw = function(){
    for(var i = 0; i <  this.xDrawInfo.categoryBasePositions.length; i = i + 2){
        this.drawSingleColumn(this.xDrawInfo.categoryBasePositions[i], this.xDrawInfo.categoryBasePositions[i + 1], this.multiSeriesData[i/2][1]);
    }
};

BasicCategoryData.prototype.drawSingleColumn = function(categoryBasePositionX, categoryBasePositionY, singleSeriesData){
    //singleSeriesData[0] since in basic category, seriesData is an array of only one element.
    var columnPixelHeight = (singleSeriesData[0] - this.yDrawInfo.min) * this.yDrawInfo.pixelPerPoint;

    //TODO: make the column width dynamic. right now it is fixed to be 20;
    var column = draw.createRectangular(categoryBasePositionX - 10, categoryBasePositionY - columnPixelHeight, 20, columnPixelHeight);
    draw.setStrokeFill(column, false, false, "red");
    this.svg.appendChild(column);
};