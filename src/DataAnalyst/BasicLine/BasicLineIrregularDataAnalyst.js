import {dataAnalystCommons} from "../DataAnalystCommons";

/**
 * this implementation analyzes the data for a basic line chart that has both linear data y axis and linear data x axis.
 * @param input                 the input that carries data belonging to different series.
 * @param xAxisDataAreaLength   the area where we are going to display the data (using node), if the area is too small,
 *                              we will display a continual line, otherwise we will display a node for each of the data point
 * @constructor
 */
export function BasicLineIrregularDataAnalyst(input, xAxisDataAreaLength){
    this.input = input;
    this.xAxisDataAreaLength = xAxisDataAreaLength;
}

/**
 * find the min max in all series' data, also find if we need to draw a continual line to represent the data,
 * or do we need to draw each node for each data point, depending on how much space we have.
 * @returns {{minX: number, maxX: number, minY: number, maxY: number, isContinual: (boolean)}}
 */
BasicLineIrregularDataAnalyst.prototype.analyze = function(){
    let series = this.input.series;
    //find the smallest & biggest value on x axis, and find the smallest & biggest value on y axis.
    let minX = series[0][1][1][0]; //first piece of data's x
    let maxX = series[0][1][1][0];
    let minY = series[0][1][1][1];
    let maxY = series[0][1][1][1];
    let maxNodeCount = 0;

    //loop through different series
    for(let i = 0; i < series.length; i++){
        let singleSeriesData = series[i][1];
        for(let ii = 0; ii < singleSeriesData.length; ii++){
            let point = singleSeriesData[ii];
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

    let isContinual = dataAnalystCommons.isContinual(this.xAxisDataAreaLength, maxNodeCount);

    return {
        minX: minX,
        maxX: maxX,
        minY: minY,
        maxY: maxY,
        isContinual: isContinual
    };
};
