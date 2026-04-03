const SITE = {
  lat: 18.5204,     // 🔴 replace with YOUR site latitude
  lon: 73.8567,     // 🔴 replace with YOUR site longitude
  radius: 150,      // meters
};

function toRad(value) {
  return (value * Math.PI) / 180;
}

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // meters

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function isInsideConstructionSite(userLat, userLon) {
  const distance = getDistance(
    userLat,
    userLon,
    SITE.lat,
    SITE.lon
  );

  return distance <= SITE.radius;
}
