/**
 * Created by wangsheng on 12/6/14.
 */

/**
 * creates a basic category data.
 * @param categoryBasePositions     the collection of the positions of the center bottom of category columns.
 * @param multiSeriesData           input.series
 * @constructor
 */
function BasicCategoryData(categoryBasePositions, multiSeriesData){
    this.categoryBasePositions = categoryBasePositions;
    this.multiSeriesData = multiSeriesData;
}

BasicCategoryData.prototype = new Data();
BasicCategoryData.prototype.constructor = BasicCategoryData;

BasicCategoryData.prototype.draw = function(){
    
};