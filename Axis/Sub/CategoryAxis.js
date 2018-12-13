/**
 * this class creates a x axis for category charts
 * @param svg               this is the svg element to which we will be appending new svg element
 * @param length            length of the axis. length does not include left padding or right padding.
 * @param categoriesNames   the names of the categories, we need to render them as labels along the axis
 * @param originPosition    the origin position of the cartesian coordinate system.
 * @param leftPadding       the left padding of the axis
 * @param rightPadding      the right padding of the axis
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

//this class extends X_Axis
X_CategoryAxis.prototype = new X_Axis();
X_CategoryAxis.constructor = X_CategoryAxis;

/**
 * adjust the mark pixel interval based on number of categories and length of the axis.
 */
X_CategoryAxis.prototype.adjustMarkInterval = function(){
    this.markPixelInterval = this.length / this.categoriesNames.length;
};

/**
 * calculate the mark pixel positions
 */
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

/**
 * calculate the positions of the labels
 */
X_CategoryAxis.prototype.calculateLabelPositions = function(){
    let halfMarkInterval = this.markPixelInterval / 2;
    let l = this.markPositions.length - 2; //最后一个mark不需要
    for(let i = 0; i < l; i = i + 2){
        this.labelPositions.push(this.markPositions[i] + halfMarkInterval);
        this.labelPositions.push(this.markPositions[i+1] + 5);
    }
};

/**
 * draw the labels below the axis
 */
X_CategoryAxis.prototype.drawLabels = function(){
    for(let i = 0; i < this.labelPositions.length; i = i + 2){
        let categoryName = this.categoriesNames[i/2];
        let label = draw.createText(this.labelPositions[i], this.labelPositions[i+1], categoryName, false, "middle", "top");
        this.svg.appendChild(label);
    }
};


/**
 * based on the mark pixel intervals and label positions, analyze the positions of category column positions
 * and the column width
 * @returns {{categoryBasePositions: Array, columnWidth: number}} a tuple of: category column positions and column width
 */
X_CategoryAxis.prototype.analyzeReturn = function() {
    let categoryBasePositions = [];
    for(let i = 0; i < this.labelPositions.length; i = i + 2){
        categoryBasePositions.push(this.labelPositions[i]);
        //because when calculating the label positions i shift them 5 px down from the origin Y
        categoryBasePositions.push(this.labelPositions[i + 1] - 5);
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

