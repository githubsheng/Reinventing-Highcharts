/**
 * Created by wangsheng on 4/6/14.
 */

var colors = {
    blue: {
        strokeColor: "#0090DB",
        fillColor: "#3FBDFE"
    },

    red: {
        strokeColor: "#AD2000",
        fillColor: "#F22D00"
    },

    green: {
        strokeColor: "#008D3D",
        fillColor: "#00B34D"
    },

    orange: {
        strokeColor: "#D67B00",
        fillColor: "#FF9300"
    },

    linearGradientBlue: {
        id:"linear-gradient-blue",
        use: "url(#linear-gradient-blue)"
    },

    initLinearGradients: function(svg){
        /**
         * <linearGradient x1="0" y1="0" x2="0" y2="1" id="highcharts-4">
         *     <stop offset="0" stop-color="#7cb5ec" stop-opacity="1"></stop>
         *     <stop offset="1" stop-color="rgb(124,181,236)" stop-opacity="0"></stop>
         * </linearGradient>
         */

        var lg_blue = draw.createLinearGradient(["0%", "0%"], ["0%", "100%"]);
        draw.addLinearGradientStop(lg_blue, "0", "#7cb5ec", "1");
        draw.addLinearGradientStop(lg_blue, "1", "rgb(124,181,236)", "0");
        draw.setId(lg_blue, this.linearGradientBlue.id);

        var defs = draw.createDefs();
        defs.appendChild(lg_blue);

        svg.appendChild(defs);
    }
};