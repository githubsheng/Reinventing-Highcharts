
function convertToCuboidModels(input/*an array of array*/, htmlContainer, staticTipControlTopShift, isStaticTipControlSingleLine, focusList){
    var cuboidList = [];

    var CUBOID_X_INTERVAL = 4; //间距
    var CUBOID_Z_INTERVAL = 8;

    var data = input.data;
    var meta = input.meta;
    var CuboidModel = threeModels.CuboidModel;

	var numOfRows = data.length;
	var numOfColumns = data[0].length;
    var minMax = getMinMax(data);
	var biggestInData = minMax.biggestInData;
    var smallestInData = minMax.smallestInData;
    var greatestDataRange = biggestInData - smallestInData;
    var random = new RandomPicker();
    for(var rowIdx = 0; rowIdx < numOfRows; rowIdx++){
        var mcColor = random.pickSeriesColor();

        for(var colIdx = 0; colIdx < numOfColumns; colIdx++){

			var translateX = (CUBOID_X_INTERVAL * rowIdx) - ((numOfRows - 1) * CUBOID_X_INTERVAL) / 2;
			var translateZ = (CUBOID_Z_INTERVAL * colIdx) - ((numOfColumns - 1) * CUBOID_Z_INTERVAL) / 2;
			
			var scaleFactor = ((data[rowIdx][colIdx] - smallestInData) / greatestDataRange) * 8;
			if(scaleFactor < 0.05){
				scaleFactor = 0.05; //in case it is so small that we end up with z fighting.
			}
			var translateY = scaleFactor;
			var translate = [translateX, translateY, translateZ];
			
			var scale = [1, scaleFactor, 1];

            var cuboid = new CuboidModel(translate, scale, mcColor, data[rowIdx][colIdx], meta.rows[rowIdx], meta.columns[colIdx], htmlContainer, staticTipControlTopShift, isStaticTipControlSingleLine);
            cuboidList.push(cuboid);

		}
	}

    //now set the focus
    if(focusList){
        for(var fi = 0; fi < focusList.length; fi++){
            rowIdx = focusList[fi][0];
            colIdx = focusList[fi][1];
            cuboidList[rowIdx * numOfColumns + colIdx].setFocus();
        }
    }


    return cuboidList;
}

function createLabelPlanes(input, gl, offScreenCanvas){
    var planeList = [];

    var columns = input.meta.columns;
    var numOfRows = input.meta.rows.length;
    var CUBOID_X_INTERVAL = 4;
    var CUBOID_Z_INTERVAL = 8;
    var labelGenerator = canvasLabelGenerator.create(offScreenCanvas);

    var PlaneModel = threeModels.PlaneModel;



    //create one label plane for each column
    for(var i = 0; i < columns.length; i++) {
        var text = columns[i];
        var labelImageInfo = labelGenerator.generateLabelImageDataBasedOnText(text);


        //每一个label的长度都是不确定的，随着字数的变化而变化，但是它们的宽度必然是确定的，也就是2，2也是我所用的长方体的底面任何一边的长度。
        //label的长度对应的字的长度，而label的宽度对应字的高度。字的高度是固定的，20px，同理label的宽度也是固定的，2个世界坐标系里的长度，由此可以推断出这里px到世界坐标的转换比例
        var labelLength = labelImageInfo.textWidth * (2/labelImageInfo.textHeight);
        var scale = [labelLength/2, 1, 1];

        var translateX = (((numOfRows-1) * CUBOID_X_INTERVAL) + 2) / 2 + labelLength/2;
        var translateZ = (CUBOID_Z_INTERVAL * i) - ((columns.length - 1) * CUBOID_Z_INTERVAL) / 2;
        var translate = [translateX, 0, translateZ];

        var labelPlane = new PlaneModel(translate, scale, false);
        labelPlane.connectWithTexture(labelImageInfo.imageData, gl);
        planeList.push(labelPlane);
    }

    return planeList;
}

//enumerate all answer data and find the biggest number..
function getMinMax(answerData){
	var biggestInData = answerData[0][0];
    var smallestInData = answerData[0][0];
	
	for(var i in answerData){
		var row = answerData[i];
		var biggestInRow = Math.max.apply(Math, row);
        var smallestInRow = Math.min.apply(Math, row);
		
		if (biggestInRow > biggestInData) {
			biggestInData = biggestInRow;
		}

        if(smallestInRow < smallestInData){
            smallestInData = smallestInRow;
        }
	}

    if(smallestInData > 0){
        smallestInData = 0;
    }
	return {
        biggestInData: biggestInData,
        smallestInData: smallestInData
    };
}
