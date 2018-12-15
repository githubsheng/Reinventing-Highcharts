/**
 * this tool tip control manages the tool tip for a series in a pie chart.
 * @constructor
 */
export function PieSliceTriggerControl(){}

PieSliceTriggerControl.prototype.enablePieSliceTrigger = function(trigger, triggerCenter, tipControl, seriesName, mcColor, dataY){
    trigger.addEventListener("mouseover", function(){
        tipControl.genericShowTip(triggerCenter[0], triggerCenter[1], seriesName, mcColor, 0, dataY);
    });

    trigger.addEventListener("mouseout", function(){
        tipControl.hideTip();
    });
};