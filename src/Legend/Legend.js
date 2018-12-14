/**
 * Created by wangsheng on 29/5/14.
 */
function Legend(svg, multipleSeries, positionRelativeToLayout, shape, color){
    this.svg = svg;
    this.height = 0;
    this.width = 0;
    this.rowHeight = 25;
    this.fontSize = 15;
    this.multipleSeries = multipleSeries;
    this.positionRelativeToLayout = positionRelativeToLayout;
    this.shape = shape;
    this.color = color;
    this.legendSVG_Group = draw.createGroup();
}

Legend.prototype.analyze = function(directMultipleSeriesName, includeNodeShape){
    if(this.positionRelativeToLayout === "none") return;

    this.svg.appendChild(this.legendSVG_Group);
    var randomPicker = new RandomPicker();

    var multipleSeriesNames;
    if(!directMultipleSeriesName){
        multipleSeriesNames = [];
        for(var i = 0; i < this.multipleSeries.length; i++){
            multipleSeriesNames.push(this.multipleSeries[i][0]);
        }
    } else {
        multipleSeriesNames = directMultipleSeriesName;
    }

    //垂直排列
    if(this.positionRelativeToLayout === "left" || this.positionRelativeToLayout === "right"){
        for(var i = 0; i < multipleSeriesNames.length; i++){
            var singleSeriesName = multipleSeriesNames[i];
            var legendText = draw.createText(20, this.rowHeight * i + this.rowHeight/2, singleSeriesName, this.fontSize, "start", "middle");

            this.legendSVG_Group.appendChild(legendText);
            if(includeNodeShape === undefined /*not specified, by default we include it.*/ || includeNodeShape === true){
                var singleSeriesNode = nodeDrawer.draw(util.pickFirstAvailable(this.shape, randomPicker.pickNodeShape()),
                    util.pickFirstAvailable(this.color, randomPicker.pickSeriesColor()),
                    10, this.rowHeight * i + this.rowHeight/2);
                this.legendSVG_Group.appendChild(singleSeriesNode);
            }
        }
    }

    //横向排列
    if(this.positionRelativeToLayout === "top" || this.positionRelativeToLayout === "bottom"){
        var columnWidth = 0;
        for(var i = 0; i < multipleSeriesNames.length; i++){
            var singleSeriesName = multipleSeriesNames[i];
            var legendText = draw.createText(10 + columnWidth, this.rowHeight/2, singleSeriesName, this.fontSize, "start", "middle");
            this.legendSVG_Group.appendChild(legendText);

            if(includeNodeShape === undefined /*not specified, by default we include it.*/ || includeNodeShape === true){
                var singleSeriesNode = nodeDrawer.draw(util.pickFirstAvailable(this.shape, randomPicker.pickNodeShape()),
                    util.pickFirstAvailable(this.color, randomPicker.pickSeriesColor()),
                        0 + columnWidth, this.rowHeight/2);
                this.legendSVG_Group.appendChild(singleSeriesNode);
            }

            columnWidth = columnWidth + 30 + legendText.getBoundingClientRect().width;
        }
    }
    draw.setVisibility(this.legendSVG_Group, false);
    this.width = this.legendSVG_Group.getBoundingClientRect().width;
    this.height = this.legendSVG_Group.getBoundingClientRect().height;
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