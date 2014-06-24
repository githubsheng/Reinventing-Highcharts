/**
 * Created by wangsheng on 27/5/14.
 */

var util = {

    /**
     * TODO: add description
     * @returns {*}
     */
    pickFirstAvailable : function(/*accept any number of arguments*/){
        for(var idx in arguments){
            var argument = arguments[idx];
            if(argument !== undefined && argument !== null){
                return argument;
            }
        }
    },

    /**
     * TODO: add description
     * @param condition
     * @param chooseWhenTrue
     * @param chooseWhenFalse
     * @returns {*}
     */
    chooseBetween: function(condition, chooseWhenTrue, chooseWhenFalse){
        if(condition){
            return chooseWhenTrue;
        } else {
            return chooseWhenFalse;
        }
    },

    /**
     * to cope with floating point accuracy issue.
     */
    perfectNumber: function strip(number) {
        return (parseFloat(number.toPrecision(12)));
    }
};
