/**
 * Created by wangsheng on 4/6/14.
 */

var colors = {
    blue: {
        strokeColor: "#0090DB",
        fillColor: "#3FBDFE",
        linearGradientId:"linear-gradient-blue",
        linearGradientFill: "url(#linear-gradient-blue)"
    },

    red: {
        strokeColor: "#AD2000",
        fillColor: "#FF5C33",
        linearGradientId:"linear-gradient-red",
        linearGradientFill: "url(#linear-gradient-red)"
    },

    green: {
        strokeColor: "#008D3D",
        fillColor: "#00B34D",
        linearGradientId:"linear-gradient-green",
        linearGradientFill: "url(#linear-gradient-green)"
    },

    orange: {
        strokeColor: "#D67B00",
        fillColor: "#FFCC66",
        linearGradientId:"linear-gradient-orange",
        linearGradientFill: "url(#linear-gradient-orange)"
    },

    initLinearGradients: function(svg){
        /**
         * <linearGradient x1="0" y1="0" x2="0" y2="1" id="highcharts-4">
         *     <stop offset="0" stop-color="#7cb5ec" stop-opacity="1"></stop>
         *     <stop offset="1" stop-color="rgb(124,181,236)" stop-opacity="0"></stop>
         * </linearGradient>
         */
        var defs = draw.createDefs();

        var lg_blue = draw.createLinearGradient(["0%", "0%"], ["0%", "100%"]);
        draw.addLinearGradientStop(lg_blue, "0", this.blue.fillColor, "1");
        draw.addLinearGradientStop(lg_blue, "1", this.blue.fillColor, "0");
        draw.setId(lg_blue, this.blue.linearGradientId);
        defs.appendChild(lg_blue);

        var lg_red = draw.createLinearGradient(["0%", "0%"], ["0%", "100%"]);
        draw.addLinearGradientStop(lg_red, "0", this.red.fillColor, "1");
        draw.addLinearGradientStop(lg_red, "1", this.red.fillColor, "0");
        draw.setId(lg_red, this.red.linearGradientId);
        defs.appendChild(lg_red);

        var lg_green = draw.createLinearGradient(["0%", "0%"], ["0%", "100%"]);
        draw.addLinearGradientStop(lg_green, "0", this.green.fillColor, "1");
        draw.addLinearGradientStop(lg_green, "1", this.green.fillColor, "0");
        draw.setId(lg_green, this.green.linearGradientId);
        defs.appendChild(lg_green);

        var lg_orange = draw.createLinearGradient(["0%", "0%"], ["0%", "100%"]);
        draw.addLinearGradientStop(lg_orange, "0", this.orange.fillColor, "1");
        draw.addLinearGradientStop(lg_orange, "1", this.orange.fillColor, "0");
        draw.setId(lg_orange, this.orange.linearGradientId);
        defs.appendChild(lg_orange);

        svg.appendChild(defs);
    }
};