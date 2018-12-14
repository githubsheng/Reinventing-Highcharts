/**
 * Created by wangsheng on 5/6/14.
 */

export const nodeDrawer = {
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
     * x y is the center of the node.
     * @param mcColor
     * @param x
     * @param y
     * @param radius
     * @param strokeWidth
     */
    drawCircleNode: function (mcColor, x, y, radius, strokeWidth) {
        var vn = draw.createCircle(x, y, radius);
        draw.setStrokeFill(vn, mcColor.strokeColor, strokeWidth, mcColor.fillColor);
        return vn;
    },

    /**
     * x y is the center of the node.
     * @param mcColor
     * @param x
     * @param y
     * @param width
     * @param height
     * @param strokeWidth
     */
    drawRectangularNode: function (mcColor, x, y, width, height, strokeWidth) {
        var x = x - width/2;
        var y = y - height/2;
        var d = "M" + x + " " + y + " " + (x + width) + " " + y + " " + (x + width) + " " + (y + height) + " " + x + " " + (y + height) + "Z";
        var vn = draw.createPath(d);
        draw.setStrokeFill(vn, mcColor.strokeColor, strokeWidth, mcColor.fillColor);
        return vn;
    },

    /**
     * x y is the center of the node.
     * @param mcColor
     * @param x
     * @param y
     * @param size
     * @param strokeWidth
     */
    drawTriangleNode: function(mcColor, x, y, size, strokeWidth){
        var h = size * Math.sin(Math.PI / 6);
        var w = size * Math.cos(Math.PI / 6);
        var v = (size + h)/2;
        var d = "M" + x + " " + (y-v) + " " + (x-w) + " " + (y+v) + " " + (x+w) + " " + (y+v) + "Z";
        var vn = draw.createPath(d);
        draw.setStrokeFill(vn, mcColor.strokeColor, strokeWidth, mcColor.fillColor);
        return vn;
    },

    /**
     * x y is the center of the node
     * @param mcColor
     * @param x
     * @param y
     * @param size
     * @param strokeWidth
     * @returns {SVGElement}
     */
    drawReverseTriangleNode: function(mcColor, x, y, size, strokeWidth){
        var h = size * Math.sin(Math.PI / 6);
        var w = size * Math.cos(Math.PI / 6);
        var v = (size + h)/2;
        var d = "M" + (x-w) + " " + (y-v) + " " + (x+w) + " " + (y-v) + " " + x + " " + (y+v) + "Z";
        var vn = draw.createPath(d);
        draw.setStrokeFill(vn, mcColor.strokeColor, strokeWidth, mcColor.fillColor);
        return vn;
    },

    /**
     * draws a section that is used to trigger tip / visual node highlight.
     * @param pixelX
     * @param pixelY
     * @param nodesStrideIdx
     * @returns {SVGELement}
     */
    drawTrigger: function(pixelX, pixelY, nodesStrideIdx){
        var trigger = draw.createCircle(pixelX, pixelY, 10); //this is the part that triggers things.
        draw.setStrokeFill(trigger, false, false, "rgba(0,0,0,0)");
        trigger.ws_nodesStrideIdx = nodesStrideIdx;
        return trigger;
    }
};
