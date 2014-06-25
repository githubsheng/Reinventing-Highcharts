/**
 * Created by wangsheng on 16/6/14.
 */
/**
 *
 * @param svg
 * @param multiSeries   for a basic time series chart, the multiSeries (input.series) is really one single series..
 * @param xDrawInfo     information about x axis
 * @param yDrawInfo     information about y axis.
 * @constructor
 */
function BasicSingleTimeData(svg, multiSeries, xDrawInfo, yDrawInfo, isContinual){
    this.svg = svg;
    this.singleSeries = multiSeries[0];
    this.xDrawInfo = xDrawInfo;
    this.yDrawInfo = yDrawInfo;
    this.isContinual = isContinual;
}

/**
 * This method draws the data between x and y axes. And it also configure the event listener.
 *
 * Since this method will only be called once it is ok to define some functions inside this method.
 */
BasicSingleTimeData.prototype.draw = function(){
    var basicTimeData = this;
    var singleSeriesName = this.singleSeries[0];
    var singleSeriesData = this.singleSeries[1];
    var nodes = this.analyzeSingleSeriesData(singleSeriesData);
    var lineAndStack = drawLineAndStack(this);

    /**
     * let me clarify a little bit. If there are two many data points between a single interval, then I see it
     * as continual data. For example, in 100 pixel interval we have only 200 data points. Because there are so
     * many of them it is like it is a continual stream. Also because there are so many of them, it is impossible
     * to draw a visual node for each of them.
     */
    if(this.isContinual){
        drawContinualData();
    } else {
        drawDiscreteData();
    }

    function drawLineAndStack(){
        //draw the stack, minus 0.5 so that i does not cover up the x axis.
        var rightBottom = [basicTimeData.xDrawInfo.startPoint + basicTimeData.xDrawInfo.length, basicTimeData.yDrawInfo.startPoint - 0.5];
        var leftBottom = [basicTimeData.xDrawInfo.startPoint, basicTimeData.yDrawInfo.startPoint - 0.5];
        var stack = draw.createStackWithStraightLines(nodes, 3, 0, rightBottom, leftBottom);
        draw.setStrokeFill(stack, false, false, colors.linearGradientBlue.use);
        basicTimeData.svg.appendChild(stack);

        //draw the line
        var line = draw.createStraightLines(nodes, 3, 0);
        draw.setStrokeFill(line, colors.blue.strokeColor, "1", "none");
        basicTimeData.svg.appendChild(line);
        return {
            line: line,
            stack: stack
        }
    }

    function drawContinualData(){
        basicTimeData.drawTipTemplate(7, false);
        var visualNode = drawVisualNodeTemplate();
        configureEventListenerForContinualData(nodes, lineAndStack.stack);

        function drawVisualNodeTemplate(){
            var visualNode = nodeDrawer.drawCircleNode(colors.blue, 0, 0);
            draw.setVisibility(visualNode, false);
            draw.setStrokeFill(visualNode, false, "2", false);
            basicTimeData.svg.appendChild(visualNode);
            return visualNode;
        }


        function configureEventListenerForContinualData(nodes, stack){
            var color = colors["blue"];
            stack.addEventListener("mousemove", function(event){
                var pixelX = event.clientX - basicTimeData.svg.getBoundingClientRect().left;
                var dataX = Math.round((pixelX - basicTimeData.xDrawInfo.startPoint)/basicTimeData.xDrawInfo.pixelPerData);
                var dataY = nodes[dataX * 3 + 2];
                var pixelY = nodes[dataX * 3 + 1];

                //show the tip.
                basicTimeData.showTip(dataX, dataY, pixelX, pixelY, singleSeriesName, color, true);
                draw.translate(visualNode, pixelX, pixelY);
                draw.setVisibility(visualNode, true);
            });

            stack.addEventListener("mouseout", function(){
                basicTimeData.hideTip();
                draw.setVisibility(visualNode, false);
            });
        }
    }

    function drawDiscreteData(){
        //TODO: implement this method.
    }

};

/**
 * returns an array that contains both pixel information and data information. The stride is 4 and the first 2 are pixel positions
 * while the last one are data information. The third is not really needed and therefore is set to 0;
 * @param singleSeriesData
 * @returns {Array}
 */
BasicSingleTimeData.prototype.analyzeSingleSeriesData = function(singleSeriesData){
    var nodes = [];

    for(var i = 0; i < singleSeriesData.length; i++){
        var pixelX = this.xDrawInfo.startPoint + (i - this.xDrawInfo.min) * this.xDrawInfo.pixelPerData;
        var pixelY = this.yDrawInfo.startPoint - (singleSeriesData[i] - this.yDrawInfo.min) * this.yDrawInfo.pixelPerData;
        nodes.push(pixelX);
        nodes.push(pixelY);
        nodes.push(0); //dataX is not needed in regular continual data viewer.
        nodes.push(singleSeriesData[i]);
    }

    return nodes;
};


