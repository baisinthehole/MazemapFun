var FILENAME = "floor_4_35.json";

// Create a map
// center = Maze.latLng(63.41, 10.41);
var MAP = Maze.map('mazemap-container', {
            campusloader: false,
            // center: center,
            zoom: 5,
            zoomSnap: 0,
            zoomDelta: 0.5,
            wheelPxPerZoomLevel: 100 });
MAP.setView([63.417421008760335,10.406426561608821], 15);

// Uncomment the preferred JSON file
getLocalJSON(FILENAME);
if (FLOOR_ID != false) {
    getJSONfromServer();


    function createglobalMergedPolygons(data, roomCoordinates){
        var neighbors;
        var indeces;

        alterJSONfile(data, FLOOR_ID);

        neighbors = getNeighbors(data, roomCoordinates);
        oldNeighbors = deepCopy(neighbors);

        oldNeighbors = makeNeighborsWhoAreNotNeighborsNeighbors(oldNeighbors);

        var oldRooms = deepCopy(roomCoordinates);

        [roomCoordinates, container] = mergeAllPolygons(neighbors, roomCoordinates);

        getUnmergedRooms(container, oldRooms);

        [roomCoordinates, container] = removeDuplicateRooms(roomCoordinates, container);

        // test18();
        //test77();
        // getCorridorIndices();
        // test8();
        //test38();
        //test91();
        // var allPolygons = [];
        // // Uncomment to store the corridors for the floor
        // if (localStorage.getItem('corridors'+FLOOR_ID) === null) {
        // // if (true){
        //     // Merge corridors from scratch
        //     var test = mergeCorridors();
        //     localStorage.setItem('corridors'+FLOOR_ID, JSON.stringify(test));
        // }

        // // Retrieve objects from storage
        // for (var i = 0; i < FLOOR_IDS.length; i++) {
        //     if (localStorage.getItem('corridors'+FLOOR_IDS[i]) !== null) {
        //         globalMergedCorridorsCoordinates.push(JSON.parse(localStorage.getItem('corridors'+FLOOR_IDS[i])));
        //     }
        //     if (localStorage.getItem('everything'+FLOOR_IDS[i]) !== null) {
        //         allPolygons.push(localStorage.getItem('everything'+FLOOR_ID));
        //     }
        // }
        // console.log(allPolygons);

        // console.log(globalMergedCorridorsCoordinates);
        // for (var j = 0; j < globalMergedCorridorsCoordinates.length; j++) {
        //     for (var i = 0; i < globalMergedCorridorsCoordinates[j].length; i++) {
        //         drawPolygonFromOnlyCoordinates(globalMergedCorridorsCoordinates[j][i], "white", "blue");
        //     }
        // }
        globalMergedCorridorsCoordinates = mergeCorridors();
        console.log("globalMergedCorridorsCoordinates");
        console.log(deepCopy(globalMergedCorridorsCoordinates));
        GLOBAL_ALL_COORDINATES[1] = deepCopy(globalMergedCorridorsCoordinates);
        orderedRooms = findOrderOfRooms(oldNeighbors, container);

        dynamicMergedRooms = dynamicMergeAllRooms(orderedRooms);

        var zoomLevelsCoordinates = fillZoomLevels(dynamicMergedRooms, oldRooms);

        fillZoomLevelPolygons(zoomLevelsCoordinates);

        roomCoordinates = simplifyRoomsMadeBySomeDude(roomCoordinates);

        fillglobalMergedPolygons(roomCoordinates, globalMergedPolygons, container);

        var textZoomLevels = makeMergedNameStrings(dynamicMergedRooms, globalNameList);

        convertMergedTextIntoPOIs(textZoomLevels, zoomLevelsCoordinates);

        // var room1 = GLOBAL_CORRIDOR_COORDINATES[18];
        // var room2 = GLOBAL_CORRIDOR_COORDINATES[1];
        // addedPoints = addPointsForTwoPolygon(room1, room2);
        // room1 = addedPoints[0];
        // room2 = addedPoints[1];
        // pairs1 = findPairsOfPoints(room1, room2);
        // pairs2 = findPairsOfPoints(room2, room1);
        // connectedPoints = connectCirclePoints(room1, room2, pairs1, pairs2);
        // console.log("Output");
        // console.log(deepCopy(pairs1));
        // console.log(deepCopy(pairs2));
        // console.log(deepCopy(connectedPoints));
        // // checkPointSequence(room2);
        // if (connectedPoints.length > 2) {
        //     result = createCirclePolygons(pairs1, pairs2, room1, room2, connectedPoints);
        //     console.log(result);
        //     drawPolygonFromOnlyCoordinates(result, "white", "red");
        // }
        // else {
        //     result = superMergeTwo(room1, room2);
        //     drawPolygonFromOnlyCoordinates(result, "white", "red");
        // }

        // var room1 = globalCorridorCoordinates[0];
        // var room2 = globalCorridorCoordinates[8];
        // // drawPolygonFromOnlyCoordinates(room1, "white", "red");
        // // drawPolygonFromOnlyCoordinates(room2, "white", "blue");
        // var mergedPolygon = superDuperMerge(room1, room2);
        // drawPolygonFromOnlyCoordinates(mergedPolygon, "white", "green");

        console.log("All coordinates");
        console.log(GLOBAL_ALL_COORDINATES);
        if (localStorage.getItem('allCoordinates'+FLOOR_ID) === null) {
            localStorage.setItem('allCoordinates'+FLOOR_ID, JSON.stringify(GLOBAL_ALL_COORDINATES));
        }
    }
}
else {
    drawFromLocalStorage();
}
zoom();

// localStorage.clear();
