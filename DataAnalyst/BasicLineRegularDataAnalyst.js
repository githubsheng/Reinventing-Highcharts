/**
 * Created by wangsheng on 16/6/14.
 */

function BasicLineRegularDataAnalyst(input, xAxisDataAreaLength){
    this.input = input;
    this.xAxisDataAreaLength = xAxisDataAreaLength;
}

BasicLineRegularDataAnalyst.prototype.analyze = function(){
    var maxX = null;
    var minY = null;
    var maxY = null;
    var isContinual = false;
    for(var i = 0; i < this.input.series.length; i++){
        var singleSeriesResult = this.analyzeSingleSeries(this.input.series[i][1]);

        if(maxX === null){
            maxX = singleSeriesResult.maxX;
        }

        if(minY === null){
            minY = singleSeriesResult.minY;
        } else if (minY > singleSeriesResult.minY){
            minY = singleSeriesResult.minY;
        }

        if(maxY === null){
            maxY = singleSeriesResult.maxY;
        } else if (maxY < singleSeriesResult.maxY){
            maxY = singleSeriesResult.maxY;
        }

        if(singleSeriesResult.isContinual){
            isContinual = true;//true if any series is continual, because all series are of same length.
        }

    }

    return  {
        minX: this.input.start,
        maxX: maxX,
        minY: minY,
        maxY: maxY,
        isContinual: isContinual
    };
};

BasicLineRegularDataAnalyst.prototype.analyzeSingleSeries = function(singleSeriesData){
    var minY = singleSeriesData[0];
    var maxY = singleSeriesData[0];
    var maxX = util.chooseBetween(this.input.start === undefined, 0, this.input.start) + (singleSeriesData.length - 1) * this.input.interval; //length - 1是因为从第二个元素起才开始加interval
    var maxNodeCount = singleSeriesData.length;

    for(var i = 0; i < singleSeriesData.length; i++){
        if(singleSeriesData[i] > maxY){
            maxY = singleSeriesData[i];
        }

        if(singleSeriesData[i] < minY){
            minY = singleSeriesData[i];
        }
    }

    var isContinual = dataAnalystCommons.isContinual(this.xAxisDataAreaLength, maxNodeCount);

    return  {
        maxX: maxX,
        minY: minY,
        maxY: maxY,
        isContinual: isContinual
    };
};