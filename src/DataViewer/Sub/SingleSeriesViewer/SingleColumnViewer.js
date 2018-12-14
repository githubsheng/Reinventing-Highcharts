import {draw} from "../../../Draw/Draw";

/**
 * this class is used to draw a single column
 * @constructor
 */
export function SingleColumnViewer(){}

/**
 * draw a single column
 * @param columnBasePositionX       the position of the column (the column base, not the center of the column)
 * @param columnBasePositionY       the position of the column (the column base, not the center of the column)
 * @param columnWidth               width of the column
 * @param seriesName                name of the series
 * @param seriesData                data of the series
 * @param mcColor                   color the series, used both for the tooltip and column
 * @param nodes                     nodes
 * @param svg                       svg container to which we will append the svg elements
 * @param svgTrigger                tooltip trigger
 * @param tipControl                tooltip control, used for tool tip related stuffs
 * @param htmlContainer             html container, we append the tool tips (html elements) to it
 * @param yDrawInfo                 extra info for drawing the column
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
 * @param columnBasePositionX       the position of the column (the column base, not the center of the column)
 * @param columnBasePositionY       the position of the column (the column base, not the center of the column)
 * @param columnWidth               width of the column
 * @param columnHeight              height of the column
 * @param seriesName                name of the series
 * @param columnData                data of the series / column
 * @param mcColor                   color the series, used both for the tooltip and column
 * @param nodes                     nodes
 * @param svgTrigger                tooltip trigger
 * @param tipControl                tooltip control, used for tool tip related stuffs
 * @param htmlContainer             html container, we append the tool tips (html elements) to it
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