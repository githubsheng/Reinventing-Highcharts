(function(){
    let input = {
        series : {
            rows : [ "Apple", "Orange", "Plum", "Pineapple"],
            columns : [ "Frequently", "occasionally", "Never" ],
            data : [ [ 101, 122, 143 ], [ 111, 122, 143 ], [ 91, 112, 153 ], [ 34, 78, 26 ] ],
            focus: [[0, 0], [2, 0], [3, 2], [1, 2]]
        },
        rowLegend: "top",
        columnLegend: "bottom",
        mainTitle: "How Often Do Normal People Eat These Kinds Of Fruits",
        subTitle: "The data is collected from somewhere",
        startAngle : -0.6283185307179586
    };

    weaver.weave("3dGrid", input, document.getElementById("container9"));
})();

(function(){
    let input = {
        mainTitle: "Market Share in Mars",
        subTitle: "This chart displays the data label",
        series: [
            ["A Company", 45],
            ["B Company", 1],
            ["C Company", 1],
            ["D Company", 1],
            ["E Company", 1],
            ["F Company", 1],
            ["G Company", 22],
            ["H Company", 1],
            ["I Company", 1],
            ["J Company", 1],
            ["K Company", 1]
        ],
        legend: "right",
        noDataLabel: false
    };

    weaver.weave("basicPieChart", input, document.getElementById("container8"));
})();

//basic irregular discrete data
(function () {
    //this serves as the discrete irregular data demo
    let seriesName1 = "Pencil sales";
    let data1 = [
        [2, 3],
        [10, 50],
        [12, 65],
        [23, 43],
        [31, 140],
        [52, 69],
        [63, 73],
        [87, 77]
    ];

    let seriesName2 = "Pen sales";
    let data2 = [
        [2, 32],
        [10, 21],
        [12, 42],
        [23, 35],
        [31, 111],
        [52, 142],
        [63, 65],
        [87, 72]
    ];

    let seriesName3 = "Eraser sales";
    let data3 = [
        [2, 22],
        [10, 29],
        [12, 53],
        [23, 46],
        [31, 93],
        [52, 78],
        [63, 93],
        [87, 65]
    ];

    let seriesName4 = "Ruler sales";
    let data4 = [
        [2, 12],
        [10, 23],
        [12, 46],
        [23, 57],
        [31, 83],
        [52, 65],
        [63, 100],
        [87, 88]
    ];

    let input = {
        mainTitle: "Sales of our company in 2019 (Irregular intervals)",
        subTitle: "The data set is small and is displayed as discrete nodes.",
        yAxisTitle: "number of items sold",
        xAxisTitle: "now I can't find a title for this axis",
        series: [
            [seriesName1, data1],
            [seriesName2, data2],
            [seriesName3, data3],
            [seriesName4, data4]
        ],
        legend: "left"
    };
    weaver.weave("basicLineIrregular", input, document.getElementById("container1"));
})();

//basic irregular continual data.
(function () {
    //this serves as the continual irregular data demo
    let data1 = [
        [0, -3],
        [2, -1],
        [4, -9],
        [5, -2],
        [6, -6],
        [7, -7],
        [8, 13],
        [9, 14],
        [11, 17],
        [13, 19],
        [15, 21],
        [16, 22],
        [18, 25],
        [19, 16],
        [20, 24],
        [22, 23],
        [23, 29],
        [24, 29],
        [26, 28],
        [28, 29],
        [30, 29],
        [32, 39],
        [33, 36],
        [34, 32],
        [35, 32],
        [37, 43],
        [38, 43],
        [39, 43],
        [40, 43],
        [41, 39],
        [43, 42],
        [44, 51],
        [45, 44],
        [47, 53],
        [48, 51],
        [49, 48],
        [50, 47],
        [52, 50],
        [53, 53],
        [55, 56],
        [56, 59],
        [58, 59],
        [60, 65],
        [62, 67],
        [63, 67],
        [65, 64],
        [67, 65],
        [69, 76],
        [71, 75],
        [72, 78],
        [73, 70],
        [74, 76],
        [75, 82],
        [77, 81],
        [79, 79],
        [81, 84],
        [83, 81],
        [85, 89],
        [86, 85],
        [87, 93],
        [88, 88],
        [89, 90],
        [91, 90],
        [93, 92],
        [94, 95],
        [95, 101],
        [96, 101],
        [98, 99],
        [99, 106]

    ];

    let data2 = [
        [0, 19],
        [1, 14],
        [3, 16],
        [5, 13],
        [6, 24],
        [7, 18],
        [9, 23],
        [11, 18],
        [13, 31],
        [15, 30],
        [16, 26],
        [17, 25],
        [18, 35],
        [20, 40],
        [22, 33],
        [23, 42],
        [25, 36],
        [27, 42],
        [29, 48],
        [31, 47],
        [32, 40],
        [34, 48],
        [36, 55],
        [37, 51],
        [39, 57],
        [41, 49],
        [42, 60],
        [44, 65],
        [46, 62],
        [47, 59],
        [48, 70],
        [49, 59],
        [50, 71],
        [51, 60],
        [52, 70],
        [53, 67],
        [55, 73],
        [57, 76],
        [59, 70],
        [61, 70],
        [62, 82],
        [63, 72],
        [64, 81],
        [65, 82],
        [66, 85],
        [67, 84],
        [69, 80],
        [71, 85],
        [72, 81],
        [74, 86],
        [75, 91],
        [76, 93],
        [77, 98],
        [79, 88],
        [80, 94],
        [81, 100],
        [83, 100],
        [84, 91],
        [85, 105],
        [86, 95],
        [87, 96],
        [89, 106],
        [90, 101],
        [91, 112],
        [93, 102],
        [95, 109],
        [96, 118],
        [97, 107],
        [99, 115]
    ];

    let input = {
        mainTitle: "Sales of our company in 2019 (Irregular intervals)",
        subTitle: "The quantity of the data set is large and displayed as stream",
        yAxisTitle: "number of items sold",
        xAxisTitle: "now I can't find a title for this axis",
        series: [
            ["Pencil sales", data1],
            ["Pen sales", data2]
        ],
        legend: "top"
    };
    weaver.weave("basicLineIrregular", input, document.getElementById("container2"));
})();

