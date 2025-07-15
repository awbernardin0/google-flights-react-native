// API Response Transformers
// Centralized data transformation utilities for API responses

export interface RawAirportData {
  skyId: string;
  presentation?: {
    title: string;
    subtitle: string;
  };
  navigation?: {
    localizedName: string;
    entityType: string;
  };
}

export interface TransformedAirportData {
  skyId: string;
  iataCode: string;
  name: string;
  city: string;
  displayCode: string;
  cityName: string;
  entityType: string;
  subtitle: string;
}

/**
 * Transforms raw airport data from API to standardized format
 */
export const transformAirportData = (airportData: RawAirportData[]): TransformedAirportData[] => {
  return airportData.map((airport) => ({
    skyId: airport.skyId,
    iataCode: airport.skyId, // Use skyId as iataCode
    name: airport.presentation?.title || airport.navigation?.localizedName || '',
    city: airport.navigation?.localizedName || airport.presentation?.title || '',
    displayCode: airport.skyId,
    cityName: airport.navigation?.localizedName || airport.presentation?.title || '',
    entityType: airport.navigation?.entityType || 'AIRPORT',
    subtitle: airport.presentation?.subtitle || ''
  }));
};

/**
 * Extracts data from nested API response structure
 */
export const extractApiData = (response: any): any[] => {
  return response.data?.data || response.data || [];
};

/**
 * Handles API error responses with proper logging
 */
export const handleApiError = (error: any, context: string): void => {
  console.error(`${context} error:`, error);
  
  if (error?.response?.status === 429) {
    console.log('Rate limit exceeded, using mock data');
  }
}; 