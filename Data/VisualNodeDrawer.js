/**
 * Created by wangsheng on 5/6/14.
 */

var visualNodeDrawer = {
    draw: function (nodeShape, nodeColor, x, y) {
        switch (nodeShape) {
            case "circle":
                return this.drawCircleNode(nodeColor, x, y);
            case "rectangular":
                return this.drawRectangularNode(nodeColor, x, y);
            case "triangle":
                return this.drawTriangleNode(nodeColor, x, y);
            case "reverse-triangle":
                return this.drawReverseTriangleNode(nodeColor, x, y);
        }
    },

    /**
     * x y is the center of the node.
     * @param nodeColor
     * @param x
     * @param y
     */
    drawCircleNode: function (nodeColor, x, y) {
        var vn = draw.createCircle(x, y, 4);
        draw.setStrokeFill(vn, colors[nodeColor].nodeStrokeColor, 1, colors[nodeColor].nodeFillColor);
        return vn;
    },

    /**
     * x y is the center of the node.
     * @param nodeColor
     * @param x
     * @param y
     */
    drawRectangularNode: function (nodeColor, x, y) {
        var x = x - 4;
        var y = y - 4;
        var d = "M" + x + " " + y + " " + (x + 8) + " " + y + " " + (x + 8) + " " + (y + 8) + " " + x + " " + (y + 8) + "Z";
        var vn = draw.createPath(d);
        draw.setStrokeFill(vn, colors[nodeColor].nodeStrokeColor, 1, colors[nodeColor].nodeFillColor);
        return vn;
    },

    /**
     * x y is the center of the node.
     * @param nodeColor
     * @param x
     * @param y
     */
    drawTriangleNode: function(nodeColor, x, y){
        var l = 5;
        var h = l * Math.sin(Math.PI / 6);
        var w = l * Math.cos(Math.PI / 6);
        var v = (l + h)/2;
        var d = "M" + x + " " + (y-v) + " " + (x-w) + " " + (y+v) + " " + (x+w) + " " + (y+v) + "Z";
        var vn = draw.createPath(d);
        draw.setStrokeFill(vn, colors[nodeColor].nodeStrokeColor, 1, colors[nodeColor].nodeFillColor);
        return vn;
    },

    drawReverseTriangleNode: function(nodeColor, x, y){
        var l = 5;
        var h = l * Math.sin(Math.PI / 6);
        var w = l * Math.cos(Math.PI / 6);
        var v = (l + h)/2;
        var d = "M" + (x-w) + " " + (y-v) + " " + (x+w) + " " + (y-v) + " " + x + " " + (y+v) + "Z";
        var vn = draw.createPath(d);
        draw.setStrokeFill(vn, colors[nodeColor].nodeStrokeColor, 1, colors[nodeColor].nodeFillColor);
        return vn;
    },

    /**
     * highlight the node.
     * @param visualNode the visual node to highlight
     * @param nodeShape
     */
    highlightNode: function (visualNode, nodeShape, x, y) {
        switch (nodeShape) {
            case "circle":
                visualNode.setAttributeNS(null, "r", "6");
                draw.setStrokeFill(visualNode, false, 3, false);
                break;
            case "rectangular":
                var x = x - 6;
                var y = y - 6;
                var d = "M" + x + " " + y + " " + (x + 12) + " " + y + " " + (x + 12) + " " + (y + 12) + " " + x + " " + (y + 12) + "Z";
                visualNode.setAttributeNS(null, "d", d);
                draw.setStrokeFill(visualNode, false, 3, false);
                break;
            case "triangle":
                var l = 7;
                var h = l * Math.sin(Math.PI / 6);
                var w = l * Math.cos(Math.PI / 6);
                var v = (l + h)/2;
                var d = "M" + x + " " + (y-v) + " " + (x-w) + " " + (y+v) + " " + (x+w) + " " + (y+v) + "Z";
                visualNode.setAttributeNS(null, "d", d);
                draw.setStrokeFill(visualNode, false, 3, false);
                break;
            case "reverse-triangle":
                var l = 7;
                var h = l * Math.sin(Math.PI / 6);
                var w = l * Math.cos(Math.PI / 6);
                var v = (l + h)/2;
                var d = "M" + (x-w) + " " + (y-v) + " " + (x+w) + " " + (y-v) + " " + x + " " + (y+v) + "Z";
                visualNode.setAttributeNS(null, "d", d);
                draw.setStrokeFill(visualNode, false, 3, false);
                break;
        }
    },

    /**
     * dehighlight the node.
     * @param visualNode the visual node highlight
     * @param nodeShape
     */
    deHighLightNode: function (visualNode, nodeShape, x, y) {
        switch (nodeShape) {
            case "circle":
                visualNode.setAttributeNS(null, "r", "4");
                draw.setStrokeFill(visualNode, false, 1, false);
                break;
            case "rectangular":
                var x = x - 4;
                var y = y - 4;
                var d = "M" + x + " " + y + " " + (x + 8) + " " + y + " " + (x + 8) + " " + (y + 8) + " " + x + " " + (y + 8) + "Z";
                visualNode.setAttributeNS(null, "d", d);
                draw.setStrokeFill(visualNode, false, 1, false);
                break;
            case "triangle":
                var l = 5;
                var h = l * Math.sin(Math.PI / 6);
                var w = l * Math.cos(Math.PI / 6);
                var v = (l + h)/2;
                var d = "M" + x + " " + (y-v) + " " + (x-w) + " " + (y+v) + " " + (x+w) + " " + (y+v) + "Z";
                visualNode.setAttributeNS(null, "d", d);
                draw.setStrokeFill(visualNode, false, 1, false);
                break;
            case "reverse-triangle":
                var l = 5;
                var h = l * Math.sin(Math.PI / 6);
                var w = l * Math.cos(Math.PI / 6);
                var v = (l + h)/2;
                var d = "M" + (x-w) + " " + (y-v) + " " + (x+w) + " " + (y-v) + " " + x + " " + (y+v) + "Z";
                visualNode.setAttributeNS(null, "d", d);
                draw.setStrokeFill(visualNode, false, 1, false);
                break;
        }
    }
};
