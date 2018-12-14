/**
 * this class is used to find out the min max value in the data, for a category chart.
 * @param input     input data of a basic category chart
 * @constructor
 */
export function BasicCategoryDataAnalyst(input){
    this.input = input;
    this.results = null;
}

/**
 * find out the min max value in the data. the analysis result is stored in this analyst instance as `this.result`.
 * @returns {{minY: number, maxY: number, seriesNames: Array }}
 */
BasicCategoryDataAnalyst.prototype.analyze = function(){
    if(this.results !== null){
        return this.results;
    }

    let minY = 0;
    let maxY = 0;

    //loop through different series
    let series = this.input.series;
    let seriesNames = [];
    for(let i = 0; i < series.length; i++){
        seriesNames.push(series[i][0]);
        let seriesData = series[i][1];

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