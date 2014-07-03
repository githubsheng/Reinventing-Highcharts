/**
 * Created by wangsheng on 30/6/14.
 */
var dataAnalystCommons = {

    isContinual: function(xAxisDataAreaLength, maxNodeCount){
        if(xAxisDataAreaLength / maxNodeCount < 20){
            return true;
        } else {
            return false;
        }
    }
};