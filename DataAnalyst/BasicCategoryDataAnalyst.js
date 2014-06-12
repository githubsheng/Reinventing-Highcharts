/**
 * Created by wangsheng on 11/6/14.
 */

function BasicCateogryDataAnalyst(input){
    this.input = input;
    this.results = null;
}

BasicCateogryDataAnalyst.prototype.analyze = function(){
    if(this.results !== null){
        return this.results;
    }

    var minY = 0;
    var maxY = 0;

    //loop through different series
    var series = this.input.series;
    var seriesNames = [];
    for(var i = 0; i < series.length; i++){
        seriesNames.push(series[i][0]);
        var seriesData = series[i][1];

        if(seriesData < minY){
            minY = seriesData;
        }

        if(seriesData > maxY){
            maxY = seriesData;
        }
    }

    this.results = {
        minY: minY,
        maxY: maxY,
        seriesNames: seriesNames
    };

    return this.results;
};