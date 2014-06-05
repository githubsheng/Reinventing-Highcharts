/**
 * Created by wangsheng on 4/6/14.
 */

function BasicLineLayout(mainTitle, subTitle, yAxisTitle, xAxisTitle, legend){
    this.mainTitle = mainTitle;
    this.subTitle = subTitle;
    this.yAxisTitle = yAxisTitle;
    this.xAxisTitle = xAxisTitle;
    this.legend = legend;
}

BasicLineLayout.prototype = new Layout();
BasicLineLayout.prototype.constructor = BasicLineLayout;