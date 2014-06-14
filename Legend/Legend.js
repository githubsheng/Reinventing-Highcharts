/**
 * Created by wangsheng on 29/5/14.
 */
function Legend(svg, mulitpleSeries, positionRelativeToLayout){
    this.svg = svg;
    this.height = 0;
    this.width = 0;
    this.rowHeight = 25;
    this.fontSize = 15;
    this.mulitpleSeries = mulitpleSeries;
    this.positionRelativeToLayout = positionRelativeToLayout;
    this.legendSVG_Group = draw.createGroup();
}

Legend.prototype.analyze = function(shape, color){
    if(this.positionRelativeToLayout === "none") return;

    this.svg.appendChild(this.legendSVG_Group);
    var randomPicker = new RandomPicker();

    //垂直排列
    if(this.positionRelativeToLayout === "left" || this.positionRelativeToLayout === "right"){
        for(var i = 0; i < this.mulitpleSeries.length; i++){
            var singleSeries = this.mulitpleSeries[i];
            var singleSeriesName = singleSeries[0];
            var singleSeriesNode = visualNodeDrawer.draw(util.pickFirstAvailable(shape, randomPicker.pickNodeShape()),
                util.pickFirstAvailable(color, randomPicker.pickSeriesColor()),
                10, this.rowHeight * i + this.rowHeight/2);
            var legendText = draw.createText(20, this.rowHeight * i + this.rowHeight/2, singleSeriesName, this.fontSize, "start", "middle");
            this.legendSVG_Group.appendChild(singleSeriesNode);
            this.legendSVG_Group.appendChild(legendText);
        }
    }

    //横向排列
    if(this.positionRelativeToLayout === "top" || this.positionRelativeToLayout === "bottom"){
        var columnWidth = 0;
        for(var i = 0; i < this.mulitpleSeries.length; i++){
            var singleSeries = this.mulitpleSeries[i];
            var singleSeriesName = singleSeries[0];
            var singleSeriesNode = visualNodeDrawer.draw(randomPicker.pickNodeShape(), randomPicker.pickSeriesColor(),
                0 + columnWidth, this.rowHeight/2);
            var legendText = draw.createText(10 + columnWidth, this.rowHeight/2, singleSeriesName, this.fontSize, "start", "middle");
            this.legendSVG_Group.appendChild(singleSeriesNode);
            this.legendSVG_Group.appendChild(legendText);
            columnWidth = columnWidth + 30 + legendText.getBBox().width;
        }
    }
    draw.setVisibility(this.legendSVG_Group, false);
    this.width = this.legendSVG_Group.getBBox().width;
    this.height = this.legendSVG_Group.getBBox().height;
};

/**
 * draws the legend. x y should be the center of the legend.
 * @param x
 * @param y
 */
Legend.prototype.draw = function(x, y){
    x = x - this.width / 2;
    y = y - this.height / 2;
    draw.translate(this.legendSVG_Group, x, y);
    draw.setVisibility(this.legendSVG_Group, true);
};