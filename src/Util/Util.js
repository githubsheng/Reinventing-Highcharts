/**
 * just some friendly neighborhood utility methods.
 */
export const util = {

    /**
     * takes any number of parameter, will return the first none null / undefined parameter
     * @returns {*}
     */
    pickFirstAvailable : function(/*accept any number of arguments*/){
        for(let idx in arguments){
            let argument = arguments[idx];
            if(argument !== undefined && argument !== null){
                return argument;
            }
        }
    },

    /**
     * just another version of a ? c : d;
     * @param condition             a condition that evaluates to true or false.
     * @param chooseWhenTrue        returned when condition is true
     * @param chooseWhenFalse       returned when condition is false
     * @returns {*}
     */
    chooseBetween: function(condition, chooseWhenTrue, chooseWhenFalse){
        return condition ? chooseWhenTrue : chooseWhenFalse;
    },

    /**
     * to cope with floating point accuracy issue.
     * @param {Number} number   a number
     * @returns {Number}        returnsa number whose precision is 12.
     */
    perfectNumber: function (number) {
        return (parseFloat(number.toPrecision(12)));
    },

    /**
     * If target is not inside the array at all, then this method will return the index of the element that is
     * closest to the target.
     *
     * @param array     a sorted array
     * @param target    we will search this element
     * @returns {Number}         the (closest) element idx.
     */
    findElementIdxUsingBinarySearch: function(array, target){
        let startIdx = 0;
        let endIdx = array.length - 1;
        let half = 0;

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
            not in the array. we choose the closet element).
         */
        let a = target - array[startIdx];
        let b = array[endIdx] - target;
        if(a < b) {
            return startIdx;
        } else if (a > b){
            return endIdx;
        } else {
            return startIdx;
        }
    },

    /**
     * converts polar coordinates to cartesian coordinates
     * @param centerX
     * @param centerY
     * @param radius
     * @param angleInDegrees
     * @returns {number[]} an array, first element is x coordinate and second is y coordinate
     */
    polarToCartesian: function(centerX, centerY, radius, angleInDegrees) {
        let angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

        return [
            centerX + (radius * Math.cos(angleInRadians)),
            centerY + (radius * Math.sin(angleInRadians))
        ];
    }
};