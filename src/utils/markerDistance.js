// Function to calculate the distance between two coordinates using the Haversine formula

export default function markerDistance(coord1, coord2) {
  // Function to convert degrees to radians
  const deg2rad = (degrees) => {
    return degrees * (Math.PI / 180);
  };
  console.log(coord1, coord2)
  const R = 6371; // Earth's radius in kilometers
  const dLat = deg2rad(coord2.lat - coord1.lat);
  const dLon = deg2rad(coord2.lon - coord1.lon);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(coord1.lat)) *
      Math.cos(deg2rad(coord2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in kilometers
  console.log("🚀 ~ markerDistance ~ distance:", distance)
  return `${parseFloat(distance.toFixed(2))} km`;
}
