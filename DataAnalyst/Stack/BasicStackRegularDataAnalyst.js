/**
 * Created by wangsheng on 30/6/14.
 */
function BasicStackRegularDataAnalyst(input, xAxisDataAreaLength){
    this.input = input;
    this.xAxisDataAreaLength = xAxisDataAreaLength;
}

BasicStackRegularDataAnalyst.prototype.analyze = function(){
    //initialize the minY and maxY to be 0, so that if all other values are positive, the minY is set to be 0 no matter
    //what the smallest value is. If all other values are negative, the maxY is set to be 0 no matter what the biggest value
    //is
    var minY = 0;
    var maxY = 0;

    var singleSeriesLength = this.input.series[0][1].length;


    for(var s = 0; s < singleSeriesLength; s++){
        var stackedData = 0;
        for(var i = 0; i < this.input.series.length; i++){
            stackedData = stackedData +  this.input.series[i][1][s];

            //compare the minY and maxY with data ever stacked (does not need to be final stacked value)/
            if(stackedData < minY){
                minY = stackedData;
            }

            if(stackedData > maxY){
                maxY = stackedData
            }
        }
    }

    var isContinual = dataAnalystCommons.isContinual(this.xAxisDataAreaLength, singleSeriesLength);

    var maxX = util.chooseBetween(this.input.start === undefined, 0, this.input.start) + (singleSeriesLength - 1) * this.input.interval;

    return  {
    minX: this.input.start,
    maxX: maxX,
    minY: minY,
    maxY: maxY,
    isContinual: isContinual
    };
};