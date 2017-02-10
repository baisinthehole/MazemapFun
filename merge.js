function mergeTwoPolygons(polygon1, polygon2, indeces1, indeces2, point1 = undefined, point2 = undefined){
    if (polygon1 != polygon2){
        if (indeces1 != null && indeces2 != null){
            indeces1.sort(sorter);
            indeces2.sort(sorter);
            var shiftedPolygon1 = polygon1.slice(0, polygon1.length-1);
            for (var i = 0; i < indeces1[0]; i++) {
                shiftedPolygon1.push(shiftedPolygon1.shift());
            }
            var shiftedPolygon2 = polygon2.slice(0, polygon2.length-1);
            for (var i = 0; i < indeces2[0]; i++) {
                shiftedPolygon2.push(shiftedPolygon2.shift());
            }
            var partPolygon1 = getLongestPartWithoutRemoval(shiftedPolygon1, indeces1[1]-indeces1[0]);
            var partPolygon2 = getLongestPartWithoutRemoval(shiftedPolygon2, indeces2[1]-indeces2[0]);
            var mergedPolygon = partPolygon1.concat(partPolygon2,[partPolygon1[0]]);
            return mergedPolygon;
        }
        else if (indeces1 == null){
            console.log("Error: This should not happend");
            return -1;
        }
        else if (indeces2 == null){
            console.log("indeces2 = null");
            if (oneCloseCorner(polygon1, polygon2)){
                indeces1.sort(sorter);
                var resultIndeces = getClosestCorner(polygon1, polygon2, indeces1);
                var shiftedPolygon2 = polygon2.slice(0, polygon2.length-1);
                for (var i = 0; i < resultIndeces[1]+1; i++) {
                    shiftedPolygon2.push(shiftedPolygon2.shift());
                }
                shiftedPolygon2.pop();

                var shiftedPolygon1 = polygon1.slice(0, polygon1.length-1);
                for (var i = 0; i < indeces1[0]; i++) {
                    shiftedPolygon1.push(shiftedPolygon1.shift());
                }
                var partPolygon1 = getLongestPartWithoutRemoval(shiftedPolygon1, indeces1[1]-indeces1[0]);
                var mergedPolygon;
                mergedPolygon = partPolygon1.concat(shiftedPolygon2,[partPolygon1[0]]);
                return mergedPolygon;
            }
            else {
                mergedPolygon = mergeWithRoomWithoutCloseCorners(polygon1, polygon2, indeces1, point1, point2);
                return mergedPolygon;
            }
        }
        else {
            console.log("Error: This should not happend");
            return -1;
        }
    }
    else {
        return -1;
    }
}

function getLongestPart(polygon, index){
    if (index > 1){
        var part1 = polygon.slice(1,index);
    }
    else {
        return polygon.slice(index+1,polygon.length);
    }
    if (index >= polygon.length){
        return part1;
    }
    var part2 = polygon.slice(index+1,polygon.length);
    if (getRoomCircumference(part1) > getRoomCircumference(part2)){
        return part1;
    }
    else {
        return part2;
    }
}

function getLongestPartWithoutRemoval(polygon, index){
    if (index > 1){
        var part1 = polygon.slice(0,index+1);
    }
    else {
        return polygon.slice(index,polygon.length).concat([polygon[0]]);
    }
    if (index >= polygon.length){
        return part1;
    }
    var part2 = polygon.slice(index,polygon.length).concat([polygon[0]]);
    if (getRoomCircumference(part1) > getRoomCircumference(part2)){
        return part1;
    }
    else {
        return part2;
    }
}

