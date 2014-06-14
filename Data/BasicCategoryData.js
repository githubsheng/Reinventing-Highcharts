/**
 * Created by wangsheng on 12/6/14.
 */

/**
 * creates a basic category data.
 * @param categoryBasePositions     the collection of the positions of the center bottom of category columns.
 * @param multiSeriesData           input.series
 * @constructor
 */
function BasicCategoryData(svg, multiSeriesData, xDrawInfo, yDrawInfo){
    this.svg = svg;
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
        this.drawSingleColumnAndConfigureEventListener(this.xDrawInfo.categoryBasePositions[i], this.xDrawInfo.categoryBasePositions[i + 1], this.multiSeriesData[i/2], this.xDrawInfo.columnWidth, random);
    }



    this.drawTipTemplate(3, true);
};

/**
 * method for internal use only. draws a column for a basic category chart.
 * @param categoryBasePositionX
 * @param categoryBasePositionY
 * @param singleSeries
 * @param columnWidth
 * @param random
 */
BasicCategoryData.prototype.drawSingleColumnAndConfigureEventListener = function(categoryBasePositionX, categoryBasePositionY, singleSeries, columnWidth,  random){
    //singleSeriesData[0] since in basic category, seriesData is an array of only one element.
    var columnPixelHeight = (singleSeries[1][0] - this.yDrawInfo.min) * this.yDrawInfo.pixelPerPoint;

    //creates that visual column
    var column = draw.createRectangular(categoryBasePositionX - columnWidth/2, categoryBasePositionY - columnPixelHeight, columnWidth, columnPixelHeight);
    var color = random.pickSeriesColor();
    draw.setStrokeFill(column, color.strokeColor, 2, color.fillColor);

    var basicCategoryData = this;
    //set the event listeners
    column.addEventListener("mouseover", function(){
        basicCategoryData.showTip(false, singleSeries[1][0],
            categoryBasePositionX, categoryBasePositionY - columnPixelHeight,
            singleSeries[0], color);
    });

    column.addEventListener("mouseleave", function(){
        basicCategoryData.hideTip();
    });

    this.svg.appendChild(column);
};