/**
 * Created by wangsheng on 4/6/14.
 */

/**
 * creates
 * @param length    length does not include left padding or right padding.
 * @param min
 * @param max
 * @param originPosition
 * @param leftPadding
 * @param rightPadding
 * @constructor
 */
function X_CategoryAxis(svg, length, originPosition, categoriesNames, leftPadding, rightPadding){
    this.svg = svg;
    this.originPosition = originPosition;
    this.length = length;
    this.markPixelInterval = 0;
    this.markPositions = [];
    this.labelPositions = [];
    this.originPosition = originPosition;
    this.categoriesNames = categoriesNames;
    //category axis has fixed left and right padding.
    this.leftPadding = leftPadding;
    this.rightPadding = rightPadding;

}

X_CategoryAxis.prototype = new X_Axis();
X_CategoryAxis.constructor = X_CategoryAxis;

/**
 * adjust the mark pixel interval based on number of categories and length of the axis.
 */
X_CategoryAxis.prototype.adjustMarkInterval = function(){
    this.markPixelInterval = this.length / this.categoriesNames.length;
};

X_CategoryAxis.prototype.calculateMarkPositions = function(){
    let firstMarkPositionX = this.originPosition[0] + this.leftPadding;
    let markPositionY = this.originPosition[1];
    this.markPositions.push(firstMarkPositionX);
    this.markPositions.push(markPositionY);

    for(let i = 0; i < this.categoriesNames.length; i++){
        this.markPositions.push(firstMarkPositionX + this.markPixelInterval * (i + 1));
        this.markPositions.push(markPositionY);
    }
};

X_CategoryAxis.prototype.calculateLabelPositions = function(){
    let halfMarkInterval = this.markPixelInterval / 2;
    let l = this.markPositions.length - 2; //最后一个mark不需要
    for(let i = 0; i < l; i = i + 2){
        this.labelPositions.push(this.markPositions[i] + halfMarkInterval);
        this.labelPositions.push(this.markPositions[i+1] + 5);
    }
};

X_CategoryAxis.prototype.drawLabels = function(){
    for(let i = 0; i < this.labelPositions.length; i = i + 2){
        let categoryName = this.categoriesNames[i/2];
        let label = draw.createText(this.labelPositions[i], this.labelPositions[i+1], categoryName, false, "middle", "top");
        this.svg.appendChild(label);
    }
};

X_CategoryAxis.prototype.analyzeReturn = function() {
    let categoryBasePositions = [];
    for(let i = 0; i < this.labelPositions.length; i = i + 2){
        categoryBasePositions.push(this.labelPositions[i]);
        categoryBasePositions.push(this.labelPositions[i + 1] - 5);//because when calculating the label positions i shift them 5 px down from the origin Y
    }

    //adjust the column width.based on the mark interval
    let columnWidth;
    if(this.markPixelInterval < 8){
        columnWidth = 4;
    } else if (this.markPixelInterval > 40){
        columnWidth = 40;
    } else {
        columnWidth = this.markPixelInterval / 2;
    }

    return {
        categoryBasePositions: categoryBasePositions,
        columnWidth: columnWidth
    };
};

