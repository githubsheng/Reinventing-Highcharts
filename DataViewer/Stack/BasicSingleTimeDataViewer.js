/**
 * Created by wangsheng on 16/6/14.
 */

/**
 * .....
 * @param htmlContainer
 * @param svg
 * @param svgTrigger
 * @param input
 * @param xDrawInfo
 * @param yDrawInfo
 * @param isContinual
 * @constructor
 */
function BasicSingleTimeData(htmlContainer, svg, svgTrigger, input, xDrawInfo, yDrawInfo, isContinual){
    this.htmlContainer = htmlContainer;
    this.svg = svg;
    this.svgTrigger = svgTrigger;
    this.input = input;
    this.xDrawInfo = xDrawInfo;
    this.yDrawInfo = yDrawInfo;
    this.topTip = null;
    this.isContinual = isContinual;
}

/**
 * This method draws the data between x and y axes. And it also configure the event listener.
 *
 * Since this method will only be called once it is ok to define some functions inside this method.
 */
BasicSingleTimeData.prototype.draw = function(){
    var seriesName = this.input.series[0][0];
    var nodes = this.analyzeSingleSeriesData(this.input.series[0][1]);

    var svgDrawGroup = draw.createGroup();
    var svgTriggerGroup = draw.createGroup();
    var randomPicker = new RandomPicker();
    var tipControl = new TipControl(this.htmlContainer, 7, false);
    tipControl.createTip();

    var sssv = new SingleTimeSeriesViewer(this.htmlContainer, svgDrawGroup, svgTriggerGroup, nodes,
        randomPicker.pickNodeShape(), randomPicker.pickSeriesColor(), this.isContinual, this.input.interval, seriesName,
        tipControl, this.xDrawInfo, this.yDrawInfo, 1, true);

    sssv.draw();

    this.svg.appendChild(svgDrawGroup);
    this.svgTrigger.appendChild(svgTriggerGroup);
};

/**
 * returns an array that contains both pixel information and data information. The stride is 4 and the first 2 are pixel positions
 * while the last one are data information. The third is not really needed and therefore is set to 0;
 * @param singleSeriesData
 * @returns {Array}
 */
BasicSingleTimeData.prototype.analyzeSingleSeriesData = function(singleSeriesData){
    var nodes = [];
    var interval = this.input.interval;
    var startTime = this.input.startTime;

    var parseTime = assembleParseTimeFunction(this.input.unit);

    for(var i = 0; i < singleSeriesData.length; i++){
        var pixelX = this.xDrawInfo.startPoint + i * interval * this.xDrawInfo.pixelPerData;
        var pixelY = this.yDrawInfo.startPoint - (singleSeriesData[i] - this.yDrawInfo.min) * this.yDrawInfo.pixelPerData;
        nodes.push(pixelX);
        nodes.push(pixelY);
        nodes.push(parseTime(i));
        nodes.push(singleSeriesData[i]);
    }


    function assembleParseTimeFunction(unit){
        switch(unit){
            case "s":
                return null;//TODO
            case "m":
                return function(idx){
                    var date = new Date(startTime + interval * idx * 60000);
                    return "(" + date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + (date.getHours()+1)
                    + ":" + (date.getMinutes()+1) + ")";
                };

            case "h":
                return null;//TODO

        }
    }

    return nodes;
};


