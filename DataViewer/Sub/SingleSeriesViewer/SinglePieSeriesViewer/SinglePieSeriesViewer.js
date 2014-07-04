/**
 * Created by wangsheng on 4/7/14.
 */

function SinglePieSeriesViewer(svg, htmlContainer, tipControl, svgTrigger, startAngle, endAngle, radiusForLabel, radiusForPie, center, seriesName, mcColor, dataY){
    this.svg = svg;
    this.htmlContainer = htmlContainer;
    this.tipControl = tipControl;
    this.svgTrigger = svgTrigger;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.radiusForLabel = radiusForLabel;
    this.radiusForPie = radiusForPie;
    this.center = center;
    this.seriesName = seriesName;
    this.mcColor = mcColor;
    this.dataY = dataY;
}

SinglePieSeriesViewer.prototype.draw = function(){
    var slice = draw.createArcOfCircle(center[0], center[1], this.radiusForPie, this.startAngle, this.endAngle);
    draw.setStrokeFill(slice, false, false, mcColor.fillColor);
    this.svg.appendChild(slice);
};

SinglePieSeriesViewer.prototype.enablePieSliceTrigger = function(){

};
