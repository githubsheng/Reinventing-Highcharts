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
function BasicLineIrregularDataViewer(htmlContainer, svg, svgTrigger, input, xDrawInfo, yDrawInfo, isContinual) {
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
 * need not be called after analyze() because there is no such method in this class.
 */
BasicLineIrregularDataViewer.prototype.draw = function () {
    var tipControl = new TipControl(this.htmlContainer, 7, false);
    tipControl.createTip();

    //loop through different series
    var series = this.input.series;
    var randomPicker = new RandomPicker();

    var svgDrawGroup = draw.createGroup();
    var svgTriggerGroup = draw.createGroup();

    for(var i = 0; i < series.length; i++) {
        var singleSeriesName = series[i][0];
        var singleSeriesData = series[i][1];
        var nodes = this.analyzeSingleSeriesData(singleSeriesData);

        var mcColor = randomPicker.pickSeriesColor();
        var nodeShape = randomPicker.pickNodeShape();
        //I need to pass in the this.htmlContainer rather than a div that serves as a group because I need to
        //append the tip template to the dom in order to use its getClientBoundingRect method. And this.htmlContainer
        //is already inserted into the DOM.
        var singleLineSeriesViewer = new SingleLineSeriesViewer(this.htmlContainer, svgDrawGroup, svgTriggerGroup, nodes, nodeShape, mcColor,
            this.isContinual, false, singleSeriesName, tipControl, this.xDrawInfo, this.yDrawInfo);
        singleLineSeriesViewer.draw();
    }

    this.svg.appendChild(svgDrawGroup);
    this.svgTrigger.appendChild(svgTriggerGroup);
};


/**
 * returns an array that contains both pixel information and data information. The stride is 4 and the first 2 are pixel positions
 * while the last 2 are data information.
 * @param singleSeriesData
 * @returns {Array}
 */
BasicLineIrregularDataViewer.prototype.analyzeSingleSeriesData = function(singleSeriesData){
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
