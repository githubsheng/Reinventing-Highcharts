/**
 * Created by wangsheng on 27/6/14.
 */

function SingleStackSeriesViewer(htmlContainer, svg, svgTrigger, nodes, nodeShape, mcColor,
                                isContinual, constantInterval/*if not regular is should be false, otherwise it should be the interval value*/,
                                seriesName, tipControl, xDrawInfo, yDrawInfo){
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

    this.svgLayerGroup = draw.createGroup();
    this.svgTriggerGroup = draw.createGroup();
    this.tipControl = tipControl;
}

SingleStackSeriesViewer.prototype = new SingleLineSeriesViewer();
SingleStackSeriesViewer.prototype.constructor = SingleStackSeriesViewer;

SingleStackSeriesViewer.prototype.draw = function(){
    this.svgLayerGroup.appendChild(this.drawStack());
    this.svgLayerGroup.appendChild(this.drawLine());
    this.drawLine();
    this.drawNodes();
    this.enableNodeTrigger();
    this.enableRoutineTrace();
    this.svg.appendChild(this.svgLayerGroup);
    this.svgTrigger.appendChild(this.svgTriggerGroup);
};

SingleStackSeriesViewer.prototype.drawLine = function(){
    var lines = draw.createStraightLines(this.nodes, 4, 0);
    draw.setStrokeFill(lines, this.mcColor.strokeColor, 1, "none");
    return lines;
};

SingleStackSeriesViewer.prototype.drawStack = function(){
    //draw the stack, minus 0.5 so that i does not cover up the x axis.
    var rightBottom = [this.xDrawInfo.startPoint + this.xDrawInfo.length, this.yDrawInfo.startPoint - 0.5];
    var leftBottom = [this.xDrawInfo.startPoint, this.yDrawInfo.startPoint - 0.5];
    var stack = draw.createStackWithStraightLines(this.nodes, 4, 0, rightBottom, leftBottom);
    draw.setStrokeFill(stack, false, false, colors.linearGradientBlue.use);
    return stack;
};

SingleStackSeriesViewer.prototype.enableRoutineTrace = function(){
    if(!this.isContinual){
        return;
    }

    var stackTrigger = this.drawStack();
    draw.setStrokeFill(stackTrigger, false, false, "rgb(0,0,0)");
    draw.setVisibility(stackTrigger, false);
    stackTrigger.setAttributeNS(null, "pointer-events", "fill");
    this.svgTriggerGroup.appendChild(stackTrigger);

    //actually add listeners.
    var triggerControl = new TriggerControl(this.tipControl, this.seriesName, this.mcColor);
    triggerControl.enableRoutineTrace(this.htmlContainer, this.nodes, stackTrigger, this.constantInterval, this.xDrawInfo);
};