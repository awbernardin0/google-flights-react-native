// Location Service Utilities
// Centralized location handling for the app

import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface LocationPermissionResult {
  granted: boolean;
  error?: string;
}

/**
 * Request location permission based on platform
 */
export const requestLocationPermission = async (): Promise<LocationPermissionResult> => {
  if (Platform.OS === 'ios') {
    return { granted: true }; // iOS handles permissions differently
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'This app needs access to your location to find nearby airports.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    
    return { 
      granted: granted === PermissionsAndroid.RESULTS.GRANTED 
    };
  } catch (err) {
    console.warn('Location permission error:', err);
    return { 
      granted: false, 
      error: 'Failed to request location permission' 
    };
  }
};

/**
 * Get current location coordinates
 */
export const getCurrentLocation = (): Promise<LocationCoordinates> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position: any) => {
        const { latitude, longitude } = position.coords;
        console.log('Current location:', { latitude, longitude });
        resolve({ latitude, longitude });
      },
      (error: any) => {
        console.log('Location error:', error);
        reject(error);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 15000, 
        maximumAge: 10000 
      }
    );
  });
};

/**
 * Get user's current location with permission handling
 */
export const getUserLocation = async (): Promise<LocationCoordinates | null> => {
  try {
    const permissionResult = await requestLocationPermission();
    
    if (!permissionResult.granted) {
      console.log('Location permission denied');
      return null;
    }

    const coordinates = await getCurrentLocation();
    return coordinates;
  } catch (error) {
    console.log('Location service error:', error);
    return null;
  }
}; 