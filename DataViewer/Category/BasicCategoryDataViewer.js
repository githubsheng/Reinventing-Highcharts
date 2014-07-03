/**
 * Created by wangsheng on 12/6/14.
 */

/**
 *
 * @param htmlContainer
 * @param svg
 * @param svgTrigger
 * @param input
 * @param xDrawInfo
 * @param yDrawInfo
 * @constructor
 */
function BasicCategoryDataViewer(htmlContainer, svg, svgTrigger, input, xDrawInfo, yDrawInfo){
    this.htmlContainer = htmlContainer;
    this.svg = svg;
    this.svgTrigger = svgTrigger;
    this.input = input;
    this.xDrawInfo = xDrawInfo;
    this.yDrawInfo = yDrawInfo;
}

/**
 * public method. called by the weaver to draw the columns, and also set proper event listeners on those columns
 */
BasicCategoryDataViewer.prototype.draw = function(){
    var random = new RandomPicker();
    var svgGroup = draw.createGroup();
    var svgTriggerGroup = draw.createGroup();
    var tipControl = new TipControl(this.htmlContainer, 7, true);
    tipControl.createTip();

    for(var i = 0; i <  this.xDrawInfo.categoryBasePositions.length; i = i + 2){
        //in this case the nodes array will contain only one node. This is because a basic column series will only have one data.
        var nodes = [this.xDrawInfo.categoryBasePositions[i]/*pixelX*/, this.xDrawInfo.categoryBasePositions[i+1],
        0/*dataX, does not matter here*/, this.input.series[i/2][1]];

        var seriesName = this.input.series[i/2][0];

        var scv = new SingleColumnViewer();

        scv.draw(nodes[0], nodes[1], this.xDrawInfo.columnWidth, seriesName, nodes[3], random.pickSeriesColor(), nodes, svgGroup, svgTriggerGroup,
            tipControl, this.htmlContainer, this.yDrawInfo);
    }
    this.svg.appendChild(svgGroup);
    this.svgTrigger.appendChild(svgTriggerGroup);
};
