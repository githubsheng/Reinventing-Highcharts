/**
 * this layout allows for multiple legends
 * @param svg               to which we will append all the created svg element
 * @param mainTitle         main title
 * @param subTitle          sub title
 * @param legendList        the list of legends
 * @constructor
 */
export function MultipleLegendLayout(svg, mainTitle, subTitle, legendList){
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
    for(let i = 0; i < this.legendList.length; i++){
        if(this.legendList[i].positionRelativeToLayout === "top"){
            return this.legendList[i].height + this.mediumMargin;
        }
    }
    return 0;
};

MultipleLegendLayout.prototype.calculateWidthOfLeftLegendComponent = function(){
    for(let i = 0; i < this.legendList.length; i++){
        if(this.legendList[i].positionRelativeToLayout === "left"){
            return this.legendList[i].width + this.smallMargin;
        }
    }
    return 0;
};

MultipleLegendLayout.prototype.calculateHeightOfBottomLegendComponent = function(){
    for(let i = 0; i < this.legendList.length; i++){
        if(this.legendList[i].positionRelativeToLayout === "bottom") {
            return this.legendList[i].height + this.smallMargin;
        }
    }
    return 0;
};

MultipleLegendLayout.prototype.calculateWidthOfRightLegendComponent = function(){
    for(let i = 0; i < this.legendList.length; i++){
        if(this.legendList[i].positionRelativeToLayout === "right"){
            console.log(this.legendList[i].width + this.smallMargin);
            return this.legendList[i].width + this.smallMargin;
        }
    }
    return 0;
};

MultipleLegendLayout.prototype.analyze = function(){
    let layout = this;
    let outerAreas = this.calculateOuterAreasSizes();
    let origin = calculateOriginPosition(outerAreas);
    let dataDrawAreaY = outerAreas.leftArea.height;
    let dataDrawAreaX = outerAreas.topArea.width - this.yAxisWidth;

    return {
        originPosition: origin,
        dataDrawAreaX: dataDrawAreaX,
        dataDrawAreaY: dataDrawAreaY
    };

    function calculateOriginPosition(outerAreas){
        let originX = outerAreas.leftArea.width + layout.yAxisWidth;
        let originY = outerAreas.topArea.height + outerAreas.leftArea.height;
        return [originX, originY];
    }
};

MultipleLegendLayout.prototype.drawLegend = function(){
    let areas = this.calculateOuterAreasSizes();
    for(let i = 0; i < this.legendList.length; i++){
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
            let x = areas.topArea.origin[0] + areas.topArea.width / 2;
            let y = this.calculateHeightOfFixedTopMargin() + this.calculateHeightOfMainTitleComponent()
                + this.calculateHeightOfSubTitleComponent() + this.legendList[i].height / 2;
            this.legendList[i].draw(x, y);
        }
        //center of the bottom legend
        if(this.legendList[i].positionRelativeToLayout === "bottom"){
            let x = areas.bottomArea.origin[0] + areas.bottomArea.width / 2;
            let y = areas.bottomArea.origin[1] + this.calculateHeightOfXAxisTitleComponent()
                + this.smallMargin + this.legendList[i].height / 2;
            this.legendList[i].draw(x, y);
        }
    }
};