function mergeAllPolygons(neighbors, roomCoordinates){
    var container = [];

    for (var i = 0; i < roomCoordinates.length; i++) {
        container.push([i]);
    }

    for (var i = 0; i < roomCoordinates.length; i++) {
        for (var j = 0; j < roomCoordinates.length; j++) {
            if (contains(neighbors[i], j)) {
                if (!findOne(container[i], container[j])) {


                    // var mergedPolygon = simpleMergeTwo(roomCoordinates[i], roomCoordinates[j]);
                    mergedPolygon = superMergeTwo(roomCoordinates[i], roomCoordinates[j]);




                    if (mergedPolygon != -1) {
                        if (neighbors[i].indexOf(j) != -1) {
                            neighbors[i].splice(neighbors[i].indexOf(j), 1);
                        }
                        if (neighbors[j].indexOf(i) != -1) {
                            neighbors[j].splice(neighbors[j].indexOf(i), 1);
                        }

                        for (var k = 0; k < container[j].length; k++) {
                            if (!contains(container[i], container[j][k])) {
                                container[i].push(container[j][k]);
                            }
                        }

                        for (var k = 0; k < neighbors[j].length; k++) {
                            if (!contains(neighbors[i], neighbors[j][k]) && !contains(container[i], neighbors[j][k]) && neighbors[j][k] != i) {
                                neighbors[i].push(neighbors[j][k]);
                            }
                        }

                        for (var k = 0; k < container[i].length; k++) {
                            neighbors[container[i][k]] = neighbors[i];
                            container[container[i][k]] = container[i];
                            roomCoordinates[container[i][k]] = mergedPolygon;
                        }
                    }
                }
            }
        }
    }
    return [roomCoordinates, container];
}

function simpleMergeTwo(room1, room2, test=false){
    result0 = getDistPolyToPoly(room1, room2);
    result1 = getDistPolyToPoly(room2, room1);
    if (result1[2] < VERY_IMPORTANCE_DISTANCE && result0[2] < VERY_IMPORTANCE_DISTANCE) {
        if (test){
            console.log("result1[2] is less than very importance distance");
            console.log(result0);
            console.log(result1);
        }
        var mergedPolygon = mergeTwoPolygons(room1, room2, [result0[0],result0[1]], [result1[0],result1[1]]);
    }
    else if (result1[2] >= VERY_IMPORTANCE_DISTANCE && result0[2] < VERY_IMPORTANCE_DISTANCE){
        if (test){
            console.log("result1[2] is undefined");
            console.log(result0);
            console.log(result1);
        }
        var mergedPolygon = mergeTwoPolygons(room1, room2, [result0[0],result0[1]], undefined);
    }
    else if (result1[2] < VERY_IMPORTANCE_DISTANCE && result0[2] >= VERY_IMPORTANCE_DISTANCE){
        if (test){
            console.log("result0[2] is undefined");
        }
        var mergedPolygon = -1;
    }
    else {
        var mergedPolygon = -1;
    }
    return mergedPolygon;
}

function superMergeTwo(room1, room2, test=false){
    var pointsCloseEnough1 = getClosePoints(room1, room2);
    var pointsCloseEnough2 = getClosePoints(room2, room1);
    var mergingPoints1 = getMergingPoints(pointsCloseEnough1, room1, room2);
    var mergingPoints2 = getMergingPoints(pointsCloseEnough2, room2, room1);

    // room2 = addPointOnLine(room1[mergingPoints1[0]], room2);
    // room2 = addPointOnLine(room1[mergingPoints1[1]], room2);
    // pointsCloseEnough1 = getClosePoints(room1, room2);
    // pointsCloseEnough2 = getClosePoints(room2, room1);
    // mergingPoints1 = getMergingPoints(pointsCloseEnough1, room1, room2);
    // mergingPoints2 = getMergingPoints(pointsCloseEnough2, room2, room1);
    var mergedPolygon;

    if (mergingPoints2[0]) {
        mergedPolygon = mergeTwoPolygons(room1, room2, mergingPoints1, mergingPoints2);
    }
    else {
        var point1;
        var point2;
        if (getMinDistToPolyPoints(room1[mergingPoints1[0]], room2) > VERY_IMPORTANCE_DISTANCE*3){
            point1 = createPointShortestDistance(room1[mergingPoints1[0]], room2);
        }
        if (getMinDistToPolyPoints(room1[mergingPoints1[1]], room2) > VERY_IMPORTANCE_DISTANCE*3){
            point2 = createPointShortestDistance(room1[mergingPoints1[1]], room2);
        }
        mergedPolygon = mergeTwoPolygons(room1, room2, mergingPoints1, undefined, point1, point2);
    }
    mergedPolygon = removeSharpPoint(mergedPolygon);
    return mergedPolygon;
}

