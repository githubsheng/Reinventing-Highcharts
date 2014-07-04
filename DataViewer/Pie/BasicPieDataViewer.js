/**
 * Created by wangsheng on 4/7/14.
 */
function BasicPieDataViewer(htmlContainer, svg, svgTrigger, input, center, dataDrawAreaX, dataDrawAreaY, radiusForLabel, radisuForPie, total){
    this.htmlContainer = htmlContainer;
    this.svg = svg;
    this.svgTrigger = svgTrigger;
    this.input = input;
    this.center = center;
    this.dataDrawAreaX = dataDrawAreaX;
    this.dataDrawAreaY = dataDrawAreaY;
    this.radiusForLabel = radiusForLabel;
    this.radiusForPie = radisuForPie;
    this.total = total;
}

BasicPieDataViewer.prototype.draw = function(){
    var slices = this.analyze();

    for(var i = 0; i < slices.length; i = i + 4){
        var spsv = new SinglePieSeriesViewer(this.svg, this.htmlContainer, this.tipControl, this.svgTrigger, slices[0], slices[1], this.radiusForPie, slices[2], slices[3]);
        spsv.draw();
    }
};

BasicPieDataViewer.prototype.analyze = function(){
    var slices = []; //[startAngle, endAngle, seriesName, dataY, startAngle, endAngle, seriesName, dataY....]
    var startAngle = 0;
    for(var i = 0; i < this.input.series.length; i++){
        var single = this.input.series[i][1];
        var angle = (single / this.total) /  360;

        slices.push(startAngle);
        slices.push(startAngle + angle);
        slices.push(this.input.series[i][0]);
        slices.push(single);

        startAngle = startAngle + angle;
    }

    return slices;
};