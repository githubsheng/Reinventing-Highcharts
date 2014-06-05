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
function BasicLineData(input, xDrawInfo, yDrawInfo) {
    this.input = input;
    this.xDrawInfo = xDrawInfo;
    this.yDrawInfo = yDrawInfo;
    this.tip = null;
}

BasicLineData.prototype = new LineData();
BasicLineData.constructor = BasicLineData;


/**
 * need not be called after analyze() because there is no such method in this class.
 */
BasicLineData.prototype.draw = function () {
    //loop through different series
    var series = this.input.series;
    var randomPicker = new RandomPicker();
    for(var i = 0; i < series.length; i++) {
        var singleSeriesName = series[i][0];
        var singleSeriesData = series[i][1];
        var nodes = this.analyzeSingleSeriersData(singleSeriesData);

        var color = randomPicker.pickSeriesColor();
        var nodeShape = randomPicker.pickNodeShape();
        this.drawLines(nodes, color);
        this.drawNodesAndConfigureTip(nodeShape, color, singleSeriesName, nodes);
    }
    this.drawTipTemplate();
};

/**
 * called in draw() method. This method draws the nodes and set up proper action listeners for each single series.
 * @param nodeShape
 * @param nodeColor
 * @param singleSeriesName
 * @param nodes
 */
BasicLineData.prototype.drawNodesAndConfigureTip = function(nodeShape, nodeColor, singleSeriesName, nodes){
    var basicLineData = this;

    for (var i = 0; i < nodes.length; i = i + 4) {

        var visualNode = visualNodeDrawer.draw(nodeShape, nodeColor, nodes[i], nodes[i+1]);//this is the one that users see

        var nodeMouseoverSection = draw.createCircle(nodes[i], nodes[i + 1], 10); //this is the part that triggers things.
        draw.setStrokeFill(nodeMouseoverSection, false, false, "rgba(0,0,0,0)");
        nodeMouseoverSection.ws_visualNode = visualNode;
        nodeMouseoverSection.ws_pixelX = nodes[i];
        nodeMouseoverSection.ws_pixelY = nodes[i + 1];
        nodeMouseoverSection.ws_dataX = nodes[i + 2];
        nodeMouseoverSection.ws_dataY = nodes[i + 3];
        nodeMouseoverSection.ws_nodeShape = nodeShape;
        nodeMouseoverSection.addEventListener("mouseover", function () {
            visualNodeDrawer.highlightNode(this.ws_visualNode, this.ws_nodeShape, this.ws_pixelX, this.ws_pixelY);
            basicLineData.showTip(this.ws_dataX, this.ws_dataY, this.ws_pixelX, this.ws_pixelY, singleSeriesName, nodeColor);
        });

        nodeMouseoverSection.addEventListener("mouseout", function () {
            visualNodeDrawer.deHighLightNode(this.ws_visualNode, this.ws_nodeShape, this.ws_pixelX, this.ws_pixelY);
            basicLineData.hideTip();
        });
        this.svg.appendChild(visualNode);
        this.svg.appendChild(nodeMouseoverSection);
    }
};

/**
 * returns an array that contains both pixel information and data information. The stride is 4 and the first 2 are pixel positions
 * while the last 2 are data information.
 * @param singleSeriesData
 * @returns {Array}
 */
BasicLineData.prototype.analyzeSingleSeriersData = function(singleSeriesData){
    var nodes = []; //reset it to empty array.

    for (var ii = 0; ii < singleSeriesData.length; ii++) {
        var x = this.xDrawInfo.startPoint + (singleSeriesData[ii][0] - this.xDrawInfo.min) * this.xDrawInfo.pixelPerPoint;
        var y = this.yDrawInfo.startPoint - (singleSeriesData[ii][1] - this.yDrawInfo.min) * this.yDrawInfo.pixelPerPoint;

        nodes.push(x);
        nodes.push(y);
        nodes.push(singleSeriesData[ii][0]);
        nodes.push(singleSeriesData[ii][1]);
    }

    return nodes;
};
