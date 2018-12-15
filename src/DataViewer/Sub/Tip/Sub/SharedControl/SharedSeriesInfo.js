/**
 * this class is mainly used by `SharedTipControl`, it contains necessary information to draw a shared tool tip.
 * @constructor
 */
function SharedSeriesInfo(){
    this.multipleSeries = [];
}

SharedSeriesInfo.prototype.registerSingleSeries = function(seriesName, mcColor, highlightedNode, nodes){
    var a = new Array(4);
    a[0] = seriesName;
    a[1] = mcColor;
    a[2] = highlightedNode;
    a[3] = nodes;
    this.multipleSeries.push(a);
    return this.multipleSeries.length - 1;
};

SharedSeriesInfo.prototype.getSeriesName = function(seriesIdx){
    return this.multipleSeries[seriesIdx][0];
};

SharedSeriesInfo.prototype.getSeriesMCcolor = function(seriesIdx){
    return this.multipleSeries[seriesIdx][1];
};

SharedSeriesInfo.prototype.getHighlightedNode = function(seriesIdx){
    return this.multipleSeries[seriesIdx][2];
};

SharedSeriesInfo.prototype.getDataX = function(seriesIdx, nodesStrideIdx){
    //since all series will have the same dataX when the idx is specified, i will just get it from the first series.
    return this.multipleSeries[seriesIdx][3][nodesStrideIdx * 4 + 2];
};

SharedSeriesInfo.prototype.getDataY = function(seriesIdx, nodesStrideIdx){
    return this.multipleSeries[seriesIdx][3][nodesStrideIdx * 4 + 3];
};

SharedSeriesInfo.prototype.getPixelX = function(seriesIdx, nodesStrideIdx){
    return this.multipleSeries[seriesIdx][3][nodesStrideIdx * 4];
};

SharedSeriesInfo.prototype.getPixelY = function(seriesIdx, nodesStrideIdx){
    return this.multipleSeries[seriesIdx][3][nodesStrideIdx * 4 + 1];
};

SharedSeriesInfo.prototype.reverse = function(){
    this.multipleSeries.reverse();
};