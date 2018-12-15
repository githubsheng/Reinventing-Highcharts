/**
 * offer fundamental methods to create svg elements, including groups, defs, shapes(like circles)
 * offer fundamental methods to style an svg element
 */
export const draw = {
    xml_namespace: "http://www.w3.org/2000/svg",

    /*
    ####### create tags ########
    */
    /**
     * Creates an path a path svg element
     *
     * @param coordinatesAndCommands    the d attribute value.
     * @returns {SVGPathElement}   the path created
     */
    createPath: function(coordinatesAndCommands){
        //path sample: <path d="M150 0 L75 200 L225 200 Z" />
        var path = document.createElementNS(this.xml_namespace, "path");
        path.setAttributeNS(null, "d", coordinatesAndCommands);
        return path;
    },

    /**
     * create a path composed by only straight lines.
     *
     * @param coordinates       an array that contains information of coordinates. However, this array may also contain information of other stuffs.
     * @param stride            stride....see offset for more explanation.
     * @param offset            Example: if the stride is 4 and the offset is 1, then it means in each 4 elements, the 2nd element will be x, and the 3rd
     *                          will be y.
     * @returns {SVGPathElement}   the path created.
     */
    createStraightLines: function(coordinates, stride, offset){
        var d = "M" + coordinates[offset] + " " + coordinates[offset + 1];
        for(var i = stride; i < coordinates.length; i = i + stride){
            d = d + " " + coordinates[i] + " " + coordinates[i + 1];
        }
        return this.createPath(d);
    },

    /**
     * this creates something like this. the coordinates creates the the line that sits on the top.
     * this is mainly useful for stack charts.
     *
     *       __    /|
     *      /  \__/ |
     *      |       |
     *      |_______|
     * left bottom  right bottom
     * corner       corner
     *
     * @param coordinates   we use the coordinates to draw the top line
     * @param stride        see `createStraightLines` for more explanation
     * @param offset        see `createStraightLines` for more explanation
     * @param leftBottomCorner  the left bottom corner of the stack
     * @param rightBottomCorner the right bottom corner of the stack
     *
     * @return {SVGPathElement} the stack created.
     */
    createStackWithStraightLines: function(coordinates, stride, offset, rightBottomCorner, leftBottomCorner){
        var d = "M" + coordinates[offset] + " " + coordinates[offset + 1];
        for(var i = stride; i < coordinates.length; i = i + stride){
            d = d + " " + coordinates[i] + " " + coordinates[i + 1];
        }
        d = d + " " + rightBottomCorner[0] + " " + rightBottomCorner[1] + " " + leftBottomCorner[0] + " " + leftBottomCorner[1] + " " + "Z";
        return this.createPath(d);
    },

    /**
     * creates a quadratic bezier curve
     * @param coordinates the coordinates of the bezier curve. the first coordinate is the start, the second one is the "curve point",
     * the last one specifies the end of the curve
     *
     * @returns {SVGPathElement} the curve created.
     */
    createQuadraticBezierCurve: function(coordinates){
        var d = "M" + coordinates[0] + " " + coordinates[1] + " Q " + coordinates[2] + " " + coordinates[3] + " " + coordinates[4] + " " + coordinates[5];
        return this.createPath(d);
    },

    /**
     * create a svg text element.
     *
     * @param x             the coordinate of the text
     * @param y             the coordinate of the text
     * @param text          content
     * @param fontSize      font size
     * @param align         means horizontal alignment, should be either "start", "middle" or "end"
     * @param verticalAlign means vertical alignment, should be "middle", or null if you just want default.
     * @returns {SVGTextElement} the text created
     */
    createText: function(x, y, text, fontSize, align, verticalAlign){
        var t = document.createElementNS(this.xml_namespace, "text");
        t.setAttributeNS(null, "x", x);
        t.setAttributeNS(null, "y", y);

        if(fontSize){
            t.setAttributeNS(null, "font-size", fontSize);
        } else {
            t.setAttributeNS(null, "font-size", "11");
        }

        if(align){
            t.setAttributeNS(null, "text-anchor", align);
        }
        if(verticalAlign === "middle"){
            t.setAttributeNS(null, "dy", "0.3em");
        } else if (verticalAlign === "top"){
            t.setAttributeNS(null, "dy", "1em");
        }
        if(text !== false){
            t.textContent = text;
        }
        return t;
    },

    /**
     * create a rectangular.
     *
     * @param x         top left of the rectangular
     * @param y         top left of the rectangular
     * @param width     width
     * @param height    height
     * @returns {SVGRectElement} the rectangular created
     */
    createRectangular: function(x, y, width, height){
        var r = document.createElementNS(this.xml_namespace, "rect");
        r.setAttributeNS(null, "x", x);
        r.setAttributeNS(null, "y", y);
        r.setAttributeNS(null, "width", width);
        r.setAttributeNS(null, "height", height);
        return r;
    },

    /**
     * create a circle
     *
     * @param x             the center of the circle
     * @param y             the center of the circle
     * @param radius        radius of the circle
     * @returns {SVGCircleElement} the circle created
     */
    createCircle: function(x, y, radius){
        //<circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
        var c = document.createElementNS(this.xml_namespace, "circle");
        c.setAttributeNS(null, "cx", x);
        c.setAttributeNS(null, "cy", y);
        c.setAttributeNS(null, "r", radius);
        return c;
    },

    /**
     * create an arc of circle, that is, creates an "incomplete" circle.
     *
     * @param x             the center of the circle
     * @param y             the center of the circle
     * @param radius        radius of the circle
     * @param startAngle    where does the arc starts
     * @param endAngle      where does the arc ends
     * @returns {SVGPathElement}    the arc represented as a svg element.
     */
    createArcOfCircle: function (x, y, radius, startAngle, endAngle){
        var start = util.polarToCartesian(x, y, radius, endAngle);
        var end = util.polarToCartesian(x, y, radius, startAngle);

        var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

        var d = [
            "M", x, y,
            "", start[0], start[1],
            "A", radius, radius, 0, arcSweep, 0, end[0], end[1],
            "Z"
        ].join(" ");

        return this.createPath(d);
    },

    /*
    ######## create structures ########
    */

    /**
     * create a svg group with the given id
     * @returns {SVGGElement} the "group" svg element.
     */
    createGroup: function(){
        var g = document.createElementNS(this.xml_namespace, "g");
        return g;
    },

    /**
     * create a <defs> tag.
     * @return {SVGDefsElement} the "defs" svg element
     */
    createDefs: function(){
        var d = document.createElementNS(this.xml_namespace, "defs");
        return d;
    },


    /*-----transforms-----*/

    /**
     * rotate a svg element. you can also apply this to an svg element that already has a transform attribute.
     * existing transform attribute such as translate wont be overridden.
     * @param x     center of the rotation
     * @param y     center of the rotation
     * @param angle angle of the rotation
     * @param svgElement    the svg element being rotated.
     */
    rotate: function(svgElement, x, y, angle){
        var transform = svgElement.getAttributeNS(null, "transform");
        if(transform){
            var transforms = transform.split(") ");
            for(var i = 0; i < transforms.length; i++){
                if(transforms[i].substr(0, 6) === "rotate") {
                    transforms[i] = "rotate(" + angle + " " + x + " " + y + ")";
                }
            }
            transform = transforms.join(" ");

        } else {
            transform = "rotate(" + angle + " " + x + " " + y + ")";
        }
        svgElement.setAttributeNS(null, "transform", transform);
    },

    /**
     * translate an svg element. you can even apply this function to an svg element that already
     * has transform attribute. other transform attribute such as rotate will not be overridden.
     *
     * @param svgElement    the svg element being translated.
     * @param x             distance to translate in x axis
     * @param y             distance to translate in y axis
     */
    translate: function(svgElement, x, y){
        var translate = "translate(" + x + "px, " + y + "px)";
        svgElement.style.MozTransform = translate;
        svgElement.style.webkitTransform = translate;
        svgElement.style.msTransform = translate;
        svgElement.style.transform = translate;
    },

    /**
     * scale an svg element. you can even apply this function to an svg element that already
     * has transform attribute. other transform attribute such as rotate will not be overridden.
     *
     * @param svgElement    the svg element being scaled.
     * @param scaleFactor   the scale
     */
    scale: function(svgElement, scaleFactor){
        var transform = svgElement.getAttributeNS(null, "transform");
        if(transform){
            var transforms = transform.split(") ");
            for(var i = 0; i < transforms.length; i++){
                if(transforms[i].substr(0, 5) === "scale") {
                    transforms[i] = "scale(" +  scaleFactor + ")";
                }
            }
            transform = transforms.join(" ");

        } else {
            transform = "scale(" + scaleFactor + ")";
        }
        svgElement.setAttributeNS(null, "transform", transform);
    },

    /*
    ######## presentation attributes ########
    */

    /**
     * set the stroke, stroke-width and fill
     * @param svgElement    the svg element to which we are setting style.
     * @param stroke        stroke color
     * @param strokeWidth   stroke width
     * @param fill          fill color
     */
    setStrokeFill: function(svgElement, stroke, strokeWidth, fill){
        if(stroke){
            svgElement.setAttributeNS(null, "stroke", stroke);
        }
        if(strokeWidth !== false){
            svgElement.setAttributeNS(null, "stroke-width", strokeWidth);
        }
        if(fill){
            svgElement.setAttributeNS(null, "fill", fill);
        }
    },

    /**
     * this function creates a svg linear gradient. it should be used together with addLinearGradientStop
     * @param startPosition     needs to be [percentage, percentage]
     * @param endPosition       needs to be [percentage, percentage]
     * @returns {SVGLinearGradientElement}  the linear gradient svg element created.
     */
    createLinearGradient: function(startPosition, endPosition){
        var linearGraident = document.createElementNS(this.xml_namespace, "linearGradient");
        linearGraident.setAttributeNS(null, "x1", startPosition[0]);
        linearGraident.setAttributeNS(null, "y1", startPosition[1]);
        linearGraident.setAttributeNS(null, "x2", endPosition[0]);
        linearGraident.setAttributeNS(null, "y2", endPosition[1]);
        return linearGraident;
    },

    /**
     * add a linear stop color to a linear gradient svg element
     * @param linearGradient    linearGradient
     * @param stopPosition      stopPosition
     * @param stopRawColor      stopRawColor
     * @param stopOpacity       stopOpacity
     */
    addLinearGradientStop: function(linearGradient, stopPosition, stopRawColor, stopOpacity){
        //<stop offset=".8" stop-color="black" stop-opacity="0.5"/>
        var stop = document.createElementNS(this.xml_namespace, "stop");
        stop.setAttributeNS(null, "offset", stopPosition);
        stop.setAttributeNS(null, "stop-color", stopRawColor);
        if(stopOpacity){
            stop.setAttributeNS(null, "stop-opacity", stopOpacity);
        }

        linearGradient.appendChild(stop);
    },

    /**
     * configure the visibility of an element.
     * @param svgElement        target svg element
     * @param isVisible         visible or hidden
     */
    setVisibility: function(svgElement, isVisible){
        if(isVisible){
            svgElement.setAttributeNS(null, "visibility", "visibile");
        } else {
            svgElement.setAttributeNS(null, "visibility", "hidden");
        }
    },

    /**
     * configure pointer events. https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/pointer-events
     * basically, if fill, then when mouse over filled area, registered call back will be invoked
     * if stroke, then when mouse over the stroke area, registered call back will be invoked.
     * @param svgElement        target svg element
     * @param fill              sets pointer-events to fill
     * @param stroke            sets pointer0events to stroke.
     */
    setPointerEvent: function(svgElement, fill, stroke){
        if(fill){
            svgElement.setAttributeNS(null, "pointer-events", "fill");
        }

        if(stroke){
            svgElement.setAttributeNS(null, "pointer-events", "stroke");
        }
    },

    /*
    ######## other attributes ########
    */
    /**
     * set an id for an element
     * @param id            the new id
     * @param svgElement    target svg element
     */
    setId: function(svgElement, id){
        svgElement.setAttribute("id", id);
    }

};