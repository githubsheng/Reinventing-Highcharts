/**
 * Created by wangsheng on 3/7/14.
 */
function SingleTimeSeriesViewer(htmlContainer, svg, svgTrigger, nodes, nodeShape, mcColor,
                                 isContinual, constantInterval/*if not regular is should be false, otherwise it should be the interval value*/,
                                 seriesName, tipControl, xDrawInfo, yDrawInfo, lineWidth, isLinearGradient){
    this.htmlContainer = htmlContainer; //if use the default inherited 'showTip' method then this field must be set.
    this.svg = svg;
    this.svgTrigger = svgTrigger;
    this.nodes = nodes;
    this.nodeShape = nodeShape;
    this.mcColor = mcColor;
    this.constantInterval = constantInterval;
    this.isContinual = isContinual;
    this.seriesName = seriesName;
    this.xDrawInfo = xDrawInfo;
    this.yDrawInfo = yDrawInfo;
    this.lineWidth = lineWidth;
    this.isLinearGradient = isLinearGradient;

    this.svgLayerGroup = draw.createGroup();
    this.svgTriggerGroup = draw.createGroup();
    this.tipControl = tipControl;
}

SingleTimeSeriesViewer.prototype = new SingleStackSeriesViewer();
SingleTimeSeriesViewer.prototype.constructor = SingleTimeSeriesViewer;

SingleTimeSeriesViewer.prototype.drawHighlightNode = function(){
    return null;
};
