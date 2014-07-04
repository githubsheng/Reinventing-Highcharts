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

LayoutNoAxes.prototype.analyze = function(){
    var layout = this;
    var outerAreas = this.calculateOuterAreasSizes();
    var origin = calculateOriginPosition(outerAreas);
    var dataDrawAreaY = outerAreas.leftArea.height;
    var dataDrawAreaX = outerAreas.topArea.width - this.yAxisWidth;
    var radii = calculateSuggestedRadius();

    return {
        originPosition: origin, //TODO: this is not needed and therefore I need to remove it later.
        dataDrawAreaX: dataDrawAreaX,
        dataDrawAreaY: dataDrawAreaY,
        center: [origin[0] + dataDrawAreaX/2, origin[1] - dataDrawAreaY/2],
        radiusOfCircleForPositioningLabels: radii[0],
        radiusOfPie: radii[1]
    };

    function calculateOriginPosition(outerAreas){
        var originX = outerAreas.leftArea.width + layout.yAxisWidth;
        var originY = outerAreas.topArea.height + outerAreas.leftArea.height;
        return [originX, originY];
    }

    function calculateSuggestedRadius(){
        var suggestedDataLabelHeight = 19;

        var d;
        if(dataDrawAreaX > dataDrawAreaY){
            d = dataDrawAreaX/2;
        } else {
            d = dataDrawAreaY/2;
        }

        var radiusOfCircleForPositioningLabels = d - suggestedDataLabelHeight / 2; //the data label position is really the position of the connector of the data label.
        var radiusOfPie = radiusOfCircleForPositioningLabels - 15;

        return [radiusOfCircleForPositioningLabels, radiusOfPie];
    }
};