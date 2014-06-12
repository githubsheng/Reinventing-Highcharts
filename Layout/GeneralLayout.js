/**
 * Created by wangsheng on 4/6/14.
 */

function GeneralLayout(mainTitle, subTitle, yAxisTitle, xAxisTitle, legend){
    this.mainTitle = mainTitle;
    this.subTitle = subTitle;
    this.yAxisTitle = yAxisTitle;
    this.xAxisTitle = xAxisTitle;
    this.legend = legend;
}

GeneralLayout.prototype = new Layout();
GeneralLayout.prototype.constructor = GeneralLayout;