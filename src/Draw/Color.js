/**
 * utility class for colors. we will be only using certain colors in this library, and all of them should be defined
 * here.
 */
export const colors = {
    blue: {
        strokeColor: "rgb(0, 122, 204)",
        fillColor: "rgb(0, 153, 255)",
        linearGradientId:"linear-gradient-blue",
        linearGradientFill: "url(#linear-gradient-blue)"
    },

    purple: {
        strokeColor: "rgb(82, 0, 163)",
        fillColor: "rgb(102, 0, 204)",
        linearGradientId: "linear-gradient-purple",
        linearGradientFill: "url(#linear-gradient-purple)"
    },

    lightBlue: {
        strokeColor: "rgb(52, 147, 184)",
        fillColor: "rgb(62, 195, 246)",
        linearGradientId: "linear-gradient-lightBlue",
        linearGradientFill: "url(#linear-gradient-lightBlue)"
    },

    green: {
        strokeColor: "rgb(0, 163, 122)",
        fillColor: "rgb(0, 204, 153)",
        linearGradientId:"linear-gradient-green",
        linearGradientFill: "url(#linear-gradient-green)"
    },

    darkGreen: {
        strokeColor: "rgb(35, 156, 97)",
            fillColor: "rgb(0, 180, 94)",
            linearGradientId:"linear-gradient-darkGreen",
            linearGradientFill: "url(#linear-gradient-darkGreen)"
    },

    red: {
        strokeColor: "rgb(173, 32, 0)",
        fillColor: "rgb(255, 87, 45)",
        linearGradientId:"linear-gradient-red",
        linearGradientFill: "url(#linear-gradient-red)"
    },

    yellow: {
        strokeColor: "rgb(163, 122, 0)",
        fillColor: "rgb(204, 153, 0)",
        linearGradientId:"linear-gradient-yellow",
        linearGradientFill: "url(#linear-gradient-yellow)"
    },

    /**
     * creates all the gradients, which we will be using extensively in drawing all kinds of charts
     * @param svg   the svg element. all the gradients definitions will be appended to this svg element.
     */
    initLinearGradients: function(svg){
        /**
         * well, here is an sample. here is basically the transition of colors starts (using the target element as coordinate system)
         * at 0,0 and goes to 0,1. This means its a vertical transition
         * <linearGradient x1="0" y1="0" x2="0" y2="1" id="highcharts-4">
         *     <stop offset="0" stop-color="#7cb5ec" stop-opacity="1"></stop>
         *     <stop offset="1" stop-color="rgb(124,181,236)" stop-opacity="0"></stop>
         * </linearGradient>
         */
        var defs = draw.createDefs();

        createLinearGradient(this.blue);
        createLinearGradient(this.purple);
        createLinearGradient(this.red);
        createLinearGradient(this.lightBlue);
        createLinearGradient(this.green);
        createLinearGradient(this.darkGreen);
        createLinearGradient(this.yellow);

        svg.appendChild(defs);

        function createLinearGradient(mcColor){
            var lg = draw.createLinearGradient(["0%", "0%"], ["0%", "100%"]);
            draw.addLinearGradientStop(lg, "0", mcColor.fillColor, "1");
            draw.addLinearGradientStop(lg, "1", mcColor.fillColor, "0");
            draw.setId(lg, mcColor.linearGradientId);
            defs.appendChild(lg);
        }
    },

    /**
     * converts a rgb color like rgb(213, 231, 100) to an webgl format, which is basically an array
     * of three elements: red, green and blue.
     * @param rgb
     * @returns {string[]}      the webgl color format
     */
    convertToWebGLcolorArray: function(rgb){
        var rgbComponents = rgb.substring(4, rgb.length-1)
            .replace(/ /g, '')
            .split(',');
        rgbComponents[0] = +(rgbComponents[0]) / 255;
        rgbComponents[1] = +(rgbComponents[1]) / 255;
        rgbComponents[2] = +(rgbComponents[2]) / 255;
        return rgbComponents;
    }
};