// This should be optimized by only checking merged points
function removeSharpPoint(polygon){
    var deltaAngle = Math.PI/12;
    for (var i = polygon.length-3; i >= 0; i--) {
        var angle = getAngle(makeLine(polygon[i+1], polygon[i]), makeLine(polygon[i+1], polygon[i+2]));
        if (angle < deltaAngle || angle > 2*Math.PI - deltaAngle){
            // console.log("Trying to remove");
            // console.log(polygon[i+1]);
            // Maze.popup().setLatLng(polygon[i+1]).setContent("Removed").addTo(MAP);
            polygon.splice(i+1, 1);
        }
    }
    return polygon;
}

function getClosePoints(room1, room2, test=false) {
    var closePoints = [];
    for (var i = 0; i < room1.length; i++) {
        if (getMinDistToPoly(room1[i], room2) < VERY_IMPORTANCE_DISTANCE){
            closePoints.push(i);
        }
    }

    if (test) {
        for (var i = 0; i < closePoints.length; i++) {
            Maze.popup().setLatLng(room1[closePoints[i]]).setContent("close " + i.toString()).addTo(MAP);
        }
    }

    return closePoints;
}

function findPairsOfPoints(room1, room2, test=false, testPoints=[], testRoomLength=0) {
    var points;
    var length;

    if (test) {
        points = testPoints;
        length = testRoomLength;
    }
    else {
        points = getClosePoints(room1, room2);
        length = room1.length;
    }


    var resultingPoints = [];
    var timesShifted = 0;


    if (points[0] == 0 && points[points.length - 1] == length - 1) {

        var currentValue = 0;

        while (currentValue == points[0]) {
            points.push(points.shift());

            currentValue++;

            timesShifted++;
        }
    }

    console.log(points);

    var originalIndex = 0;
    var currentIndex = 0;
    var nextIndex = 1

    console.log(timesShifted);

    for (var i = 0; i < points.length - timesShifted - 1; i++) {
        if (points[currentIndex] != points[nextIndex] - 1) {
            if (originalIndex != currentIndex) {
                resultingPoints.push(points[originalIndex]);
                resultingPoints.push(points[currentIndex]);

            }
            originalIndex = nextIndex;
        }
        currentIndex++;
        nextIndex++;
    }
    if (points[originalIndex] != points[points.length - 1]) {
        resultingPoints.push(points[originalIndex]);
        resultingPoints.push(points[points.length - 1]);
    }

    console.log(resultingPoints);
    
    // for (var i = 0; i < resultingPoints.length; i++) {
    //     Maze.popup().setLatLng(room1[resultingPoints[i]]).setContent(resultingPoints[i].toString()).addTo(MAP);
    // }


    return resultingPoints;
}

function connectCirclePoints(room1, room2, pointIndexes1, pointIndexes2) {
    minDistance = 12345678;
    minIndex = 0;
    indexesConnected = [];


    var currentAngle;
    var currentDistance;

    for (var i = 0; i < pointIndexes1.length; i++) {
        for (var j = 0; j < pointIndexes2.length; j++) {
            
            currentDistance = getDistPoints(room1[pointIndexes1[i]], room2[pointIndexes2[j]]);
            if (currentDistance < minDistance) {
                minDistance = currentDistance;
                minIndex = j;

            }
            
            
        }
        indexesConnected.push([pointIndexes1[i], pointIndexes2[minIndex]]);
        minDistance = 12345678;
    }
    return indexesConnected;
}

function createCirclePolygons(points1, points2, connectedIndexes) {
    var numberOneInUse = true;

    var currentIndex = 0;

    var resultingRoom1 = [currentIndex];
    var resultingRoom2 = [];

    var currentIndexChanged = false;

    var foundConnectingPoint = false;

    var counter = 0;

    while (counter < 50) {
        foundConnectingPoint = false;

        if ((currentIndex == 0 || currentIndex == points1.length - 1) && numberOneInUse == 1 && currentIndexChanged) {
            break;
        }

        if (numberOneInUse) {

            for (var i = 0; i < connectedIndexes.length; i++) {
                if (connectedIndexes[i][0] == points1[currentIndex]) {
                    currentIndex = connectedIndexes[i][1];
                    currentIndexChanged = true;
                    numberOneInUse = false;
                    foundConnectingPoint = true;

                    connectedIndexes.splice(i, 1);
                }
            }
            if (!foundConnectingPoint) {
                currentIndex++;
            }

            resultingRoom1.push(points1[currentIndex]);
        }
        else {

            for (var i = 0; i < connectedIndexes.length; i++) {
                if (connectedIndexes[i][1] == points1[currentIndex]) {
                    currentIndex = connectedIndexes[i][0];
                    currentIndexChanged = true;
                    numberOneInUse = true;
                    foundConnectingPoint = true;

                    connectedIndexes.splice(i, 1);
                }
            }
            if (!foundConnectingPoint) {
                currentIndex++;
            }

            resultingRoom1.push(points2[currentIndex]);
        }
        counter++;
    }
    return resultingRoom1;
}

