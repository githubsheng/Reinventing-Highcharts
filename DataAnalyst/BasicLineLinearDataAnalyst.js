/**
 * Created by wangsheng on 31/5/14.
 */

/**
 * this implementation analyzes the data for a basic line chart that has both linear data y axis and linear data x axis.
 * @param data
 * @constructor
 */
function BasicLineLinearDataAnalyst(input){
    this.input = input;
    this.results = null;
}

BasicLineLinearDataAnalyst.prototype.analyze = function(){
    if(this.results !== null){
        return this.results;
    }

    //find the smallest & biggest value on x axis, and find the smallest & biggest value on y axis.
    var minX = 0;
    var maxX = 0;
    var minY = 0;
    var maxY = 0;

    //loop through different series
    var series = this.input.series;
    for(var i = 0; i < series.length; i++){
        var seriesData = series[i][1];
        for(var ii = 0; ii < seriesData.length; ii++){
            var point = seriesData[ii];
            if(point[0] < minX){
                minX = point[0];
            }
            if(point[0] > maxX){
                maxX = point[0];
            }
            if(point[1] < minY){
                minY = point[1];
            }
            if(point[1] > maxY){
                maxY = point[1];
            }
        }
    }

    this.results = {
        minX: minX,
        maxX: maxX,
        minY: minY,
        maxY: maxY
    };

    return this.results;
};
