/**
 * Created by wangsheng on 22/6/14.
 */

function BasicTimeDataViewer(svg, multiSeries, xDrawInfo, yDrawInfo, isContinual){
    this.svg = svg;
    this.singleSeries = multiSeries[0];
    this.xDrawInfo = xDrawInfo;
    this.yDrawInfo = yDrawInfo;
    this.isContinual = isContinual;
}

BasicTimeDataViewer.prototype = new DataViewer();
BasicTimeDataViewer.prototype.constructor = BasicTimeDataViewer;



