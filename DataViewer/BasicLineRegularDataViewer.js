/**
 * Created by wangsheng on 29/6/14.
 */
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
function BasicLineRegularDataViewer(htmlContainer, svg, svgTrigger, input, xDrawInfo, yDrawInfo, isContinual){
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
 *
 * Since this method will only be called once it is ok to define some functions inside this method.
 */
BasicLineRegularDataViewer.prototype.draw = function(){

    var svgDrawGroup = draw.createGroup();
    var svgTriggerGroup = draw.createGroup();
    var randomPicker = new RandomPicker();

    for(var i = 0; i < this.input.series.length; i++){
        var seriesName = this.input.series[i][0];
        var nodes = this.analyzeSingleSeriesData(this.input.series[i][1]);

        var sssv = new SingleLineSeriesViewer(this.htmlContainer, svgDrawGroup, svgTriggerGroup, nodes,
            randomPicker.pickNodeShape(), randomPicker.pickSeriesColor(), this.isContinual, this.input.interval, seriesName,
            new TipControl(this.htmlContainer, 7, false), this.xDrawInfo, this.yDrawInfo);
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
BasicLineRegularDataViewer.prototype.analyzeSingleSeriesData = function(singleSeriesData){
    var nodes = [];
    var interval = this.input.interval;
    var start = this.input.start;

    for(var i = 0; i < singleSeriesData.length; i++){
        var pixelX = this.xDrawInfo.startPoint + (i * interval - this.xDrawInfo.min) * this.xDrawInfo.pixelPerData;
        var pixelY = this.yDrawInfo.startPoint - (singleSeriesData[i] - this.yDrawInfo.min) * this.yDrawInfo.pixelPerData;
        nodes.push(pixelX);
        nodes.push(pixelY);
        nodes.push(start + interval * i);
        nodes.push(singleSeriesData[i]);
    }

    return nodes;
};


