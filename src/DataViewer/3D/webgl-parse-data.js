import {threeModels} from "./three-model";
import {RandomPicker} from "../../Util/RandomPicker";
import {canvasLabelGenerator} from "./canvas-label-generator";

export function convertToCuboidModels(input/*an array of array*/, htmlContainer, staticTipControlTopShift, isStaticTipControlSingleLine, focusList){
    let cuboidList = [];

    let CUBOID_X_INTERVAL = 4; //间距
    let CUBOID_Z_INTERVAL = 8;

    let data = input.data;
    let meta = input.meta;
    let CuboidModel = threeModels.CuboidModel;

	let numOfRows = data.length;
	let numOfColumns = data[0].length;
    let minMax = getMinMax(data);
	let biggestInData = minMax.biggestInData;
    let smallestInData = minMax.smallestInData;
    let greatestDataRange = biggestInData - smallestInData;
    let random = new RandomPicker();
    let rowIdx, colIdx;
    for(rowIdx = 0; rowIdx < numOfRows; rowIdx++){
        let mcColor = random.pickSeriesColor();

        for(let colIdx = 0; colIdx < numOfColumns; colIdx++){

			let translateX = (CUBOID_X_INTERVAL * rowIdx) - ((numOfRows - 1) * CUBOID_X_INTERVAL) / 2;
			let translateZ = (CUBOID_Z_INTERVAL * colIdx) - ((numOfColumns - 1) * CUBOID_Z_INTERVAL) / 2;
			
			let scaleFactor = ((data[rowIdx][colIdx] - smallestInData) / greatestDataRange) * 8;
			if(scaleFactor < 0.05){
				scaleFactor = 0.05; //in case it is so small that we end up with z fighting.
			}
			let translateY = scaleFactor;
			let translate = [translateX, translateY, translateZ];
			
			let scale = [1, scaleFactor, 1];

            let cuboid = new CuboidModel(translate, scale, mcColor, data[rowIdx][colIdx], meta.rows[rowIdx], meta.columns[colIdx], htmlContainer, staticTipControlTopShift, isStaticTipControlSingleLine);
            cuboidList.push(cuboid);

		}
	}

    //now set the focus
    if(focusList){
        for(let fi = 0; fi < focusList.length; fi++){
            rowIdx = focusList[fi][0];
            colIdx = focusList[fi][1];
            cuboidList[rowIdx * numOfColumns + colIdx].setFocus();
        }
    }


    return cuboidList;
}

export function createLabelPlanes(input, gl, offScreenCanvas){
    let planeList = [];

    let columns = input.meta.columns;
    let numOfRows = input.meta.rows.length;
    let CUBOID_X_INTERVAL = 4;
    let CUBOID_Z_INTERVAL = 8;
    let labelGenerator = canvasLabelGenerator.create(offScreenCanvas);

    let PlaneModel = threeModels.PlaneModel;



    //create one label plane for each column
    for(let i = 0; i < columns.length; i++) {
        let text = columns[i];
        let labelImageInfo = labelGenerator.generateLabelImageDataBasedOnText(text);


        //每一个label的长度都是不确定的，随着字数的变化而变化，但是它们的宽度必然是确定的，也就是2，2也是我所用的长方体的底面任何一边的长度。
        //label的长度对应的字的长度，而label的宽度对应字的高度。字的高度是固定的，20px，同理label的宽度也是固定的，2个世界坐标系里的长度，由此可以推断出这里px到世界坐标的转换比例
        let labelLength = labelImageInfo.textWidth * (2/labelImageInfo.textHeight);
        let scale = [labelLength/2, 1, 1];

        let translateX = (((numOfRows-1) * CUBOID_X_INTERVAL) + 2) / 2 + labelLength/2;
        let translateZ = (CUBOID_Z_INTERVAL * i) - ((columns.length - 1) * CUBOID_Z_INTERVAL) / 2;
        let translate = [translateX, 0, translateZ];

        let labelPlane = new PlaneModel(translate, scale, false);
        labelPlane.connectWithTexture(labelImageInfo.imageData, gl);
        planeList.push(labelPlane);
    }

    return planeList;
}

//enumerate all answer data and find the biggest number..
export function getMinMax(answerData){
	let biggestInData = answerData[0][0];
    let smallestInData = answerData[0][0];
	
	for(let i in answerData){
		let row = answerData[i];
		let biggestInRow = Math.max.apply(Math, row);
        let smallestInRow = Math.min.apply(Math, row);
		
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
        biggestInData,
        smallestInData
    };
}