function getMergingPoints(pointsCloseEnough, room1, room2){
    var longestDist = 0;
    var dist;
    var index1;
    var index2;
    for (var i = 0; i < pointsCloseEnough.length - 1; i++) {
        for (var j = i; j < pointsCloseEnough.length; j++) {
            dist = haversineDistance(room1[pointsCloseEnough[i]], room1[pointsCloseEnough[j]]);
            if (dist > longestDist){
                if (!pointTooFarAway([pointsCloseEnough[i], pointsCloseEnough[j]], room1, room2)){
                    longestDist = dist;
                    index1 = pointsCloseEnough[i];
                    index2 = pointsCloseEnough[j];
                }
            }
        }
    }
    return [index1, index2];
}

function pointTooFarAway(indeces, room1, room2) {
    for (var i = indeces[0]+1; i < indeces[1]; i++) {
        if (haversineDistance(room1[i%room1.length], room2) > VERY_IMPORTANCE_DISTANCE*5){
            return true;
        }
    }
    return false;
}

function sorter(a, b) {
    if (a < b) return -1;  // any negative number works
    if (a > b) return 1;   // any positive number works
    return 0; // equal values MUST yield zero
}

function findOrderOfRooms(oldNeighbors, container) {
	var orderedRooms = [];

	var usedIndices = [];

	var currentIndex = 0;

	for (var i = 0; i < container.length; i++) {
		orderedRooms.push([]);
		usedIndices.push([]);

		[maxIndex1, maxIndex2] = findFarthestRooms(container[i]);

		if (oldNeighbors[maxIndex1].length > 1) {

			orderedRooms[i].push(maxIndex2);

			usedIndices[i].push(maxIndex2);

			currentIndex = maxIndex2;
		}
		else {

			orderedRooms[i].push(maxIndex1);

			usedIndices[i].push(maxIndex1);

			currentIndex = maxIndex1;
		}
		for (var j = 0; j < container[i].length; j++) {
			if (contains(oldNeighbors[currentIndex], container[i][j])) {
				if (!contains(usedIndices[i], container[i][j])) {



					orderedRooms[i].push(container[i][j]);

					usedIndices[i].push(container[i][j]);

					currentIndex = container[i][j];

					j = -1;
				}
			}
		}

	}
	return orderedRooms;
}

function createDifferentMergingLevels(orderedRooms) {
	var mergingLevels = [[orderedRooms]];

	var amount = orderedRooms.length;

	var currentIndex = 0;

	var currentInternalStartIndex = 0;

	var currentInternalEndIndex = 0;

    var maxNrOfRooms = 3;

	while (amount > maxNrOfRooms) {

		mergingLevels.push([]);



		for (var i = 0; i < mergingLevels[currentIndex].length; i++) {
			if (isOdd(mergingLevels[currentIndex][i].length)) {

				amount = Math.ceil(mergingLevels[currentIndex][i].length / 2);

                if (mergingLevels[currentIndex][i].length != maxNrOfRooms) {
                    currentInternalEndIndex = currentInternalStartIndex + amount - 1;

                    mergingLevels[currentIndex + 1].push(orderedRooms.slice(currentInternalStartIndex, currentInternalEndIndex));

                    currentInternalStartIndex = currentInternalEndIndex;
                    currentInternalEndIndex = currentInternalStartIndex + amount;

                    mergingLevels[currentIndex + 1].push(orderedRooms.slice(currentInternalStartIndex, currentInternalEndIndex));
                    currentInternalStartIndex = currentInternalEndIndex;
                }
                else {
                    currentInternalEndIndex = currentInternalStartIndex+2*amount-1;
                    mergingLevels[currentIndex + 1].push(orderedRooms.slice(currentInternalStartIndex, currentInternalEndIndex));
                    currentInternalStartIndex = currentInternalEndIndex;
                }
			}
			else {
				amount = mergingLevels[currentIndex][i].length / 2;

				currentInternalEndIndex = currentInternalStartIndex + amount;

				mergingLevels[currentIndex + 1].push(orderedRooms.slice(currentInternalStartIndex, currentInternalEndIndex));

				currentInternalStartIndex = currentInternalEndIndex;
				currentInternalEndIndex = currentInternalStartIndex + amount;

				mergingLevels[currentIndex + 1].push(orderedRooms.slice(currentInternalStartIndex, currentInternalEndIndex));
				currentInternalStartIndex = currentInternalEndIndex;
			}
		}

		currentIndex++;

		currentInternalStartIndex = 0;
	}

	return mergingLevels;
}

