/**
 * Class representing points of interests.

 */
class PointOfInterest {
    constructor(lat, lon, distance) {
        this.lat = lat;
        this.lon = lon;
        this.distance = distance;
        this.score = 0;
    }

    get getLat() {
        return this.lat;
    }

    get getLon() {
        return this.lon;
    }

    get getDistance() {
        return this.distance;
    }

    set setScore(score) {
        this.score = score;
    }

    /**
     *  * Provides static method measuring distance between a pair of two lat-lon coordinates.
     * @param lat1
     * @param lon1
     * @param lat2
     * @param lon2
     * @returns {number} - meters
     */
    static measure(lat1, lon1, lat2, lon2) {  // generally used geo measurement function
        let factor = 1000;
        var R = 6378.137; // Radius of earth in KM
        var dLat = (factor * lat2) * Math.PI / 180 - (factor * lat2) * Math.PI / 180;
        var dLon = (factor * lon2) * Math.PI / 180 - (factor * lon1) * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d; // meters
    }
}