//basic regular continual data.
(function(){
    let seriesName1 = "A Company";
    let data1 = [
        0.8446, 0.8445, 0.8444, 0.8451,    0.8418, 0.8264,    0.8258, 0.8232,    0.8233, 0.8258,
        0.8283, 0.8278, 0.8256, 0.8292,    0.8239, 0.8239,    0.8245, 0.8265,    0.8261, 0.8269,
        0.8273, 0.8244, 0.8244, 0.8172,    0.8139, 0.8146,    0.8164, 0.82,    0.8269, 0.8269,
        0.8269, 0.8258, 0.8247, 0.8286,    0.8289, 0.8316,    0.832, 0.8333,    0.8352, 0.8357,
        0.8355, 0.8354, 0.8403, 0.8403,    0.8406, 0.8403,    0.8396, 0.8418,    0.8409, 0.8384,
        0.8386, 0.8372, 0.839, 0.84, 0.8389, 0.84, 0.8423, 0.8423, 0.8435, 0.8422,
        0.838, 0.8373, 0.8316, 0.8303,    0.8303, 0.8302,    0.8369, 0.84, 0.8385, 0.84,
        0.8401, 0.8402, 0.8381, 0.8351,    0.8314, 0.8273,    0.8213, 0.8207,    0.8207, 0.8215,
        0.8242, 0.8273, 0.8301, 0.8346,    0.8312, 0.8312,    0.8312, 0.8306,    0.8327, 0.8282,
        0.824, 0.8255, 0.8256, 0.8273, 0.8209, 0.8151, 0.8149, 0.8213, 0.8273, 0.8273,
        0.8261, 0.8252, 0.824, 0.8262, 0.8258, 0.8261, 0.826, 0.8199, 0.8153, 0.8097,
        0.8101, 0.8119, 0.8107, 0.8105,    0.8084, 0.8069,    0.8047, 0.8023,    0.7965, 0.7919,
        0.7921, 0.7922, 0.7934, 0.7918,    0.7915, 0.787, 0.7861, 0.7861, 0.7853, 0.7867,
        0.7827, 0.7834, 0.7766, 0.7751, 0.7739, 0.7767, 0.7802, 0.7788, 0.7828, 0.7816,
        0.7829, 0.783, 0.7829, 0.7781, 0.7811, 0.7831, 0.7826, 0.7855, 0.7855, 0.7845
    ];

    let seriesName2 = "B Company";
    let data2 = [
        0.7798, 0.7777, 0.7822, 0.7785, 0.7744, 0.7743, 0.7726, 0.7766, 0.7806, 0.785,
        0.7907, 0.7912, 0.7913, 0.7931, 0.7952, 0.7951, 0.7928, 0.791, 0.7913, 0.7912,
        0.7941, 0.7953, 0.7921, 0.7919, 0.7968, 0.7999, 0.7999, 0.7974, 0.7942, 0.796,
        0.7969, 0.7862, 0.7821, 0.7821, 0.7821, 0.7811, 0.7833, 0.7849, 0.7819, 0.7809,
        0.7809, 0.7827, 0.7848, 0.785, 0.7873, 0.7894, 0.7907, 0.7909, 0.7947, 0.7987,
        0.799, 0.7927, 0.79, 0.7878, 0.7878, 0.7907, 0.7922, 0.7937, 0.786, 0.787,
        0.7838, 0.7838, 0.7837, 0.7836, 0.7806, 0.7825, 0.7798, 0.777, 0.777, 0.7772,
        0.7793, 0.7788, 0.7785, 0.7832, 0.7865, 0.7865, 0.7853, 0.7847, 0.7809, 0.778,
        0.7799, 0.78, 0.7801, 0.7765, 0.7785, 0.7811, 0.782, 0.7835, 0.7845, 0.7844,
        0.782, 0.7811, 0.7795, 0.7794, 0.7806, 0.7794, 0.7794, 0.7778, 0.7793, 0.7808,
        0.7824, 0.787, 0.7894, 0.7893, 0.7882, 0.7871, 0.7882, 0.7871, 0.7878, 0.79,
        0.7901, 0.7898, 0.7879, 0.7886, 0.7858, 0.7814, 0.7825, 0.7826, 0.7826, 0.786,
        0.7878, 0.7868, 0.7883, 0.7893, 0.7892, 0.7876, 0.785, 0.787, 0.7873, 0.7901,
        0.7936, 0.7939, 0.7938, 0.7956, 0.7975, 0.7978, 0.7972, 0.7995, 0.7995, 0.7994,
        0.7976, 0.7977, 0.796, 0.7922, 0.7928, 0.7929, 0.7948, 0.797, 0.7953, 0.7907
    ];

    let input = {
        mainTitle: "Stock Prices Comparison (Regular interval)",
        subTitle: "Regular data set allows for a lot of optimization",
        yAxisTitle: "Stock Price",
        xAxisTitle: "Company Sales",
        start: 201,
        interval: 5,
        series: [
            [seriesName1, data1],
            [seriesName2, data2]
        ],
        legend: "right"
    };

    weaver.weave("basicLineRegular", input, document.getElementById("container3"));
})();

