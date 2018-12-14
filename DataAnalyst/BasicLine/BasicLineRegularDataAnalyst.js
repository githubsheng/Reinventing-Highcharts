/**
 * this implementation analyzes the data for a basic line chart that has both linear data y axis and linear data x axis.
 * @param input                 the input that carries data belonging to different series.
 * @param xAxisDataAreaLength   the area where we are going to display the data (using node), if the area is too small,
 *                              we will display a continual line, otherwise we will display a node for each of the data point
 * @constructor
 */
import {dataAnalystCommons} from "../DataAnalystCommons";

export function BasicLineRegularDataAnalyst(input, xAxisDataAreaLength){
    this.input = input;
    this.xAxisDataAreaLength = xAxisDataAreaLength;
}

/**
 * find the min max in all series' data, also find if we need to draw a continual line to represent the data,
 * or do we need to draw each node for each data point, depending on how much space we have.
 * @returns {{minX: number, maxX: number, minY: number, maxY: number, isContinual: (boolean)}}
 */
BasicLineRegularDataAnalyst.prototype.analyze = function(){
    let maxX = null;
    let minY = null;
    let maxY = null;
    let isContinual = false;
    for(let i = 0; i < this.input.series.length; i++){
        let singleSeriesResult = this.analyzeSingleSeries(this.input.series[i][1]);

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

/**
 * find the min max in a single serie's data, also find if we need to draw a continual line to represent the data,
 * or do we need to draw each node for each data point, depending on how much space we have.
 * @returns {{maxX: number, minY: number, maxY: number, isContinual: (boolean)}}
 */
BasicLineRegularDataAnalyst.prototype.analyzeSingleSeries = function(singleSeriesData){
    let minY = singleSeriesData[0];
    let maxY = singleSeriesData[0];
    let maxX = util.chooseBetween(this.input.start === undefined, 0, this.input.start) + (singleSeriesData.length - 1) * this.input.interval; //length - 1是因为从第二个元素起才开始加interval
    let maxNodeCount = singleSeriesData.length;

    for(let i = 0; i < singleSeriesData.length; i++){
        if(singleSeriesData[i] > maxY){
            maxY = singleSeriesData[i];
        }

        if(singleSeriesData[i] < minY){
            minY = singleSeriesData[i];
        }
    }

    let isContinual = dataAnalystCommons.isContinual(this.xAxisDataAreaLength, maxNodeCount);

    return  {
        maxX: maxX,
        minY: minY,
        maxY: maxY,
        isContinual: isContinual
    };
};