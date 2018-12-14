/**
 * Created by wangsheng on 4/6/14.
 */

function GeneralLayout(svg, mainTitle, subTitle, yAxisTitle, xAxisTitle, legend){
    this.svg = svg;
    this.mainTitle = mainTitle;
    this.subTitle = subTitle;
    this.yAxisTitle = yAxisTitle;
    this.xAxisTitle = xAxisTitle;
    this.legend = legend;
}

GeneralLayout.prototype = new Layout();
GeneralLayout.prototype.constructor = GeneralLayout;

GeneralLayout.prototype.calculateHeightOfFixedTopMargin = function(){
    if(!this.mainTitle && !this.subTitle){
        return this.bigMargin; //top outer adds up to 50
    } else if(!this.mainTitle && this.subTitle) {
        return this.mediumMargin; //top outer adds up to 50
    } else {
        //in other cases the outer adds up to 50 (only mainTitle) or more than 50 (both main title and sub title exist).
        return this.smallMargin;
    }
};
