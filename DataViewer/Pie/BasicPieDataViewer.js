/**
 * Created by wangsheng on 4/7/14.
 */
function BasicPieDataViewer(htmlContainer, svg, svgTrigger, input, center, dataDrawAreaX, dataDrawAreaY, radiusForLabel, radisuForPie, radiusForConnectionLineTurn, total){
    this.htmlContainer = htmlContainer;
    this.svg = svg;
    this.svgTrigger = svgTrigger;
    this.input = input;
    this.center = center;
    this.dataDrawAreaX = dataDrawAreaX;
    this.dataDrawAreaY = dataDrawAreaY;
    this.radiusForLabel = radiusForLabel;
    this.radiusForPie = radisuForPie;
    this.radiusForConnectionLineTurn = radiusForConnectionLineTurn;
    this.total = total;
}

BasicPieDataViewer.prototype.draw = function(){
    var slices = this.analyze();
    var random = new RandomPicker();

    var svgGroup = draw.createGroup();
    var svgTriggerGroup = draw.createGroup();

    var tipControl = new TipControl(this.htmlContainer, 0, true);
    tipControl.createTip();

    var labelSlotsController = new PieDataLabelSlotsController();
    labelSlotsController.generateEmptySlots(19/*label height*/, this.center, this.radiusForLabel, this.svg);

    var leftConnectorsInfo = [];
    var rightConnectorsInfo = [];

    for(var i = 0; i < slices.length; i = i + 4){
        var startAngle = slices[i];
        var endAngle = slices[i+1];
        var seriesName = slices[i+2];
        var dataY = slices[i+3];
        var spsv = new SinglePieSeriesViewer(svgGroup, this.htmlContainer, tipControl, svgTriggerGroup, startAngle,
            endAngle, this.radiusForLabel, this.radiusForPie, this.radiusForConnectionLineTurn, this.center, seriesName, random.pickSeriesColor(), dataY, labelSlotsController);
        var connectorInfo = spsv.getConnectorInfo();

        if(connectorInfo.isLeft){
            leftConnectorsInfo.push(connectorInfo);
        } else {
            rightConnectorsInfo.push(connectorInfo);
        }
        spsv.draw();
    }

    //test start
//    for(var i = 0; i < leftConnectorsInfo.length; i++){
//        svgGroup.appendChild(draw.createCircle(leftConnectorsInfo[i].position[0], leftConnectorsInfo[i].position[1], 2));
//    }
    //test end

    if(!this.input.noDataLabel){
        leftConnectorsInfo = labelSlotsController.processConnectorInfo(leftConnectorsInfo, true);
        rightConnectorsInfo = labelSlotsController.processConnectorInfo(rightConnectorsInfo, false);
        for(var i = 0; i < leftConnectorsInfo.length; i++){
            svgGroup.appendChild(labelSlotsController.createConnectionLine(leftConnectorsInfo[i]));
            svgGroup.appendChild(labelSlotsController.createTextInSlot(leftConnectorsInfo[i].text, leftConnectorsInfo[i].slotIdx, true));
        }

        for(var i = 0; i < rightConnectorsInfo.length; i++){
            svgGroup.appendChild(labelSlotsController.createConnectionLine(rightConnectorsInfo[i]));
            svgGroup.appendChild(labelSlotsController.createTextInSlot(rightConnectorsInfo[i].text, rightConnectorsInfo[i].slotIdx, false));
        }
    }

    this.svg.appendChild(svgGroup);
    this.svgTrigger.appendChild(svgTriggerGroup);
};

BasicPieDataViewer.prototype.analyze = function(){
    var slices = []; //[startAngle, endAngle, seriesName, dataY, startAngle, endAngle, seriesName, dataY....]
    var startAngle = 0;
    for(var i = 0; i < this.input.series.length; i++){
        var single = this.input.series[i][1];
        var angle = (single / this.total) *  360;

        slices.push(startAngle); //start angle.
        slices.push(startAngle + angle); //end angle.
        slices.push(this.input.series[i][0]); //single series name.
        slices.push(single); //single series data.

        startAngle = startAngle + angle;
    }

    return slices;
};