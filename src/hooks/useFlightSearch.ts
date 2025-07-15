import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { flightApi } from '../services/flightApi';
import { Flight, FlightSearchParams } from '../types';
import { isApiConfigured } from '../config/api';

interface UseFlightSearchReturn {
  flights: Flight[];
  isLoading: boolean;
  hasSearched: boolean;
  isUsingRealApi: boolean;
  apiFailed: boolean;
  searchFlights: (params: FlightSearchParams) => Promise<void>;
  resetSearch: () => void;
}

export const useFlightSearch = (): UseFlightSearchReturn => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isUsingRealApi, setIsUsingRealApi] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);

  const searchFlights = useCallback(async (searchParams: FlightSearchParams) => {
    if (!searchParams.from || !searchParams.to) {
      Alert.alert('Error', 'Please fill in both departure and destination');
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      // Check if real API is configured
      const apiConfigured = isApiConfigured();
      setApiFailed(false);

      if (apiConfigured) {
        // Use real API
        const result = await flightApi.searchFlights(searchParams);
        if (result.success) {
          console.log('✅ API call successful, using real data');
          setFlights(result.data);
          setIsUsingRealApi(true);
        } else {
          // API failed but returned mock data
          console.log('⚠️ API failed, using provided mock data:', result.error);
          setFlights(result.data);
          setIsUsingRealApi(false);
          setApiFailed(true);
        }
      } else {
        // Use mock data
        const result = flightApi.getMockFlights(searchParams);
        setFlights(result.data);
        setIsUsingRealApi(false);
      }
    } catch (error) {
      console.log('❌ API call threw exception, using mock data:', error);
      // API call failed, fall back to mock data
      const mockResult = flightApi.getMockFlights(searchParams);
      setFlights(mockResult.data);
      setIsUsingRealApi(false);
      setApiFailed(true);
      // Don't show alert for API failures since we're showing mock data
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetSearch = useCallback(() => {
    setFlights([]);
    setHasSearched(false);
    setIsUsingRealApi(false);
    setApiFailed(false);
  }, []);

  return {
    flights,
    isLoading,
    hasSearched,
    isUsingRealApi,
    apiFailed,
    searchFlights,
    resetSearch,
  };
}; 