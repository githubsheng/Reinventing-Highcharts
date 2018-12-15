import {RandomPicker} from "../Util/RandomPicker";
import {draw} from "../Draw/Draw";
import {util} from "../Util/Util";
import {nodeDrawer} from "../Draw/NodeDrawer";

/**
 * creates a legend. the legend created is highly customizable..and hence the amount of parameters we need to consider.
 * after an instance of legend is created, we first need to provide data and run `analyze` method, to determine the width
 * , height and other information dynamically, before we can draw the legend.
 */
export function Legend(svg, multipleSeries, positionRelativeToLayout, shape, color){
    this.svg = svg;
    this.height = 0;
    this.width = 0;
    this.rowHeight = 25;
    this.fontSize = 15;
    this.multipleSeries = multipleSeries;
    this.positionRelativeToLayout = positionRelativeToLayout;
    this.shape = shape;
    this.color = color;
    this.legendSVG_Group = draw.createGroup();
}

Legend.prototype.analyze = function(directMultipleSeriesName, includeNodeShape){
    if(this.positionRelativeToLayout === "none") return;

    this.svg.appendChild(this.legendSVG_Group);
    let randomPicker = new RandomPicker();

    let multipleSeriesNames;
    if(!directMultipleSeriesName){
        multipleSeriesNames = [];
        for(let i = 0; i < this.multipleSeries.length; i++){
            multipleSeriesNames.push(this.multipleSeries[i][0]);
        }
    } else {
        multipleSeriesNames = directMultipleSeriesName;
    }

    //vertical
    if(this.positionRelativeToLayout === "left" || this.positionRelativeToLayout === "right"){
        for(let i = 0; i < multipleSeriesNames.length; i++){
            let singleSeriesName = multipleSeriesNames[i];
            let legendText = draw.createText(20, this.rowHeight * i + this.rowHeight/2, singleSeriesName, this.fontSize, "start", "middle");

            this.legendSVG_Group.appendChild(legendText);
            if(includeNodeShape === undefined /*not specified, by default we include it.*/ || includeNodeShape === true){
                let singleSeriesNode = nodeDrawer.draw(
                    util.pickFirstAvailable(this.shape, randomPicker.pickNodeShape()),
                    util.pickFirstAvailable(this.color, randomPicker.pickSeriesColor()),
                    10,
                    this.rowHeight * i + this.rowHeight/2);
                this.legendSVG_Group.appendChild(singleSeriesNode);
            }
        }
    }

    //horizontal
    if(this.positionRelativeToLayout === "top" || this.positionRelativeToLayout === "bottom"){
        let columnWidth = 0;
        for(let i = 0; i < multipleSeriesNames.length; i++){
            let singleSeriesName = multipleSeriesNames[i];
            let legendText = draw.createText(10 + columnWidth, this.rowHeight/2, singleSeriesName, this.fontSize, "start", "middle");
            this.legendSVG_Group.appendChild(legendText);

            if(includeNodeShape === undefined /*not specified, by default we include it.*/ || includeNodeShape === true){
                let singleSeriesNode = nodeDrawer.draw(
                    util.pickFirstAvailable(this.shape, randomPicker.pickNodeShape()),
                    util.pickFirstAvailable(this.color, randomPicker.pickSeriesColor()),
                    columnWidth,
                    this.rowHeight/2);
                this.legendSVG_Group.appendChild(singleSeriesNode);
            }

            columnWidth = columnWidth + 30 + legendText.getBoundingClientRect().width;
        }
    }
    draw.setVisibility(this.legendSVG_Group, false);
    this.width = this.legendSVG_Group.getBoundingClientRect().width;
    this.height = this.legendSVG_Group.getBoundingClientRect().height;
};

/**
 * draws the legend. x y should be the center of the legend.
 * @param x
 * @param y
 */
Legend.prototype.draw = function(x, y){
    x = x - this.width / 2;
    y = y - this.height / 2;
    draw.translate(this.legendSVG_Group, x, y);
    draw.setVisibility(this.legendSVG_Group, true);
};