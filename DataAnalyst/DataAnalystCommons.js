/**
 *
 * @type {{isContinual: dataAnalystCommons.isContinual}}
 */
var dataAnalystCommons = {

    /**
     * check if the space is big enough for drawing a node for each data point
     * @param xAxisDataAreaLength   space
     * @param maxNodeCount          max node count
     * @returns {boolean}           if big enough
     */
    isContinual: function(xAxisDataAreaLength, maxNodeCount){
        return xAxisDataAreaLength / maxNodeCount < 20;
    }
};