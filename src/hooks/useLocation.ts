import { useState, useEffect, useCallback } from 'react';
import { flightApi } from '../services/flightApi';
import { getUserLocation } from '../utils/locationService';
import { FlightSearchParams } from '../types';

interface UseLocationReturn {
  isLoadingLocation: boolean;
  getCurrentLocation: () => Promise<void>;
  setDefaultAirport: (airportCode: string) => void;
}

export const useLocation = (
  setSearchParams: React.Dispatch<React.SetStateAction<FlightSearchParams>>
): UseLocationReturn => {
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  const getCurrentLocation = useCallback(async () => {
    try {
      const coordinates = await getUserLocation();
      
      if (coordinates) {
        console.log('Current location:', coordinates);

        try {
          // Get nearby airports
          const nearbyAirports = await flightApi.getNearbyAirports(coordinates.latitude, coordinates.longitude);
          console.log('Nearby airports:', nearbyAirports);

          if (nearbyAirports && nearbyAirports.length > 0) {
            // Set the closest airport as default
            const closestAirport = nearbyAirports[0];
            const airportCode = closestAirport.iataCode || closestAirport.skyId;
            
            if (airportCode) {
              setSearchParams(prev => ({
                ...prev,
                from: airportCode
              }));
              console.log('Set default airport to:', airportCode);
            }
          }
        } catch (error) {
          console.log('Failed to get nearby airports:', error);
        }
      }
    } catch (error) {
      console.log('Location service error:', error);
    } finally {
      setIsLoadingLocation(false);
    }
  }, [setSearchParams]);

  const setDefaultAirport = useCallback((airportCode: string) => {
    setSearchParams(prev => ({
      ...prev,
      from: airportCode
    }));
  }, [setSearchParams]);

  // Get user's current location and set default airport
  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  return {
    isLoadingLocation,
    getCurrentLocation,
    setDefaultAirport,
  };
}; 