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

    /**
     * Provides static method measuring distance between a pair of two lat-lon coordinates.
     * @param lat1
     * @param lon1
     * @param lat2
     * @param lon2
     * @returns {number} - meters
     */

    static measure(lat1,lon1,lat2,lon2) {
        let R = 6371; // Radius of the earth in km
        let dLat = (Math.PI/180) * (lat2-lat1);  // deg2rad below
        let dLon = (Math.PI/180) * (lon2-lon1);
        let a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos((Math.PI/180) * lat1) * Math.cos((Math.PI/180) * lat2) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        let d = R * c; // Distance in km
        return d*1000;
    }
}


