/**
 * Created by wangsheng on 24/7/14.
 */
function MultipleLegendLayout(svg, mainTitle, subTitle, legendList){
    this.svg = svg;
    this.mainTitle = mainTitle;
    this.subTitle = subTitle;
    this.yAxisTitle = undefined; //since there is no axis there will be no axis title.
    this.xAxisTitle = undefined; //since there is no axis there will be no axis title.
    //these two override the values in the Layout.js
    this.xAxisHeight = 0;
    this.yAxisWidth = 0;
    this.legendList = legendList;
}

MultipleLegendLayout.prototype = new Layout();
MultipleLegendLayout.prototype.constructor = MultipleLegendLayout;

MultipleLegendLayout.prototype.calculateHeightOfFixedTopMargin = function(){
    if(!this.mainTitle && !this.subTitle){
        return this.bigMargin; //top outer adds up to 50
    } else if(!this.mainTitle && this.subTitle) {
        return this.mediumMargin; //top outer adds up to 50
    } else {
        //in other cases the outer adds up to 50 (only mainTitle) or more than 50 (both main title and sub title exist).
        return this.smallMargin;
    }
};

MultipleLegendLayout.prototype.calculateHeightOfTopLegendComponent = function(){
    for(var i = 0; i < this.legendList.length; i++){
        if(this.legendList[i].positionRelativeToLayout === "top"){
            return this.legendList[i].height + this.mediumMargin;
        }
    }
    return 0;
};

MultipleLegendLayout.prototype.calculateWidthOfLeftLegendComponent = function(){
    for(var i = 0; i < this.legendList.length; i++){
        if(this.legendList[i].positionRelativeToLayout === "left"){
            return this.legendList[i].width + this.smallMargin;
        }
    }
    return 0;
};

MultipleLegendLayout.prototype.calculateHeightOfBottomLegendComponent = function(){
    for(var i = 0; i < this.legendList.length; i++){
        if(this.legendList[i].positionRelativeToLayout === "bottom") {
            return this.legendList[i].height + this.smallMargin;
        }
    }
    return 0;
};

MultipleLegendLayout.prototype.calculateWidthOfRightLegendComponent = function(){
    for(var i = 0; i < this.legendList.length; i++){
        if(this.legendList[i].positionRelativeToLayout === "right"){
            console.log(this.legendList[i].width + this.smallMargin);
            return this.legendList[i].width + this.smallMargin;
        }
    }
    return 0;
};

MultipleLegendLayout.prototype.analyze = function(){
    var layout = this;
    var outerAreas = this.calculateOuterAreasSizes();
    var origin = calculateOriginPosition(outerAreas);
    var dataDrawAreaY = outerAreas.leftArea.height;
    var dataDrawAreaX = outerAreas.topArea.width - this.yAxisWidth;

    return {
        originPosition: origin,
        dataDrawAreaX: dataDrawAreaX,
        dataDrawAreaY: dataDrawAreaY
    };

    function calculateOriginPosition(outerAreas){
        var originX = outerAreas.leftArea.width + layout.yAxisWidth;
        var originY = outerAreas.topArea.height + outerAreas.leftArea.height;
        return [originX, originY];
    }
};

MultipleLegendLayout.prototype.drawLegend = function(){
    var areas = this.calculateOuterAreasSizes();
    for(var i = 0; i < this.legendList.length; i++){
        //center of the left legend
        if(this.legendList[i].positionRelativeToLayout === "left"){
            this.legendList[i].draw(areas.leftArea.origin[0] + this.legendList[i].width / 2,
                    areas.leftArea.origin[1] + areas.leftArea.height / 2);
        }
        //center of the right legend
        if(this.legendList[i].positionRelativeToLayout === "right"){
            this.legendList[i].draw(areas.rightArea.origin[0] + this.legendList[i].width / 2,
                    areas.rightArea.origin[1] + areas.rightArea.height / 2);
        }
        //center of the top legend
        if(this.legendList[i].positionRelativeToLayout === "top"){
            var x = areas.topArea.origin[0] + areas.topArea.width / 2;
            var y = this.calculateHeightOfFixedTopMargin() + this.calculateHeightOfMainTitleComponent()
                + this.calculateHeightOfSubTitleComponent() + this.legendList[i].height / 2;
            this.legendList[i].draw(x, y);
        }
        //center of the bottom legend
        if(this.legendList[i].positionRelativeToLayout === "bottom"){
            var x = areas.bottomArea.origin[0] + areas.bottomArea.width / 2;
            var y = areas.bottomArea.origin[1] + this.calculateHeightOfXAxisTitleComponent()
                + this.smallMargin + this.legendList[i].height / 2;
            this.legendList[i].draw(x, y);
        }
    }
};