//single time series.
(function(){
    let seriesName = "Total Sales";
    let data = [
        0.8446, 0.8445, 0.8444, 0.8451,    0.8418, 0.8264,    0.8258, 0.8232,    0.8233, 0.8258,
        0.8283, 0.8278, 0.8256, 0.8292,    0.8239, 0.8239,    0.8245, 0.8265,    0.8261, 0.8269,
        0.8273, 0.8244, 0.8244, 0.8172,    0.8139, 0.8146,    0.8164, 0.82,    0.8269, 0.8269,
        0.8269, 0.8258, 0.8247, 0.8286,    0.8289, 0.8316,    0.832, 0.8333,    0.8352, 0.8357,
        0.8355, 0.8354, 0.8403, 0.8403,    0.8406, 0.8403,    0.8396, 0.8418,    0.8409, 0.8384,
        0.8386, 0.8372, 0.839, 0.84, 0.8389, 0.84, 0.8423, 0.8423, 0.8435, 0.8422,
        0.838, 0.8373, 0.8316, 0.8303,    0.8303, 0.8302,    0.8369, 0.84, 0.8385, 0.84,
        0.8401, 0.8402, 0.8381, 0.8351,    0.8314, 0.8273,    0.8213, 0.8207,    0.8207, 0.8215,
        0.8242, 0.8273, 0.8301, 0.8346,    0.8312, 0.8312,    0.8312, 0.8306,    0.8327, 0.8282,
        0.824, 0.8255, 0.8256, 0.8273, 0.8209, 0.8151, 0.8149, 0.8213, 0.8273, 0.8273,
        0.8261, 0.8252, 0.824, 0.8262, 0.8258, 0.8261, 0.826, 0.8199, 0.8153, 0.8097,
        0.8101, 0.8119, 0.8107, 0.8105,    0.8084, 0.8069,    0.8047, 0.8023,    0.7965, 0.7919,
        0.7921, 0.7922, 0.7934, 0.7918,    0.7915, 0.787, 0.7861, 0.7861, 0.7853, 0.7867,
        0.7827, 0.7834, 0.7766, 0.7751, 0.7739, 0.7767, 0.7802, 0.7788, 0.7828, 0.7816,
        0.7829, 0.783, 0.7829, 0.7781, 0.7811, 0.7831, 0.7826, 0.7855, 0.7855, 0.7845,
        0.7798, 0.7777, 0.7822, 0.7785, 0.7744, 0.7743, 0.7726, 0.7766, 0.7806, 0.785,
        0.7907, 0.7912, 0.7913, 0.7931, 0.7952, 0.7951, 0.7928, 0.791, 0.7913, 0.7912,
        0.7941, 0.7953, 0.7921, 0.7919, 0.7968, 0.7999, 0.7999, 0.7974, 0.7942, 0.796,
        0.7969, 0.7862, 0.7821, 0.7821, 0.7821, 0.7811, 0.7833, 0.7849, 0.7819, 0.7809,
        0.7809, 0.7827, 0.7848, 0.785, 0.7873, 0.7894, 0.7907, 0.7909, 0.7947, 0.7987,
        0.799, 0.7927, 0.79, 0.7878, 0.7878, 0.7907, 0.7922, 0.7937, 0.786, 0.787,
        0.7838, 0.7838, 0.7837, 0.7836, 0.7806, 0.7825, 0.7798, 0.777, 0.777, 0.7772,
        0.7793, 0.7788, 0.7785, 0.7832, 0.7865, 0.7865, 0.7853, 0.7847, 0.7809, 0.778,
        0.7799, 0.78, 0.7801, 0.7765, 0.7785, 0.7811, 0.782, 0.7835, 0.7845, 0.7844,
        0.782, 0.7811, 0.7795, 0.7794, 0.7806, 0.7794, 0.7794, 0.7778, 0.7793, 0.7808,
        0.7824, 0.787, 0.7894, 0.7893, 0.7882, 0.7871, 0.7882, 0.7871, 0.7878, 0.79,
        0.7901, 0.7898, 0.7879, 0.7886, 0.7858, 0.7814, 0.7825, 0.7826, 0.7826, 0.786,
        0.7878, 0.7868, 0.7883, 0.7893, 0.7892, 0.7876, 0.785, 0.787, 0.7873, 0.7901,
        0.7936, 0.7939, 0.7938, 0.7956, 0.7975, 0.7978, 0.7972, 0.7995, 0.7995, 0.7994,
        0.7976, 0.7977, 0.796, 0.7922, 0.7928, 0.7929, 0.7948, 0.797, 0.7953, 0.7907,
        0.7872, 0.7852, 0.7852, 0.786, 0.7862, 0.7836, 0.7837, 0.784, 0.7867, 0.7867,
        0.7869, 0.7837, 0.7827, 0.7825, 0.7779, 0.7791, 0.779, 0.7787, 0.78, 0.7807,
        0.7803, 0.7817
    ];

    let input = {
        mainTitle: "Sales of our company in 2019",
        subTitle: "Time series adjusts the axis and tip presentation",
        yAxisTitle: "number of items sold",
        xAxisTitle: "now I can't find a title for this axis",
        startTime: Date.UTC(2014, 5, 21, 13, 5),
        interval: 5,
        unit: "m",
        series: [
            [seriesName, data]
        ],
        legend: "none"
    };

    weaver.weave("singleTime", input, document.getElementById("container4"));
})();

