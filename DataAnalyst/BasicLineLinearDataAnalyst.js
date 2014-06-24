/**
 * Created by wangsheng on 31/5/14.
 */

/**
 * this implementation analyzes the data for a basic line chart that has both linear data y axis and linear data x axis.
 * @param data
 * @param the length of x axis, excluding left and right padding.
 * @constructor
 */
function BasicLineLinearDataAnalyst(input, xAxisDataAreaLength){
    this.input = input;
    this.xAxisDataAreaLength = xAxisDataAreaLength;
    this.results = null;
}

BasicLineLinearDataAnalyst.prototype.analyze = function(){
    if(this.results !== null){
        return this.results;
    }
    var series = this.input.series;
    //find the smallest & biggest value on x axis, and find the smallest & biggest value on y axis.
    var minX = series[0][1][1][0]; //first piece of data's x
    var maxX = series[0][1][1][0];
    var minY = series[0][1][1][1];
    var maxY = series[0][1][1][1];
    var maxNodeCount = 0;

    //loop through different series
    for(var i = 0; i < series.length; i++){
        var singleSeriesData = series[i][1];
        for(var ii = 0; ii < singleSeriesData.length; ii++){
            var point = singleSeriesData[ii];
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

        if(singleSeriesData.length > maxNodeCount){
            maxNodeCount = singleSeriesData.length;
        }
    }

    var isContinual = false;
    if(this.xAxisDataAreaLength / maxNodeCount < 20){
        isContinual = true;
    }

    this.results = {
        minX: minX,
        maxX: maxX,
        minY: minY,
        maxY: maxY,
        isContinual: isContinual
    };

    return this.results;
};
