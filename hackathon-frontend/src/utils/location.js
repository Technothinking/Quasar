/**
 * Utility for geofencing and distance calculations.
 */

/**
 * Calculates the distance between two points on Earth in meters.
 * Uses the Haversine formula.
 * 
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} - Distance in meters
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Earth radius in meters
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

/**
 * Checks if a user is within a specified radius of a point.
 * 
 * @param {number} userLat 
 * @param {number} userLon 
 * @param {number} targetLat 
 * @param {number} targetLon 
 * @param {number} radiusMeters 
 * @returns {boolean}
 */
export const isWithinRadius = (userLat, userLon, targetLat, targetLon, radiusMeters) => {
    if (!userLat || !userLon || !targetLat || !targetLon) return false;
    const distance = calculateDistance(userLat, userLon, targetLat, targetLon);
    return distance <= radiusMeters;
};
