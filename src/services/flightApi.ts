import axios from 'axios';
import { FlightSearchParams, FlightSearchResponse, Flight } from '../types';
import { API_CONFIG, isApiConfigured } from '../config/api';
import { transformAirportData, extractApiData, handleApiError } from '../utils/apiTransformers';
import { getMockAirports, generateMockFlights } from '../utils/mockData';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'X-RapidAPI-Key': API_CONFIG.RAPIDAPI_KEY,
    'X-RapidAPI-Host': API_CONFIG.RAPIDAPI_HOST,
  },
});

export const flightApi = {
  // Search for airports using the correct API endpoint
  searchAirports: async (query: string) => {
    try {
      // Use the correct searchAirport endpoint from RapidAPI
      const response = await api.get('/api/v1/flights/searchAirport', {
        params: {
          query: query,
          locale: 'en-US',
        },
      });
      console.log('Airport search response:', response);
      const airportData = extractApiData(response);
      return transformAirportData(airportData);
    } catch (error: any) {
      handleApiError(error, 'Airport search');
      return getMockAirports(query);
    }
  },

  // Get nearby airports (alternative search method)
  getNearbyAirports: async (lat: number, lng: number) => {
    try {
      const response = await api.get('/api/v1/flights/getNearByAirports', {
        params: {
          lat: lat,
          lng: lng,
          locale: 'en-US',
        },
      });
      const airportData = extractApiData(response);
      return transformAirportData(airportData);
    } catch (error) {
      handleApiError(error, 'Nearby airports search');
      return [];
    }
  },

  // Mock airport data for common codes
  getMockAirports: (query: string) => {
    return getMockAirports(query);
  },

  // Search flights using the real API
  searchFlights: async (params: FlightSearchParams): Promise<FlightSearchResponse> => {
    try {
      // First, we need to get airport codes from the search query
      const fromAirports = await flightApi.searchAirports(params.from);
      const toAirports = await flightApi.searchAirports(params.to);

      if (!fromAirports.length || !toAirports.length) {
        return {
          success: false,
          data: [],
          error: 'Could not find airports for the specified locations. Try using airport codes like LAX, JFK, SFO.',
        };
      }

      const fromAirport = fromAirports[0];
      const toAirport = toAirports[0];

      // Use the flights search endpoint with correct API path
      const response = await api.get('/api/v1/flights/search', {
        params: {
          origin: fromAirport.skyId || fromAirport.iataCode,
          destination: toAirport.skyId || toAirport.iataCode,
          date: params.date,
          adults: params.passengers || 1,
          cabinClass: params.class || 'economy',
          currency: 'USD',
          locale: 'en-US',
        },
      });

      // Debug: Log the API response structure
      console.log('API Response:', JSON.stringify(response.data, null, 2));
      
      // Transform the API response to match our Flight interface
      // Handle the new API response structure where data is nested under response.data.data
      let itineraries = response.data?.data?.itineraries || 
                       response.data?.itineraries || 
                       response.data?.data || 
                       [];
      
      const flights: Flight[] = itineraries.map((itinerary: any, index: number) => {
        const leg = itinerary.legs?.[0] || itinerary;
        const pricing = itinerary.pricing_options?.[0] || itinerary.pricing;
        
        return {
          id: `flight-${index}`,
          airline: leg?.carriers?.marketing?.[0]?.name || 
                  leg?.carrier?.name || 
                  'Unknown',
          flightNumber: leg?.carriers?.marketing?.[0]?.flightNumber || 
                      leg?.flightNumber || 
                      'N/A',
          departure: {
            airport: leg?.origin?.displayCode || 
                    leg?.origin?.code || 
                    leg?.departureAirport || 
                    '',
            city: leg?.origin?.city || 
                  leg?.departureCity || 
                  '',
            time: leg?.departure || 
                  leg?.departureTime || 
                  '',
            date: params.date,
          },
          arrival: {
            airport: leg?.destination?.displayCode || 
                    leg?.destination?.code || 
                    leg?.arrivalAirport || 
                    '',
            city: leg?.destination?.city || 
                  leg?.arrivalCity || 
                  '',
            time: leg?.arrival || 
                  leg?.arrivalTime || 
                  '',
            date: params.date,
          },
          price: pricing?.price?.amount || 
                pricing?.amount || 
                itinerary.price || 
                0,
          duration: leg?.duration || 
                   itinerary.duration || 
                   '',
          stops: leg?.stopCount || 
                itinerary.stops || 
                0,
        };
      }) || [];

      return {
        success: true,
        data: flights,
      };
    } catch (error: any) {
      console.error('Flight search error:', error);
      console.error('Error details:', {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data
      });
      
      // Handle rate limiting specifically
      if (error?.response?.status === 429) {
        console.log('Rate limit exceeded, using mock data');
      }
      
      // If API fails, fall back to mock data for demo purposes
      console.log('Falling back to mock data due to API error');
      return {
        success: false,
        data: flightApi.getMockFlights(params).data,
        error: `API Error: ${error?.response?.status || error?.message || 'Unknown error'}`
      };
    }
  },

  // Mock data for development when API key is not available or API fails
  getMockFlights: (params: FlightSearchParams): FlightSearchResponse => {
    const mockFlights = generateMockFlights(params);
    return {
      success: true,
      data: mockFlights,
    };
  },

  // Check if API key is configured
  isApiConfigured: (): boolean => {
    return isApiConfigured();
  },
}; 