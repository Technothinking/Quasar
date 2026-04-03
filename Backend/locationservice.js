import * as Location from 'expo-location';

export async function getCurrentLocation() {
  const { status } =
    await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    throw new Error('Location permission denied');
  }

  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });

  if (location.coords.mocked) {
    throw new Error('Fake GPS detected');
  }

  if (location.coords.accuracy > 40) {
    throw new Error('GPS accuracy too low');
  }

  return {
    lat: location.coords.latitude,
    lon: location.coords.longitude,
    accuracy: location.coords.accuracy,
  };
} 