(function(){
    let seriesName1 = "Pencil sales";
    let data1 = -2;

    let seriesName2 = "Pen sales";
    let data2 = 3;

    let seriesName3 = "Eraser sales";
    let data3 = 4.5;

    let seriesName4 = "Ruler sales";
    let data4 = 3;

    let input = {
        mainTitle: "Sales of our company in 2019",
        subTitle: "Data from sales department",
        yAxisTitle: "number of items sold",
        xAxisTitle: "now I can't find a title for this axis",
        series: [
            [seriesName1, data1],
            [seriesName2, data2],
            [seriesName3, data3],
            [seriesName4, data4]
        ],
        legend: "bottom"
    };

    weaver.weave("basicCategory", input, document.getElementById("container5"));
})();

(function(){
    let input = {
        mainTitle: "Stock Prices Comparison (Regular interval)",
        subTitle: "Regular data set allows for a lot of optimization",
        yAxisTitle: "Stock Price",
        xAxisTitle: "Company Sales",
        start: 201,
        interval: 5,
        series: [
            ["A Company", [23, 43, 87, 212, 413, 757, 1292]],
            ["B Company", [16, 35, 73, 134, 254, 432, 932]],
            ["C Company", [20, 38, 65, 142, 253, 432, 831]],
            ["D Company", [12, 27, 54, 122, 287, 532, 1032]]
        ],
        legend: "right"
    };

    weaver.weave("basicStackRegular", input, document.getElementById("container6"));
})();

(function(){
    let input = {
        mainTitle: "Market Share in Mars",
        subTitle: "This chart does not display the data label",
        series: [
            ["A Company", 23],
            ["B Company", 42],
            ["C Company", 1],
            ["D Company", 1],
            ["E Company", 19],
            ["F Company", 3]
        ],
        legend: "bottom",
        noDataLabel: true
    };

    weaver.weave("basicPieChart", input, document.getElementById("container7"));
})();