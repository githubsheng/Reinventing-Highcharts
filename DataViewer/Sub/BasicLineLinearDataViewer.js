/**
 * Created by wangsheng on 4/6/14.
 */

/**
 * construct a basic line linear data.
 * @param data
 * @param xDrawInfo
 * @param yDrawInfo
 * @constructor
 */
function BasicLineLinearDataViewer(htmlContainer, svg, input, xDrawInfo, yDrawInfo, isContinual) {
    this.htmlContainer = htmlContainer;
    this.svg = svg;
    this.input = input;
    this.xDrawInfo = xDrawInfo;
    this.yDrawInfo = yDrawInfo;
    this.topTip = null;
    this.isContinual = isContinual;
}

BasicLineLinearDataViewer.prototype = new DataViewer();
BasicLineLinearDataViewer.constructor = BasicLineLinearDataViewer;


/**
 * need not be called after analyze() because there is no such method in this class.
 */
BasicLineLinearDataViewer.prototype.draw = function () {
    var tipControl = new TipControl(this.htmlContainer, 7, false);

    //loop through different series
    var series = this.input.series;
    var randomPicker = new RandomPicker();
    for(var i = 0; i < series.length; i++) {
        var singleSeriesName = series[i][0];
        var singleSeriesData = series[i][1];
        var nodes = this.analyzeSingleSeriesData(singleSeriesData);

        var mcColor = randomPicker.pickSeriesColor();
        var nodeShape = randomPicker.pickNodeShape();
        var singleLineSeriesViewer = new SingleLineSeriesViewer(this.htmlContainer, this.svg, nodes, nodeShape, mcColor, this.isContinual, singleSeriesName, tipControl);
        singleLineSeriesViewer.draw();
    }
};


/**
 * returns an array that contains both pixel information and data information. The stride is 4 and the first 2 are pixel positions
 * while the last 2 are data information.
 * @param singleSeriesData
 * @returns {Array}
 */
BasicLineLinearDataViewer.prototype.analyzeSingleSeriesData = function(singleSeriesData){
    var nodes = []; //reset it to empty array.

    for (var ii = 0; ii < singleSeriesData.length; ii++) {
        var x = this.xDrawInfo.startPoint + (singleSeriesData[ii][0] - this.xDrawInfo.min) * this.xDrawInfo.pixelPerData;
        var y = this.yDrawInfo.startPoint - (singleSeriesData[ii][1] - this.yDrawInfo.min) * this.yDrawInfo.pixelPerData;

        nodes.push(x);
        nodes.push(y);
        nodes.push(singleSeriesData[ii][0]);
        nodes.push(singleSeriesData[ii][1]);
    }
    return nodes;
};
