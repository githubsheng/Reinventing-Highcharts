/**
 * Created by wangsheng on 28/5/14.
 */

/**
 * For more details refer to the design blueprint. This class implements the layout of a typical 'Basic Line' chart.
 */
function Layout(){
    this.smallMargin = 10;
    this.mediumMargin = 20;
    this.mainTitleHeight = 30;
    this.mainTitleFontSize = 25;
    this.subTitleHeight = 20;
    this.subTitleFontSize = 15;
    this.yAxisTitleWidth = this.xAxisTitleHeight = 20;
    this.yAxisTitleFontSize = this.xAxisTitleFontSize = 15;
    this.xAxisHeight = 20;
    this.yAxisWidth = 30;
    this.chartDisplayleftEdgeX = 0; //可以用于画线的区域的左边际，主要用于参考看提示框是否需要往右移动
    this.chartDisplayRightEdgeX = 0; //可以用于画线的区域的右边际
    this.chartDisplayTopEdgeY = 0;
    this.areas = null;
}

/**
 * returns the top fixed margin
 * @returns {Number}
 */
Layout.prototype.calculateHeightOfFixedTopMargin = function(){
    return this.smallMargin;
};

/**
 * returns the total height of the main title component.
 * @returns {Number}
 */
Layout.prototype.calculateHeightOfMainTitleComponent = function(){
    return util.chooseBetween(this.mainTitle, this.mainTitleHeight + this.smallMargin, 0);
};

Layout.prototype.calculateHeightOfSubTitleComponent = function(){
    return util.chooseBetween(this.subTitle , this.subTitleHeight + this.smallMargin, 0);
};

Layout.prototype.calculateHeightOfTopLegendComponent = function(){
    return util.chooseBetween(this.legend.positionRelativeToLayout === "top", this.legend.height + this.mediumMargin, 0);
};

Layout.prototype.calculateWidthOfLeftFixedMargin = function(){
    return this.smallMargin;
};

Layout.prototype.calculateWidthOfLeftLegendComponent = function(){
    return util.chooseBetween(this.legend.positionRelativeToLayout === "left", this.legend.width + this.smallMargin, 0);
};

Layout.prototype.calculateWidthOfYAxisTitleComponent = function(){
    return util.chooseBetween(this.yAxisTitle, this.yAxisTitleWidth + this.smallMargin, 0)
};

Layout.prototype.calculateHeightOfFixedBottomMargin = function(){
    return this.smallMargin;
};

Layout.prototype.calculateHeightOfBottomLegendComponent = function(){
    return util.chooseBetween(this.legend.positionRelativeToLayout === "bottom", this.legend.height + this.smallMargin, 0);
};

Layout.prototype.calculateHeightOfXAxisTitleComponent = function(){
    return util.chooseBetween(this.xAxisTitle, this.xAxisTitleHeight + this.smallMargin, 0);
};

Layout.prototype.calculateWidthOfRightFixedMargin = function(){
    return this.smallMargin;
};

Layout.prototype.calculateWidthOfRightLegendComponent = function(){
    return util.chooseBetween(this.legend.positionRelativeToLayout === "right", this.legend.width + this.smallMargin, 0);
};

Layout.prototype.calculateOuterAreasSizes = function(){

    if(this.areas !== null){
        return this.areas;
    }

    var layout = this;

    var topOuterHeight = calculateTopOuterHeight();
    var leftOuterWidth = calculateLeftOuterWidth();
    var bottomOuterHeight = calculateBottomOuterHeight();
    var rightOuterWidth = calculateRightOuterWidth();

    var svgWdith = +(this.svg.getAttribute("width"));
    var svgHeight = +(this.svg.getAttribute("height"));

    var topArea = {
        origin : [leftOuterWidth, 0],
        width : svgWdith - leftOuterWidth - rightOuterWidth,
        height: topOuterHeight
    };

    var leftArea = {
        origin : [0, topOuterHeight],
        width : leftOuterWidth,
        height : svgHeight - topOuterHeight - bottomOuterHeight - this.xAxisHeight
    };

    var rightArea = {
        origin : [svgWdith - rightOuterWidth, topOuterHeight],
        width: rightOuterWidth,
        height: leftArea.height
    };

    var bottomArea = {
        origin : [leftOuterWidth, svgHeight - bottomOuterHeight],
        width : topArea.width,
        height: bottomOuterHeight
    };

    this.areas = {
        topArea: topArea,
        leftArea: leftArea,
        rightArea: rightArea,
        bottomArea: bottomArea
    };

    return this.areas;

    function calculateTopOuterHeight(){
        return layout.calculateHeightOfFixedTopMargin() + layout.calculateHeightOfMainTitleComponent()
            + layout.calculateHeightOfSubTitleComponent() + layout.calculateHeightOfTopLegendComponent();
    }

    function calculateLeftOuterWidth(){
        return layout.calculateWidthOfLeftFixedMargin() + layout.calculateWidthOfLeftLegendComponent()
            + layout.calculateWidthOfYAxisTitleComponent();
    }

    function calculateBottomOuterHeight(){
        return layout.calculateHeightOfFixedBottomMargin() + layout.calculateHeightOfBottomLegendComponent()
            + layout.calculateHeightOfXAxisTitleComponent();
    }

    function calculateRightOuterWidth(){
        return layout.calculateWidthOfRightFixedMargin() + layout.calculateWidthOfRightLegendComponent();
    }

};

