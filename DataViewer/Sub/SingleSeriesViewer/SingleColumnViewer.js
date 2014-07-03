/**
 * Created by wangsheng on 30/6/14.
 */

function SingleColumnViewer(){}

SingleColumnViewer.prototype.draw = function(columnBasePositionX, columnBasePositionY, columnWidth, seriesName,
                                             seriesData, mcColor, nodes, svg, svgTrigger, tipControl, htmlContainer, yDrawInfo) {
    //draw the visual column
    var columnHeight = (seriesData - yDrawInfo.min) * yDrawInfo.pixelPerData;
    var column = draw.createRectangular(columnBasePositionX - columnWidth/2, columnBasePositionY - columnHeight, columnWidth, columnHeight);
    draw.setStrokeFill(column, mcColor.strokeColor, 2, mcColor.fillColor);
    svg.appendChild(column);

    //configure listeners.
    this.enableColumnTip(columnBasePositionX, columnBasePositionY, columnWidth, columnHeight, seriesName, seriesData,
        mcColor, nodes, svgTrigger, tipControl, htmlContainer);
};

SingleColumnViewer.prototype.enableColumnTip = function(columnBasePositionX, columnBasePositionY, columnWidth, columnHeight,
                                                        seriesName, columnData, mcColor, nodes, svgTrigger, tipControl, htmlContainer){

    var columnTrigger = draw.createRectangular(columnBasePositionX - columnWidth/2, columnBasePositionY - columnHeight,
        columnWidth, columnHeight);

    draw.setStrokeFill(columnTrigger, false, false, "rgb(0,0,0)");
    draw.setVisibility(columnTrigger, false);
    columnTrigger.setAttributeNS(null, "pointer-events", "fill");

    var triggerControl = new TriggerControl(tipControl, seriesName, mcColor);
    triggerControl.enableColumnTrigger(columnTrigger, htmlContainer, seriesName, mcColor, nodes);
    svgTrigger.appendChild(columnTrigger);
};