/**
 * this class manages the slots, texts in the slots and the connection lines that connect the slot to the pie circle.
 * @constructor
 */
import {draw} from "../../../../Draw/Draw";

export function PieDataLabelSlotsController(){
    this.leftSlots = [];
    this.rightSlots = [];
}

/**
 * generate the empty slots
 * @param dataLabelHeight           the height of a single data label, this is usually decided by the font size and the size of the pie
 * @param centerOfCircleForLabel    center of the invisible circle, along which we draw the labels.
 * @param radiusOfCircleForLabel    radius of the above circle.
 * @param svg                       we will append the new elements to this svg.
 */
PieDataLabelSlotsController.prototype.generateEmptySlots = function(dataLabelHeight, centerOfCircleForLabel, radiusOfCircleForLabel, svg/*debug purpose only*/){
    //the slots array format: [slotIdx, slotPixelX, slotPixelY, isTaken, slotIdx, slotPixelX, slotPixelY, isTaken.....]
    this.leftSlots = generateSlotsOnTheOneSide(true);
    this.rightSlots = generateSlotsOnTheOneSide(false);

    //test start
//    let group = draw.createGroup();
//    for(let i = 0; i < this.leftSlots.length; i = i + 4){
//        let circle = draw.createCircle(this.leftSlots[i+1], this.leftSlots[i+2], 2);
//        group.appendChild(circle);
//    }
//    for(let i = 0; i < this.rightSlots.length; i = i + 4){
//        let circle = draw.createCircle(this.rightSlots[i+1], this.rightSlots[i+2], 2);
//        group.appendChild(circle);
//    }
//    svg.appendChild(group);
    //test end

    function generateSlotsOnTheOneSide(isLeftHandSide){
        let slots = [];
        //from top to bottom
        let availableSpace = radiusOfCircleForLabel * 2 ;
        let dataSlotIdx = 0; //the top most slot index is 0. this index is for the right hand side only.
        let r2 = Math.pow(radiusOfCircleForLabel, 2);
        while(availableSpace - (dataLabelHeight * dataSlotIdx + dataLabelHeight/5) > 0){

            let spaceTaken = dataLabelHeight * dataSlotIdx + dataLabelHeight/5; //plus dataLabelHeight/4 so that we don't have a data label right on top of the circle, otherwise left hand side's top will overlap right hand side's top.
            let s2 = Math.pow(radiusOfCircleForLabel - spaceTaken, 2); //or spaceTaken - radiusOfCircleForLabel, its the same.

            let horizontalDistanceFromCenter = Math.sqrt(r2 - s2);

            let x;
            if(isLeftHandSide){
                x = centerOfCircleForLabel[0] - horizontalDistanceFromCenter;
            } else {
                x = centerOfCircleForLabel[0] + horizontalDistanceFromCenter;
            }

            let y = centerOfCircleForLabel[1] + (spaceTaken - radiusOfCircleForLabel);

            slots.push(dataSlotIdx);
            slots.push(x);
            slots.push(y);
            slots.push(false);

            dataSlotIdx++;
        }

        return slots;
    }
};

/**
 * process connectors on the circleForPie edge.
 * @param connectorsInfo    information about the connection lines
 * @param isLeft            whether the line is drawn on the left side of the pie.
 */