function isOdd(number) {
	return number % 2 != 0;
}

// Only use this function on a copied version of neighbors and not the neighbors used for merging!
function makeNeighborsWhoAreNotNeighborsNeighbors(neighbors) {
	for (var i = 0; i < neighbors.length; i++) {
		for (var j = 0; j < neighbors[i].length; j++) {
			if (!contains(neighbors[neighbors[i][j]], i)) {
				neighbors[neighbors[i][j]].push(i);
			}
		}
	}
	return neighbors;
}

function dynamicMergeAllRooms(allOrderedRooms) {
    for (var i = 0; i < allOrderedRooms.length; i++) {
        allOrderedRooms[i] = createDifferentMergingLevels(allOrderedRooms[i]);
    }
    return allOrderedRooms;
}

function mergeAllPolygonsDynamic(allOrderedRooms, roomCoordinates) {
    for (var i = 0; i < allOrderedRooms.length; i++) {

        if (allOrderedRooms[i].length > 1) {
            for (var j = 0; j < allOrderedRooms[i].length; j++) {

            }
        }

        for (var j = 0; j < allOrderedRooms[i].length; j++) {

        }
    }
}


function mergeZoomLevel(index, rooms){
    if (index.length < 2){
        return rooms[index[0]];
    }
    var resultRoom = simpleMergeTwo(rooms[index[0]], rooms[index[1]]);
    if (resultRoom==-1){
        resultRoom = simpleMergeTwo(rooms[index[1]], rooms[index[0]]);
    }
    var tempResultRoom;
    for (var i = 2; i < index.length; i++) {
        tempResultRoom = simpleMergeTwo(resultRoom, rooms[index[i]]);
        if (tempResultRoom == -1){
            resultRoom = simpleMergeTwo(rooms[index[i]],resultRoom);
        }
        else {
            resultRoom = tempResultRoom;
        }
    }
    return resultRoom;
}

function fillZoomLevels(dynamicMergedRooms, oldRooms){
    var globalZoomLevels = [[],[],[]];
    var index;
    var lastPolygon;

    for (var i = 0; i < dynamicMergedRooms.length; i++) {
        if (dynamicMergedRooms[i][0][0].length > 1){
            for (var j = 0; j < 3; j++) {
                index = dynamicMergedRooms[i].length-1-j;
                if (index >= 0){
                    for (var k = 0; k < dynamicMergedRooms[i][index].length; k++) {
                        lastPolygon = mergeZoomLevel(dynamicMergedRooms[i][index][k], oldRooms);
                        globalZoomLevels[2-j].push(deepCopy(lastPolygon));
                    }
                }
                else {
                    globalZoomLevels[2-j].push(lastPolygon);
                }
            }
        }
    }
    return globalZoomLevels;
}

function fillZoomLevelPolygons(coordinates){
    fillPolygons(coordinates[0], mergedLarge, "gray", "lemonchiffon", "polygon");
    fillPolygons(coordinates[1], mergedMedium, "gray", "lemonchiffon", "polygon");
    fillPolygons(coordinates[2], mergedSmall, "gray", "lemonchiffon", "polygon");
}

