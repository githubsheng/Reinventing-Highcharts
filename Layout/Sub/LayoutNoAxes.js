/**
 * Created by wangsheng on 3/7/14.
 */
function LayoutNoAxes(svg, mainTitle, subTitle, legend){
    this.svg = svg;
    this.mainTitle = mainTitle;
    this.subTitle = subTitle;
    this.yAxisTitle = undefined; //since there is no axis there will be no axis title.
    this.xAxisTitle = undefined; //since there is no axis there will be no axis title.
    //these two override the values in the Layout.js
    this.xAxisHeight = 20;
    this.yAxisWidth = 30;

    this.legend = legend;
}

LayoutNoAxes.prototype = new Layout();
LayoutNoAxes.prototype.constructor = LayoutNoAxes;