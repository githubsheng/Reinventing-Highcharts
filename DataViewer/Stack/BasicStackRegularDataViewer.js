/**
 * Created by wangsheng on 16/6/14.
 */

/**
 * .....
 * @param htmlContainer
 * @param svg
 * @param svgTrigger
 * @param input
 * @param xDrawInfo
 * @param yDrawInfo
 * @param isContinual
 * @constructor
 */
function BasicStackRegularDataViewer(htmlContainer, svg, svgTrigger, input, xDrawInfo, yDrawInfo, isContinual){
    this.htmlContainer = htmlContainer;
    this.svg = svg;
    this.svgTrigger = svgTrigger;
    this.input = input;
    this.xDrawInfo = xDrawInfo;
    this.yDrawInfo = yDrawInfo;
    this.topTip = null;
    this.isContinual = isContinual;
}

/**
 * This method draws the data between x and y axes. And it also configure the event listener.
 */
BasicStackRegularDataViewer.prototype.draw = function(){
    var svgDrawGroup = draw.createGroup();
    var svgTriggerGroup = draw.createGroup();
    var randomPicker = new RandomPicker();
    var tipControl = new SharedTipControl(this.htmlContainer, 7);

    var seriesNames = [];
    for(var i = 0; i < this.input.series.length; i++){
        seriesNames.push(this.input.series[i][0]);
    }

    tipControl.createTip(seriesNames);//call it here after all

    //since all series are of the same length i will just use the length of the first one.
    var stackedData = new Array(this.input.series[0][1].length);
    for(var i = 0; i < stackedData.length; i++){
        stackedData[i] = 0;
    }

    //since the last drawn covers up the previous drawn, I need to store them first and then reverse the order.
    var seriesDrawInfos = [];
    for(var i = 0; i < this.input.series.length; i++){
        var seriesName = this.input.series[i][0];
        var nodes = this.analyzeSingleSeriesData(this.input.series[i][1], stackedData);
        seriesDrawInfos.push([seriesName, nodes]);
    }
    seriesDrawInfos.reverse();

    for(var i = 0; i < seriesDrawInfos.length; i++){
        var seriesName = seriesDrawInfos[i][0];
        var nodes = seriesDrawInfos[i][1];
        var sssv = new SingleStackSeriesViewer(this.htmlContainer, svgDrawGroup, svgTriggerGroup, nodes,
        randomPicker.pickNodeShape(), randomPicker.pickSeriesColor(), this.isContinual, this.input.interval, seriesName,
        tipControl, this.xDrawInfo, this.yDrawInfo, 3, false);
        sssv.draw();
    }

    this.svg.appendChild(svgDrawGroup);
    this.svgTrigger.appendChild(svgTriggerGroup);
};

/**
 * returns an array that contains both pixel information and data information. The stride is 4 and the first 2 are pixel positions
 * while the last one are data information. The third is not really needed and therefore is set to 0;
 * @param singleSeriesData
 * @returns {Array}
 */
BasicStackRegularDataViewer.prototype.analyzeSingleSeriesData = function(singleSeriesData, stackedData){
    var nodes = [];
    var interval = this.input.interval;

    for(var i = 0; i < singleSeriesData.length; i++){
        var pixelX = this.xDrawInfo.startPoint + i * interval * this.xDrawInfo.pixelPerData;
        stackedData[i] = singleSeriesData[i] + stackedData[i];
        var pixelY = this.yDrawInfo.startPoint - (stackedData[i] - this.yDrawInfo.min) * this.yDrawInfo.pixelPerData;
        nodes.push(pixelX);
        nodes.push(pixelY);
        nodes.push(this.input.start + this.input.interval * i);
        nodes.push(singleSeriesData[i]);
    }
    return nodes;
};


