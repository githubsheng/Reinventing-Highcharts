/**
 * Created by wangsheng on 8/7/14.
 */
function PieSliceTriggerControl(){}

PieSliceTriggerControl.prototype.enablePieSliceTrigger = function(trigger, triggerCenter, tipControl, seriesName, mcColor, dataY){
    trigger.addEventListener("mouseover", function(){
        tipControl.genericShowTip(triggerCenter[0], triggerCenter[1], seriesName, mcColor, 0, dataY);
    });

    trigger.addEventListener("mouseout", function(){
        tipControl.hideTip();
    });
};

/*
 function TriggerControl(tipControl, seriesName, mcColor){
 this.tipControl = tipControl;
 this.seriesName = seriesName;
 this.mcColor = mcColor;
 this.sharedSeriesInfo = this.tipControl.sharedSeriesInfo;
 }
 */