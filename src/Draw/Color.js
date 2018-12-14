/**
 * Created by wangsheng on 4/6/14.
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

    initLinearGradients: function(svg){
        /**
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