function getUnmergedRooms(container, coordinates) {
    for (var i = 0; i < container.length; i++) {
        if (container[i].length == 1) {
            if (GLOBAL_ROOM_COORDINATES[i].length > 0){
                globalUnmergedRoomsSimplified.push(coordinates[i]);
                globalUnmergedRooms.push(GLOBAL_ROOM_COORDINATES[i]);
                globalUnmergedNames.push(makeLocalRoomNames(GLOBAL_ROOM_COORDINATES[i], GEO_JSON.pois[i].title));
            }
        }
    }
    fillPolygons(globalUnmergedRoomsSimplified, globalUnmergedPolygonsSimplified, "gray", "white", "line");
    fillPolygons(globalUnmergedRooms, globalUnmergedPolygons, "gray", "white", "line");

}

function makeMergedNameStrings(mergedRooms, nameList) {
    var textZoomLevels = [[],[],[]];
    var index;
    var lastText;

    for (var i = 0; i < dynamicMergedRooms.length; i++) {
        if (dynamicMergedRooms[i][0][0].length > 1){
            for (var j = 0; j < 3; j++) {
                index = dynamicMergedRooms[i].length-1-j;
                if (index >= 0){
                    for (var k = 0; k < dynamicMergedRooms[i][index].length; k++) {
                        if (nameList[dynamicMergedRooms[i][index][k][0]] < nameList[dynamicMergedRooms[i][index][k][dynamicMergedRooms[i][index][k].length - 1]]) {
                            lastText = nameList[dynamicMergedRooms[i][index][k][0]] + " - " + getDiffRoomNames(nameList[dynamicMergedRooms[i][index][k][0]], nameList[dynamicMergedRooms[i][index][k][dynamicMergedRooms[i][index][k].length - 1]]);
                        }
                        else {
                            lastText = nameList[dynamicMergedRooms[i][index][k][dynamicMergedRooms[i][index][k].length - 1]] + " - " + getDiffRoomNames(nameList[dynamicMergedRooms[i][index][k][dynamicMergedRooms[i][index][k].length - 1]], nameList[dynamicMergedRooms[i][index][k][0]]);
                        }
                        textZoomLevels[2-j].push(lastText);
                    }
                }
                else {
                    textZoomLevels[2-j].push(lastText);
                }
            }
        }
    }
    return textZoomLevels;
}

function getDiffRoomNames(roomName1, roomName2){
    for (var i = 0; i < roomName1.length; i++) {
        if (roomName1.charAt(i) !== roomName2.charAt(i) || i == roomName2.length-2) {
            if (i == roomName2.length-2 && isNaN(roomName2.charAt(roomName2.length-1))){
                return roomName2.slice(-3);
            }
            return roomName2.slice(i);
        }
    }
}

function convertMergedTextIntoPOIs(textZoomLevels, zoomLevelsCoordinates) {
    for (var i = 0; i < textZoomLevels.length; i++) {
        for (var j = 0; j < textZoomLevels[i].length; j++) {
            point = getPoint(zoomLevelsCoordinates[i][j]);
            myIcon = Maze.divIcon({
                className: "labelClass",
                iconSize: new Maze.Point(textZoomLevels[i][j].length * 6.5, 20),
                html: textZoomLevels[i][j]
            });
            if (i == 0) {
                mergedTextLarge.push(Maze.marker(point, {icon: myIcon}));
            }
            else if (i == 1) {
                mergedTextMedium.push(Maze.marker(point, {icon: myIcon}));
            }
            else {
                mergedTextSmall.push(Maze.marker(point, {icon: myIcon}));
            }
        }
    }
}

function mergeCorridors(){
    for (var i = globalCorridorCoordinates.length-1; i >= 0; i--) {
        if (globalCorridorCoordinates[i].length == 2){
            globalCorridorCoordinates.splice(i, 1);
        }
    }
    globalCorridorCoordinates = removeDuplicatesFromAllRooms(globalCorridorCoordinates);
    var neighborCorridors = getNeighborsCorridors(globalCorridorCoordinates);
    console.log(neighborCorridors);
    [mergedCorridors, corridorContainer] = mergeAllPolygons(neighborCorridors, globalCorridorCoordinates);
    for (var i = 0; i < mergedCorridors.length; i++) {
        drawPolygonFromOnlyCoordinates(mergedCorridors[i], "white", "blue");
    }
    return mergedCorridors;
}

