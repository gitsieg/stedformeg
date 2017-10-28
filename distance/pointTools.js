// Thresholds for point scores. Distances in meters
let distances = [
    200,
    500,
    800,
    1000,
    1400,
    1600,
    1800,
    2000,
    4000,
    5000
];


/**
 * Sets a score to a point of interest (the point you'll want to assess)
 * @param poiArray - list of points based on criteria
 * @param point    - The point with the updated score
 * @returns {*}
 */
function setPointScore(poiArray, point) {
    let score = 0;

    for (let i = 0; i < poiArray.length; i++) {
        if (poiArray[i].distance <= distances[0])
            score += 10;
        else if (poiArray[i].distance <= distances[1])
            score += 9;
        else if (poiArray[i].distance <= distances[2])
            score += 8;
        else if (poiArray[i].distance <= distances[3])
            score += 7;
        else if (poiArray[i].distance <= distances[4])
            score += 6;
        else if (poiArray[i].distance <= distances[5])
            score += 5;
        else if (poiArray[i].distance <= distances[6])
            score += 4;
        else if (poiArray[i].distance <= distances[7])
            score += 3;
        else if (poiArray[i].distance <= distances[8])
            score += 2;
        else if (poiArray[i].distance <= distances[9])
            score += 1;
    }
    point.score = score;
    return point;
}

function processCoordinates(coordinateArray, originPoint) {

    let pointArray = [coordinateArray.keys()];

    for (let i = 0; i < coordinateArray.length; i++) {
        pointArray.push(new PointOfInterest(coordinateArray[i][0], coordinateArray[i][1],
            PointOfInterest.measure(coordinateArray[i][0], coordinateArray[i][1], originPoint.lat, originPoint.lon)));
    }
    return pointArray;
}