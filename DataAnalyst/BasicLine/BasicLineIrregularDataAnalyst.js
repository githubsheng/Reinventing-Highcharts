/**
 * this implementation analyzes the data for a basic line chart that has both linear data y axis and linear data x axis.
 * @param input                 the input that carries data belonging to different series.
 * @param xAxisDataAreaLength   the area where we are going to display the data (using node), if the area is too small,
 *                              we will display a continual line, otherwise we will display a node for each of the data point
 * @constructor
 */
function BasicLineIrregularDataAnalyst(input, xAxisDataAreaLength){
    this.input = input;
    this.xAxisDataAreaLength = xAxisDataAreaLength;
}

/**
 * find the min max in all series' data, also find if we need to draw a continual line to represent the data,
 * or do we need to draw each node for each data point, depending on how much space we have.
 * @returns {{minX: number, maxX: number, minY: number, maxY: number, isContinual: (boolean)}}
 */
BasicLineIrregularDataAnalyst.prototype.analyze = function(){
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

    var isContinual = dataAnalystCommons.isContinual(this.xAxisDataAreaLength, maxNodeCount);

    return {
        minX: minX,
        maxX: maxX,
        minY: minY,
        maxY: maxY,
        isContinual: isContinual
    };
};
