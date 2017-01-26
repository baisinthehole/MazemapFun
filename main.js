var FLOOR_ID = "159";
var FILENAME = "floor_4_35.json";

// Create a map
var MAP = Maze.map('mazemap-container', { campusloader: false });
// map.setView([10.406426561608821,63.417421008760335], 15);
MAP.setView([63.417421008760335,10.406426561608821], 15);

// Uncomment the preferred JSON file
getLocalJSON(FILENAME);
getJSONfromServer();

zoom();

function createglobalMergedPolygons(data, roomCoordinates){
    var neighbors;
    var indeces;

    //drawPolygonFromOnlyCoordinates(simpleMergeTwo(simpleMergeTwo(roomCoordinates[19], roomCoordinates[26]), roomCoordinates[31], true), "gray", "black");

    //checkPointSequence(simpleMergeTwo(roomCoordinates[19], roomCoordinates[26]));
    //drawPolygonFromOnlyCoordinates(roomCoordinates[0], "gray", "black");


    //drawPolygonFromOnlyCoordinates(roomCoordinates[0], "gray", "black");

    [neighbors, indeces] = getNeighbors(data, roomCoordinates);

    oldNeighbors = deepCopy(neighbors);


    [roomCoordinates, container, globalMergedRoomNameMarkers] = mergeAllPolygons(neighbors, indeces, roomCoordinates);

    [roomCoordinates, container] = removeDuplicateRooms(roomCoordinates, container, globalMergedRoomNameMarkers);

    orderedRooms = findOrderOfRooms(oldNeighbors, container);

    console.log(orderedRooms);

    var array = [deepCopy(orderedRooms[5])];
    createDifferentMergingLevels(orderedRooms[5], array);
    console.log(array);

    roomCoordinates = simplifyRoomsMadeBySomeDude(roomCoordinates);

    fillglobalMergedPolygons(roomCoordinates, globalMergedPolygons, container);
}