/**
 * returns the total lengths of x axis and y axis (including padding) and the position of the origin.
 * @returns {{origin: *, xAxisLength: number, yAxisLength: *}}
 */
Layout.prototype.analyze = function(){
    var layout = this;
    var outerAreas = this.calculateOuterAreasSizes();
    var origin = calculateOriginPosition(outerAreas);
    var yAxisLength = outerAreas.leftArea.height;
    var xAxisLength = outerAreas.topArea.width - this.yAxisWidth;

    return {
        originPosition: origin,
        xAxisLength: xAxisLength,
        yAxisLength: yAxisLength
    };


    function calculateOriginPosition(outerAreas){
        var originX = outerAreas.leftArea.width + layout.yAxisWidth;
        var originY = outerAreas.topArea.height + outerAreas.leftArea.height;
        return [originX, originY];
    }
};


Layout.prototype.drawTitles = function(){
    var outerAreas = this.calculateOuterAreasSizes();
    var top = outerAreas.topArea;
    var left = outerAreas.leftArea;
    var right = outerAreas.rightArea;
    var bottom = outerAreas.bottomArea;

    if(this.mainTitle){
        var x = top.origin[0] + top.width / 2;
        var y = this.calculateHeightOfFixedTopMargin() + this.mainTitleHeight / 2;
        this.svg.appendChild(draw.createText(x, y, this.mainTitle, this.mainTitleFontSize, "middle", "middle"));
    }

    if(this.subTitle){
        var x = top.origin[0] + top.width / 2;
        var y = this.calculateHeightOfFixedTopMargin() + this.calculateHeightOfMainTitleComponent() + this.subTitleHeight/2;
        var subTitle = draw.createText(x, y, this.subTitle, this.subTitleFontSize, "middle", "middle");
        draw.setStrokeFill(subTitle, "none", false, "#6E6F6F");
        this.svg.appendChild(subTitle);
    }

    if(this.yAxisTitle){
        var x = left.origin[0] + this.calculateWidthOfLeftFixedMargin() + this.calculateWidthOfLeftLegendComponent()
            + this.yAxisTitleWidth / 2;
        var y = top.height + left.height / 2;
        var yAxisTitle = draw.createText(x, y, this.yAxisTitle, this.yAxisTitleFontSize, "middle", "middle");
        draw.setStrokeFill(yAxisTitle, "none", false, "#6E6F6F");
        draw.rotate(yAxisTitle, x, y, -90);
        this.svg.appendChild(yAxisTitle);
    }

    if(this.xAxisTitle){
        var x = bottom.origin[0] + bottom.width / 2;
        var y = bottom.origin[1] + this.smallMargin + this.xAxisTitleHeight / 2;
        var xAxisTtile = draw.createText(x, y, this.xAxisTitle, this.xAxisTitleFontSize, "middle", "middle");
        draw.setStrokeFill(xAxisTtile, "none", false, "#6E6F6F");
        this.svg.appendChild(xAxisTtile);
    }
};

Layout.prototype.drawLegend = function(){
    var areas = this.calculateOuterAreasSizes();
    //center of the left legend
    if(this.legend.positionRelativeToLayout === "left"){
        this.legend.draw(areas.leftArea.origin[0] + this.legend.width / 2,
                areas.leftArea.origin[1] + areas.leftArea.height / 2);
    }
    //center of the right legend
    if(this.legend.positionRelativeToLayout === "right"){
        this.legend.draw(areas.rightArea.origin[0] + this.legend.width / 2,
                areas.rightArea.origin[1] + areas.rightArea.height / 2);
    }
    //center of the top legend
    if(this.legend.positionRelativeToLayout === "top"){
        var x = areas.topArea.origin[0] + areas.topArea.width / 2;
        var y = this.calculateHeightOfFixedTopMargin() + this.calculateHeightOfMainTitleComponent()
            + this.calculateHeightOfSubTitleComponent() + this.legend.height / 2;
        this.legend.draw(x, y);
    }
    //center of the bottom legend
    if(this.legend.positionRelativeToLayout === "bottom"){
        var x = areas.bottomArea.origin[0] + areas.bottomArea.width / 2;
        var y = areas.bottomArea.origin[1] + this.calculateHeightOfXAxisTitleComponent()
            + this.smallMargin + this.legend.height / 2;
        this.legend.draw(x, y);
    }
};


Layout.prototype.draw = function(){
    this.drawTitles();
    this.drawLegend();
};

