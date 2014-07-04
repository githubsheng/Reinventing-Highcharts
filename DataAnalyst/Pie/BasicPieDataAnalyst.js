/**
 * Created by wangsheng on 4/7/14.
 */
function BasicPieDataAnalyst(input){
    this.input = input;
}

BasicPieDataAnalyst.prototype.analyze = function(){
    var total = 0;
    for(var i = 0; i < this.input.series.length; i++){
        total = total + this.input.series[i][1];
    }

    return {
        total: total
    }
};
