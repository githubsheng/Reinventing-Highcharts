/**
 * Created by wangsheng on 26/5/14.
 */

/**
 * TODO: organize all these methods into different types.
 * creates all kinds of paths, lines, and shapes
 */
var draw = {
    xml_namespace: "http://www.w3.org/2000/svg",

    /*----create tags-----*/

    /**
     * Creates an path.
     *
     * @param coordinatesAndCommands    the d attribute value.
     * @returns {SVGElement}   the path that is created
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
     * @param x
     * @param y
     * @param coordinates an array containing those coordinates [1,2,2,1,3,4] for examples means three points. first point is 1, 2 and second is 2,1.
     * @returns {SVGElement}   the path that is created
     */
    createStraightLines: function(coordinates, stride, offset){
        var d = "M" + coordinates[offset] + " " + coordinates[offset + 1];
        for(var i = stride; i < coordinates.length; i = i + stride){
            d = d + " " + coordinates[i] + " " + coordinates[i + 1];
        }
        return this.createPath(d);
    },

    /**
     * create a single line
     *
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     * @returns {SVGELement} the line that is created.
     */
    createStraightLine: function(x1, y1, x2, y2){
        var line = document.createElementNS(this.xml_namespace, "line");
        line.setAttributeNS(null, "x1", x1);
        line.setAttributeNS(null, "y1", y1);
        line.setAttributeNS(null, "x2", x2);
        line.setAttributeNS(null, "y2", y2);
        line.setAttributeNS(null, "stroke", "black");
        return line;
    },

    /**
     * create a svg text element.
     *
     * @param x
     * @param y
     * @param text
     * @param fontSize
     * @param align should be either "start", "middle" or "end"
     * @param vertical align should be "middle", or null if you just want default.
     * @returns {SVGELement}
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
     * create a text span
     * @param x
     * @param y
     * @param text
     * @param fontSize
     * @param align
     * @param verticalAlign
     */
    createTextSpan: function(x, y, text, fontSize, align, verticalAlign){
        var t = document.createElementNS(this.xml_namespace, "tspan");
        if(x !== false) {
            t.setAttributeNS(null, "x", x);
        }

        if(y !== false){
            t.setAttributeNS(null, "y", y);
        }

        if(fontSize){
            t.setAttributeNS(null, "font-size", fontSize);
        } else {
            t.setAttributeNS(null, "font-size", "11");
        }

        if(align){
            t.setAttributeNS(null, "text-anchor", align);
        }
        if(verticalAlign){
            t.setAttributeNS(null, "dominant-baseline", verticalAlign);
        }

        return t;
    },

    /**
     * create a rectangular.
     *
     * @param x
     * @param y
     * @param width
     * @param height
     * @returns {SVGELement}
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
     *
     * @param x
     * @param y
     * @param radius
     * @param stroke
     * @param strokeWidth
     * @param fill
     * @returns {SVGELement}
     */
    createCircle: function(x, y, radius){
        //<circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
        var c = document.createElementNS(this.xml_namespace, "circle");
        c.setAttributeNS(null, "cx", x);
        c.setAttributeNS(null, "cy", y);
        c.setAttributeNS(null, "r", radius);
        return c;
    },

    /*create structures*/

    /**
     * create a group with the given id
     * @param id
     * @returns {SVGELement}
     */
    createGroup: function(){
        var g = document.createElementNS(this.xml_namespace, "g");
        return g;
    },


    /*-----transforms-----*/

    /**
     * rotate a svg element.
     * @param x
     * @param y
     * @param angle
     * @param svgElement
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
     * translate a svg element.
     *
     * @param x
     * @param y
     * @param angle
     * @param {SVGELement}
     */
    translate: function(svgElement, x, y){
        var transform = svgElement.getAttributeNS(null, "transform");
        if(transform){
            var transforms = transform.split(") ");
            for(var i = 0; i < transforms.length; i++){
                if(transforms[i].substr(0, 9) === "translate") {
                    transforms[i] = "translate(" + x + " " + y + ")";
                }
            }
            transform = transforms.join(" ");

        } else {
            transform = "translate(" + x + " " + y + ")";
        }
        svgElement.setAttributeNS(null, "transform", transform);
    },

    /**
     * as the name tells...
     * @param svgElement
     * @param scaleFactor
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

    /*----presentation attributes----*/

    /**
     * set the stroke, stroke-width and fill
     * @param svgElement
     * @param stroke
     * @param strokeWidth
     * @param fill
     */
    setStrokeFill: function(svgElement, stroke, strokeWidth, fill){
        if(stroke){
            svgElement.setAttributeNS(null, "stroke", stroke);
        }
        if(strokeWidth !== 0){
            svgElement.setAttributeNS(null, "stroke-width", strokeWidth);
        }
        if(fill){
            svgElement.setAttributeNS(null, "fill", fill);
        }
    },

    /**
     * configure the visibility of an element.
     * @param svgElement
     * @param isVisible
     */
    setVisibility: function(svgElement, isVisible){
        if(isVisible){
            svgElement.setAttributeNS(null, "visibility", "visibile");
        } else {
            svgElement.setAttributeNS(null, "visibility", "hidden");
        }
    },

    /*-----other attributes-----*/
    /**
     * set an id for an element
     * @param id
     * @param svgElement
     */
    setId: function(svgElement, id){
        svgElement.setAttribute("id", id);
    }

};