/**
 * Created by wangsheng on 4/6/14.
 */

/**
 * types of charts that are children of this type: basic line, stack, single trend (all that use lines
 * @constructor
 */
function LineData(){}

LineData.prototype = new Data();
LineData.prototype.constructor = LineData;

/**
 * stride is 4 each node takes four array elements. first two are pixel position x and y, and the last two are data that
 * represents the values on x axis and y axis each.
 * @param nodes
 */
LineData.prototype.drawLines = function(nodes, color){
    var lines = draw.createStraightLines(nodes, 4, 0);
    draw.setStrokeFill(lines, colors[color].lineColor, 2, "none");
    this.svg.appendChild(lines);
};