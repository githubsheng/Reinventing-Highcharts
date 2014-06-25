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
    perfectNumber: function (number) {
        return (parseFloat(number.toPrecision(12)));
    },

    /**
     * If target is not inside the array at all, then this method will return the index of the element that is
     * closest to the target.
     *
     *
     * @param array
     * @param target
     */
    findElementIdxUsingBinarySearch: function(array, target){
        var startIdx = 0;
        var endIdx = array.length - 1;
        var half = 0;

        while(endIdx - startIdx > 1){
            half = Math.floor((endIdx - startIdx)/2);
            if(target < array[startIdx + half]) {
                endIdx = startIdx + half;
            } else {
                startIdx = startIdx + half;
            }
        }

        /*
            when the codes reaches here, there are only two elements sitting next to each other,
            and the target is either one of them, or between them. (if between them then the target
            not in the array. we choose the closet element.
         */

        var a = target - array[startIdx];
        var b = array[endIdx] - target;
        if(a < b) {
            return startIdx;
        } else if (a > b){
            return endIdx;
        } else {
            return startIdx;
        }
    }

};