function mergeWithRoomWithoutCloseCorners(polygon1, polygon2, indeces1, point1, point2){
    var a = polygon1[indeces1[0]];
    var b = polygon1[indeces1[1]];
    var line1 = makeLine(a, b);
    var line2 = makeLine(b, a);
    var leastDistance1 = 1234546;
    var leastDistance2 = 1234546;
    var leastIndex1;
    var leastIndex2;
    var dist;
    // polygon2 = addPointOnLine(polygon1[indeces1[0]], polygon2);

    // Move points if it inside the polygon it should merge with
    if (a, inside(a, polygon2)){
        a = moveOutside(a, polygon2);
    }
    if (b, inside(b, polygon2)){
        b = moveOutside(b, polygon2);
    }

    for (var i = 0; i < polygon2.length-1; i++) {
        // Switch point a and b if the polygon is on the other side than expected
        // This is not tested and will therefore probably not work correctly!!!!!!!!!!!!!!!!!!
        if (findOutsideOfPolygon(a, b, polygon2)){
            console.log("Switching point a and point b");
            var temp = deepCopy(a);
            a = deepCopy(b);
            b = deepCopy(temp);
            line1 = makeLine(a, b);
            line2 = makeLine(b, a);
        }
        if (!crossesPolygon(a,polygon2[i],polygon2) && mergingAngle(line1, makeLine(a, polygon2[i]))){
            dist = haversineDistance(a,polygon2[i]);
            if (dist < leastDistance1){
                leastDistance1 = dist;
                leastIndex1 = i;
            }
        }
    }
    for (var i = 0; i < polygon2.length-1; i++) {
        if (!crossesPolygon(b,polygon2[i],polygon2) && mergingAngle(makeLine(b, polygon2[i]), line2)){
            dist = haversineDistance(b,polygon2[i]);
            if (dist < leastDistance2){
                leastDistance2 = dist;
                leastIndex2 = i;
            }
        }
    }

    var indeces2 = [leastIndex1, leastIndex2];
    indeces1.sort(sorter);
    indeces2.sort(sorter);
    var shiftedPolygon1 = polygon1.slice(0, polygon1.length-1);
    for (var i = 0; i < indeces1[0]; i++) {
        shiftedPolygon1.push(shiftedPolygon1.shift());
    }
    var shiftedPolygon2 = polygon2.slice(0, polygon2.length-1);
    for (var i = 0; i < indeces2[0]; i++) {
        shiftedPolygon2.push(shiftedPolygon2.shift());
    }
    var partPolygon1 = getLongestPartWithoutRemoval(shiftedPolygon1, indeces1[1]-indeces1[0]);
    var partPolygon2 = getLongestPartWithoutRemoval(shiftedPolygon2, indeces2[1]-indeces2[0]);
    // if (point1) {
    //     if (getDistPoints(point1, partPolygon1[0]) < getDistPoints(point1, partPolygon1[partPolygon1.length-1])){
    //         partPolygon1 = [point1].concat(partPolygon1);
    //     }
    //     else{
    //         partPolygon1 = partPolygon1.concat([point1]);
    //     }
    // }
    // if (point2) {
    //     if (getDistPoints(point2, partPolygon1[0]) < getDistPoints(point2, partPolygon1[partPolygon1.length-1])){
    //         partPolygon1 = [point2].concat(partPolygon1);
    //     }
    //     else{
    //         partPolygon1 = partPolygon1.concat([point2]);
    //     }
    // }
    var mergedPolygon = partPolygon1.concat(partPolygon2,[partPolygon1[0]]);
    return mergedPolygon;
}

function createPointShortestDistance(point, polygon){
    if (polygon.length > 0){
        var linePoints = getClosestLineInPoly(point, polygon);
        var closestPoint = getPointOnLineClosestToPoint(point, linePoints[0], linePoints[1]);
        return closestPoint;
    }
}

function addPointOnLine(point, polygon){
    if (getMinDistToPolyPoints(point, polygon) > VERY_IMPORTANCE_DISTANCE*2){
        var closestPoint = createPointShortestDistance(point, polygon);
        var index = getClosestLineIndex(point, polygon);
        polygon.splice(index+1, 0, closestPoint);
        Maze.popup().setLatLng(closestPoint).setContent("Added").addTo(MAP);
    }
    return polygon;
}
