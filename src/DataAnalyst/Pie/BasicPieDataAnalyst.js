/**
 * this class analyze the input data of a pie chart
 * @param input     input data of a pie chart
 * @constructor
 */
export function BasicPieDataAnalyst(input){
    this.input = input;
}

/**
 * finds the total of all series' value
 * @returns {{total: number}}
 */
BasicPieDataAnalyst.prototype.analyze = function(){
    let total = 0;
    for(let i = 0; i < this.input.series.length; i++){
        total = total + this.input.series[i][1];
    }

    return {
        total: total
    }
};
