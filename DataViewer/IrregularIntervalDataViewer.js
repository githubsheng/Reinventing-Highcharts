/**
 * Created by wangsheng on 21/6/14.
 */

/**
 * If raw data has irregular interval, then its data viewer class should inherit this class.
 *
 * If raw data is of the same interval, for example day 1, day 2, day 3, day 4, .... day N (the interval is always 1), then
 * it is regular interval data. And its corresponding data viewer(s) class should inherit RegularIntervalData class.
 *
 * If raw data is of the different intervals, for example, day 1, day 3, day 10, day 12 ...., then it is irregular interval data.
 * And its corresponding data viewer(s) class should inherit this class.
 *
 * @constructor
 */
function IrregularIntervalData(){}

IrregularIntervalData.prototype = new DataViewer();
IrregularIntervalData.prototype.constructor = IrregularIntervalData;

/**
 * draws an invisible line that is usually wider than the visible data line. A mouse over listener is attached to this invisible
 * line and it is used to show/hide tips.
 */
IrregularIntervalData.prototype.drawLineTracerAndConfigureTip = function(){

};