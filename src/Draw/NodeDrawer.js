/**
 * offers convenient methods to draw colorful circles, rectangulars and so on.
 */
import {draw} from "./Draw";

export const nodeDrawer = {

    /**
     * draws a standard shape, using the given color
     * @param nodeShape                 the shape: circle | rectangular | triangle | reverse-triangle
     * @param mcColor                   color defined in `Color.js`
     * @param x                         position of the shape
     * @param y                         position of the shape
     * @returns {SVGCircleElement | SVGPathElement | SVGRectElement}    the shaped created
     */
    draw: function (nodeShape, mcColor, x, y) {
        switch (nodeShape) {
            case "circle":
                return this.drawCircleNode(mcColor, x, y, 4, 1);
            case "rectangular":
                return this.drawRectangularNode(mcColor, x, y, 8, 8, 1);
            case "triangle":
                return this.drawTriangleNode(mcColor, x, y, 5, 1);
            case "reverse-triangle":
                return this.drawReverseTriangleNode(mcColor, x, y, 5, 1);
        }
    },

    /**
     * draws a highlighted shape, using the given color, the shape is positioned at the origin
     * if u need the highlight a (original) node, you should apply transform.translate to a highlighted node
     * and position it above the original node.
     *
     * @param nodeShape                 the shape: circle | rectangular | triangle | reverse-triangle
     * @param mcColor                   color defined in `Color.js`
     * @returns {SVGCircleElement | SVGPathElement | SVGRectElement}    the shaped created
     */
    drawHighlightedNode: function(nodeShape, mcColor) {
        switch (nodeShape) {
            case "circle":
                return this.drawCircleNode(mcColor, 0, 0, 6, 3);
            case "rectangular":
                return this.drawRectangularNode(mcColor, 0, 0, 12, 12, 3);
            case "triangle":
                return this.drawTriangleNode(mcColor, 0, 0, 7, 3);
            case "reverse-triangle":
                return this.drawReverseTriangleNode(mcColor, 0, 0, 7, 3);
        }
    },

    /**
     * draws a circle element with given color, radius and stroke width
     * @param x             center of the circle node
     * @param y             center of the circle node
     * @param mcColor       color
     * @param radius        radius
     * @param strokeWidth   stroke width
     * @returns {SVGCircleElement}  returns a svg circle
     */
    drawCircleNode: function (mcColor, x, y, radius, strokeWidth) {
        let vn = draw.createCircle(x, y, radius);
        draw.setStrokeFill(vn, mcColor.strokeColor, strokeWidth, mcColor.fillColor);
        return vn;
    },

    /**
     * draws a rectangular svg element
     * @param x                     top left of the rectangular
     * @param y                     top left of the rectangular
     * @param mcColor               color
     * @param width                 width of the rectangular
     * @param height                height of the rectangular
     * @param strokeWidth           stroke width
     * @returns {SVGRectElement}    returns a svg rectangular with the above settings.
     */
    drawRectangularNode: function (mcColor, x, y, width, height, strokeWidth) {
        x = x - width/2;
        y = y - height/2;
        let d = "M" + x + " " + y + " " + (x + width) + " " + y + " " + (x + width) + " " + (y + height) + " " + x + " " + (y + height) + "Z";
        let vn = draw.createPath(d);
        draw.setStrokeFill(vn, mcColor.strokeColor, strokeWidth, mcColor.fillColor);
        return vn;
    },

    /**
     * draws a path that forms a triangle
     * @param x                     center of the triangle
     * @param y                     center of the triangle
     * @param mcColor               color
     * @param size                  size of the triangle
     * @param strokeWidth           stroke width
     * @returns {SVGPathElement}    the triangle path.
     */
    drawTriangleNode: function(mcColor, x, y, size, strokeWidth){
        let h = size * Math.sin(Math.PI / 6);
        let w = size * Math.cos(Math.PI / 6);
        let v = (size + h)/2;
        let d = "M" + x + " " + (y-v) + " " + (x-w) + " " + (y+v) + " " + (x+w) + " " + (y+v) + "Z";
        let vn = draw.createPath(d);
        draw.setStrokeFill(vn, mcColor.strokeColor, strokeWidth, mcColor.fillColor);
        return vn;
    },

    /**
     * draws a reversed triangle
     * @param x                     center of the triangle
     * @param y                     center of the triangle
     * @param mcColor               color
     * @param size                  size of the triangle
     * @param strokeWidth           stroke width
     * @returns {SVGPathElement}    the triangle path.
     */
    drawReverseTriangleNode: function(mcColor, x, y, size, strokeWidth){
        let h = size * Math.sin(Math.PI / 6);
        let w = size * Math.cos(Math.PI / 6);
        let v = (size + h)/2;
        let d = "M" + (x-w) + " " + (y-v) + " " + (x+w) + " " + (y-v) + " " + x + " " + (y+v) + "Z";
        let vn = draw.createPath(d);
        draw.setStrokeFill(vn, mcColor.strokeColor, strokeWidth, mcColor.fillColor);
        return vn;
    },

    /**
     * draws a section that is used to trigger tip / visual node highlight. normally we create a trigger for a data
     * point, and a data point is usually just an element to in an array. the node stride idx tells the stride idx
     * of the data point. so that when the triggered emits some events, we can easily find out the responding data point.
     * @param pixelX                the center of the trigger
     * @param pixelY                the center of the trigger
     * @param nodesStrideIdx        node stride idx.
     * @returns {SVGCircleElement}
     */
    drawTrigger: function(pixelX, pixelY, nodesStrideIdx){
        let trigger = draw.createCircle(pixelX, pixelY, 10); //this is the part that triggers things.
        draw.setStrokeFill(trigger, false, false, "rgba(0,0,0,0)");
        trigger.ws_nodesStrideIdx = nodesStrideIdx;
        return trigger;
    }
};
