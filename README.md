# Reinventing-Highcharts

This chart library renders various kinds of charts using `svg` / `canvas` / `webgl`.

This library only uses a library called glmatrix, for fast matrix calculation.

# To use the library

You can copy the `bundle.js` in the `dist` folder to your own repository. Here are some samples of how to use the library.

A live demo can be found here: xxxx

![alt text](https://raw.githubusercontent.com/githubsheng/Reinventing-Highcharts/master/etc/demo-image/3d-chart.png)

```js
let input = {
    series : {
        rows : [ "Apple", "Orange", "Plum", "Pineapple"],
        columns : [ "Frequently", "occasionally", "Never" ],
        data : [[101, 122, 143], [111, 122, 143], [91, 112, 153], [34, 78, 26]],
        focus: [[0, 0], [2, 0], [3, 2], [1, 2]]
    },
    rowLegend: "top",
    columnLegend: "bottom",
    mainTitle: "How Often Do Normal People Eat These Kinds Of Fruits",
    subTitle: "The data is collected from somewhere",
    startAngle : -0.6283185307179586
};

weaver.weave("3dGrid", input, document.getElementById("container9"));
```
