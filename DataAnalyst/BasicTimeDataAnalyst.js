/**
 * Created by wangsheng on 16/6/14.
 */

function BasicTimeDataAnalyst(input, xAxisDataAreaLength){
    this.input = input;
    this.xAxisDataAreaLength = xAxisDataAreaLength;
    this.results = null;
}

BasicTimeDataAnalyst.prototype.analyze = function(){
    if(this.results != null){
        return this.results;
    }

    var singleSeriesData = this.input.series[0][1];
    var minY = singleSeriesData[0];
    var maxY = singleSeriesData[0];
    var maxX = singleSeriesData.length;
    var maxNodeCount = maxX;

    for(var i = 0; i < singleSeriesData.length; i++){
        if(singleSeriesData[i] > maxY){
            maxY = singleSeriesData[i];
        }

        if(singleSeriesData[i] < minY){
            minY = singleSeriesData[i];
        }
    }

    var isContinual = false;
    if(this.xAxisDataAreaLength / maxNodeCount < 20){
        isContinual = true;
    }

    this.results = {
        maxX: maxX,
        minY: minY,
        maxY: maxY,
        isContinual: isContinual
    };

    return this.results;
};