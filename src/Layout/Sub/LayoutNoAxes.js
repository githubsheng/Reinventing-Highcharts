/**
 * this layout assumes there is no axis, mainly used for 3d chart.
 * @param svg           svg container
 * @param mainTitle     main title
 * @param subTitle      sub title
 * @param legend        legend
 * @constructor
 */
function LayoutNoAxes(svg, mainTitle, subTitle, legend){
    this.svg = svg;
    this.mainTitle = mainTitle;
    this.subTitle = subTitle;
    this.yAxisTitle = undefined; //since there is no axis there will be no axis title.
    this.xAxisTitle = undefined; //since there is no axis there will be no axis title.
    //these two override the values in the Layout.js
    this.xAxisHeight = 0;
    this.yAxisWidth = 0;

    this.legend = legend;
}

LayoutNoAxes.prototype = new Layout();
LayoutNoAxes.prototype.constructor = LayoutNoAxes;

LayoutNoAxes.prototype.analyze = function(){
    let layout = this;
    let outerAreas = this.calculateOuterAreasSizes();
    let origin = calculateOriginPosition(outerAreas);
    let dataDrawAreaY = outerAreas.leftArea.height;
    let dataDrawAreaX = outerAreas.topArea.width - this.yAxisWidth;
    let radii = calculateSuggestedRadius();

    return {
        dataDrawAreaX: dataDrawAreaX,
        dataDrawAreaY: dataDrawAreaY,
        center: [origin[0] + dataDrawAreaX/2, origin[1] - dataDrawAreaY/2],
        radiusForLabel: radii[0],
        radiusForPie: radii[1],
        radiusForConnectionLine: radii[2]
    };

    function calculateOriginPosition(outerAreas){
        let originX = outerAreas.leftArea.width + layout.yAxisWidth;
        let originY = outerAreas.topArea.height + outerAreas.leftArea.height;
        return [originX, originY];
    }

    function calculateSuggestedRadius(){
        let suggestedDataLabelHeight = 19;

        let d;
        if(dataDrawAreaX < dataDrawAreaY){
            d = dataDrawAreaX/2;
        } else {
            d = dataDrawAreaY/2;
        }

        //the data label position is really the position of the connector of the data label.
        //that's why i need to divide suggestedDataLabelHeight by 2.
        let radiusOfCircleForPositioningLabels = d - suggestedDataLabelHeight / 2;
        let radiusOfPie = radiusOfCircleForPositioningLabels - 30;
        let radiusOfCircleForConnectionLineTurn = radiusOfCircleForPositioningLabels - 20;
        //draw these hateful circle to see what they do if you forget about them.

        return [radiusOfCircleForPositioningLabels, radiusOfPie, radiusOfCircleForConnectionLineTurn];
    }
};