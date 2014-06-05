/**
 * Created by wangsheng on 4/6/14.
 */

/**
 * creates a x category axis.
 *
 * @param length    excluding the padding.
 * @param numberOfCategories
 * @param originPosition    the origin position may change due to data update (say, a really big number shift the axis to the right).
 * because the origin need to be writable, it cannot be somewhere in the prototype chain(Values in the prototype chain is like retrieval only)
 * @param leftPadding
 * @param rightPadding
 * @constructor
 * */
function X_CategoryAxis(length, numberOfCategories, originPosition, leftPadding, rightPadding){
    this.length = length;
    this.numberOfCategories = numberOfCategories;
    this.markDataInterval = 0;
    this.markPixelInterval = 0;
    this.originPosition = originPosition;
    this.leftPadding = leftPadding;
    this.rightPadding = rightPadding;
}

X_CategoryAxis.prototype = new X_Axis();
X_CategoryAxis.constructor = X_CategoryAxis;

/**
 * adjust the mark pixel interval based on number of categories and length of the axis.
 */
X_CategoryAxis.prototype.adjustMarkInterval = function(){
    //TODO: implement this method
};