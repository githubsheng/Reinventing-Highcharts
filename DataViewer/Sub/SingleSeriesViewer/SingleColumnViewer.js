import {draw} from "../../../Draw/Draw";

/**
 * this class is used to draw a single column
 * @constructor
 */
export function SingleColumnViewer(){}

/**
 * draw a single column
 * @param columnBasePositionX
 * @param columnBasePositionY
 * @param columnWidth
 * @param seriesName
 * @param seriesData
 * @param mcColor
 * @param nodes
 * @param svg
 * @param svgTrigger
 * @param tipControl
 * @param htmlContainer
 * @param yDrawInfo
 */
SingleColumnViewer.prototype.draw = function(columnBasePositionX, columnBasePositionY, columnWidth, seriesName,
                                             seriesData, mcColor, nodes, svg, svgTrigger, tipControl, htmlContainer, yDrawInfo) {
    //draw the visual column
    let columnHeight = (seriesData - yDrawInfo.min) * yDrawInfo.pixelPerData;
    let column = draw.createRectangular(columnBasePositionX - columnWidth/2, columnBasePositionY - columnHeight, columnWidth, columnHeight);
    draw.setStrokeFill(column, mcColor.strokeColor, 2, mcColor.fillColor);
    svg.appendChild(column);

    //configure listeners.
    this.enableColumnTip(columnBasePositionX, columnBasePositionY, columnWidth, columnHeight, seriesName, seriesData,
        mcColor, nodes, svgTrigger, tipControl, htmlContainer);
};

/**
 * enable the tooltip for a column
 * @param columnBasePositionX
 * @param columnBasePositionY
 * @param columnWidth
 * @param columnHeight
 * @param seriesName
 * @param columnData
 * @param mcColor
 * @param nodes
 * @param svgTrigger
 * @param tipControl
 * @param htmlContainer
 */
SingleColumnViewer.prototype.enableColumnTip = function(columnBasePositionX, columnBasePositionY, columnWidth, columnHeight,
                                                        seriesName, columnData, mcColor, nodes, svgTrigger, tipControl, htmlContainer){

    let columnTrigger = draw.createRectangular(columnBasePositionX - columnWidth/2, columnBasePositionY - columnHeight,
        columnWidth, columnHeight);

    draw.setStrokeFill(columnTrigger, false, false, "rgb(0,0,0)");
    draw.setVisibility(columnTrigger, false);
    columnTrigger.setAttributeNS(null, "pointer-events", "fill");

    let triggerControl = new TriggerControl(tipControl, seriesName, mcColor);
    triggerControl.enableColumnTrigger(columnTrigger, htmlContainer, seriesName, mcColor, nodes);
    svgTrigger.appendChild(columnTrigger);
};