PieDataLabelSlotsController.prototype.processConnectorInfo = function(connectorsInfo, isLeft){
    //  --head-- [slot1(taken, connector1), slot2(taken, connector2), slot3(free), slot4(taken, connector3), slot5(taken, connector4), slot6(taken, connector5)] --tail--
    //connector 1 and connector 2 belong to the same group because their slots are next to each other.
    //connector 3, connector 4, and connector 5 belong to same group because their slots are next to each other.

    sortConnectorsInfoOrderByPixelY(connectorsInfo);

    let slots = isLeft ? this.leftSlots : this.rightSlots;

    for(let i = 0; i < connectorsInfo.length; i++){
        let connectorInfo = connectorsInfo[i];
        let suitableSlotIdx = this.findNearestAvailableSlotIdx(connectorInfo.position[0], connectorInfo.position[1], slots);
        if(suitableSlotIdx !== -1){
            connectorInfo.slotIdx = suitableSlotIdx;
        } else {
            shiftCollectorsWithSlotsForward(i);
        }
    }

    return connectorsInfo;

    function sortConnectorsInfoOrderByPixelY(connectorsInfo){
        connectorsInfo.sort((a, b) => a.position[1] - b.position[1]);
    }

    function shiftCollectorsWithSlotsForward(pendingConnectorIdx, slots){
        let groupHeadSlotIdx = -1;
        let group = [];//lets say connectors whose slots sit right next to each other belong to one group.
        for(let i = pendingConnectorIdx - 1; i > 0; i--){
            group.push(connectorsInfo[i]);
            if(connectorsInfo[i].slotIdx - connectorsInfo[i-1].slotIdx > 1 /*there are free slots between the slot of the current connector and the slot of the preceding connector.*/){
                groupHeadSlotIdx = connectorsInfo[i].slotIdx;
                break;//the next connector will belong to another group.(preceding group)
            }
        }
        //shift the current group 1 slot forward.
        for(let i = 0; i < group.length; i++){
            group[i].slotIdx = group[i].slotIdx - 1;
        }
        //since we move whole group 1 slot forward, we take an extra slot and we need to mark it as "taken"
        slots[groupHeadSlotIdx + 3] = true;

        //now since we have shift the last group 1 slot forward, there will be 1 free slot at the end.
        //give the new free slot to our current connector.
        //because this slot was originally marked as "taken", there is no need to mark it as "taken" again.
        pendingConnectorIdx.slotIdx = slots.length - 1;
    }
};

/**
 * find the nearest available slot, to a target
 * @param pixelX        position of the target
 * @param pixelY        position of the target.
 * @param slots         all the slots
 * @returns {number}    the index of the nearest slot.
 */
PieDataLabelSlotsController.prototype.findNearestAvailableSlotIdx = function(pixelX, pixelY, slots/*left or right*/){
    let nearestIdx = -1;
    let nearestDistance = 10000;
    for(let i = 0; i < slots.length; i = i + 4){
        if(slots[i+3]){
            //if already taken.
            continue;
        }

        let d = calculateDistance(pixelX, pixelY, slots[i+1], slots[i+2]);
        if(d < nearestDistance){
            nearestDistance = d;
            nearestIdx = i;
        }
    }

    if(nearestIdx === -1){
        //the preceding pie slice has already taken the last slot, there is no suitable slot.
        return -1; //return -1 to indicate that we cannot find suitable slot and therefore need to shift other slots.
    }

    //mark the slot as taken.
    slots[nearestIdx + 3] = true;
    return nearestIdx / 4;

    function calculateDistance(x1, y1, x2, y2){
        return Math.sqrt(Math.pow(x2-x1, 2)+Math.pow(y2-y1, 2));
    }
};

/**
 * draw the connection line
 * @param connectorInfo     info needed for the drawing
 * @returns {*}
 */
PieDataLabelSlotsController.prototype.createConnectionLine = function(connectorInfo){
    let slots;

    slots = connectorInfo.isLeft ? this.leftSlots : this.rightSlots;
    let coordinates = [connectorInfo.position[0], connectorInfo.position[1], connectorInfo.connectionLineTurnPos[0], connectorInfo.connectionLineTurnPos[1], slots[connectorInfo.slotIdx * 4 + 1], slots[connectorInfo.slotIdx * 4 + 2]];

    let curve =  draw.createQuadraticBezierCurve(coordinates);
    draw.setStrokeFill(curve, connectorInfo.mcColor.strokeColor, 1, "none");
    return curve;
};

/**
 *
 * @param textString            draw the text in the slot
 * @param slotIdx               slot index
 * @param isLeft                whether its on the left, or on the right.
 * @returns {SVGTextElement} the text element (the label)
 */
PieDataLabelSlotsController.prototype.createTextInSlot = function(textString, slotIdx, isLeft){
    let slots;
    if(isLeft){
        slots = this.leftSlots;
        return draw.createText(slots[slotIdx * 4 + 1] - 5 , slots[slotIdx * 4 + 2], textString, 14, isLeft ? "end" : "start", "middle");
    } else {
        slots = this.rightSlots;
        return draw.createText(slots[slotIdx * 4 + 1] + 5, slots[slotIdx * 4 + 2], textString, 14, isLeft ? "end" : "start", "middle");
    }
};