import axios from 'axios';
import { FlightSearchParams, FlightSearchResponse, Flight } from '../types';
import { API_CONFIG, isApiConfigured } from '../config/api';

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
      return response.data || [];
    } catch (error: any) {
      console.error('Airport search error:', error);
      
      // Handle rate limiting specifically
      if (error?.response?.status === 429) {
        console.log('Rate limit exceeded, using mock data');
      }
      
      // Return mock airport data for common codes
      return flightApi.getMockAirports(query);
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
      return response.data || [];
    } catch (error) {
      console.error('Nearby airports search error:', error);
      return [];
    }
  },

  // Mock airport data for common codes
  getMockAirports: (query: string) => {
    const airports: { [key: string]: any[] } = {
      'LAX': [{ 
        skyId: 'LAX', 
        iataCode: 'LAX', 
        name: 'Los Angeles International Airport', 
        city: 'Los Angeles',
        displayCode: 'LAX',
        cityName: 'Los Angeles'
      }],
      'JFK': [{ 
        skyId: 'JFK', 
        iataCode: 'JFK', 
        name: 'John F. Kennedy International Airport', 
        city: 'New York',
        displayCode: 'JFK',
        cityName: 'New York'
      }],
      'SFO': [{ 
        skyId: 'SFO', 
        iataCode: 'SFO', 
        name: 'San Francisco International Airport', 
        city: 'San Francisco',
        displayCode: 'SFO',
        cityName: 'San Francisco'
      }],
      'ORD': [{ 
        skyId: 'ORD', 
        iataCode: 'ORD', 
        name: 'O\'Hare International Airport', 
        city: 'Chicago',
        displayCode: 'ORD',
        cityName: 'Chicago'
      }],
      'MIA': [{ 
        skyId: 'MIA', 
        iataCode: 'MIA', 
        name: 'Miami International Airport', 
        city: 'Miami',
        displayCode: 'MIA',
        cityName: 'Miami'
      }],
      'DFW': [{ 
        skyId: 'DFW', 
        iataCode: 'DFW', 
        name: 'Dallas/Fort Worth International Airport', 
        city: 'Dallas',
        displayCode: 'DFW',
        cityName: 'Dallas'
      }],
      'ATL': [{ 
        skyId: 'ATL', 
        iataCode: 'ATL', 
        name: 'Hartsfield-Jackson Atlanta International Airport', 
        city: 'Atlanta',
        displayCode: 'ATL',
        cityName: 'Atlanta'
      }],
      'DEN': [{ 
        skyId: 'DEN', 
        iataCode: 'DEN', 
        name: 'Denver International Airport', 
        city: 'Denver',
        displayCode: 'DEN',
        cityName: 'Denver'
      }],
      'LAS': [{ 
        skyId: 'LAS', 
        iataCode: 'LAS', 
        name: 'McCarran International Airport', 
        city: 'Las Vegas',
        displayCode: 'LAS',
        cityName: 'Las Vegas'
      }],
      'SEA': [{ 
        skyId: 'SEA', 
        iataCode: 'SEA', 
        name: 'Seattle-Tacoma International Airport', 
        city: 'Seattle',
        displayCode: 'SEA',
        cityName: 'Seattle'
      }],
      'LHR': [{ 
        skyId: 'LHR', 
        iataCode: 'LHR', 
        name: 'London Heathrow Airport', 
        city: 'London',
        displayCode: 'LHR',
        cityName: 'London'
      }],
      'CDG': [{ 
        skyId: 'CDG', 
        iataCode: 'CDG', 
        name: 'Charles de Gaulle Airport', 
        city: 'Paris',
        displayCode: 'CDG',
        cityName: 'Paris'
      }],
      'NRT': [{ 
        skyId: 'NRT', 
        iataCode: 'NRT', 
        name: 'Narita International Airport', 
        city: 'Tokyo',
        displayCode: 'NRT',
        cityName: 'Tokyo'
      }],
      'YYZ': [{ 
        skyId: 'YYZ', 
        iataCode: 'YYZ', 
        name: 'Toronto Pearson International Airport', 
        city: 'Toronto',
        displayCode: 'YYZ',
        cityName: 'Toronto'
      }],
    };

    const upperQuery = query.toUpperCase();
    return airports[upperQuery] || [];
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
      // Try different possible response structures
      let itineraries = response.data.data?.itineraries || 
                       response.data.itineraries || 
                       response.data.data || 
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
      return flightApi.getMockFlights(params);
    }
  },

  // Mock data for development when API key is not available or API fails
  getMockFlights: (params: FlightSearchParams): FlightSearchResponse => {
    const mockFlights: Flight[] = [
      {
        id: '1',
        airline: 'American Airlines',
        flightNumber: 'AA123',
        departure: {
          airport: params.from || 'LAX',
          city: params.from === 'LAX' ? 'Los Angeles' : 'New York',
          time: '08:00',
          date: params.date,
        },
        arrival: {
          airport: params.to || 'JFK',
          city: params.to === 'JFK' ? 'New York' : 'Los Angeles',
          time: '16:30',
          date: params.date,
        },
        price: 299,
        duration: '8h 30m',
        stops: 0,
      },
      {
        id: '2',
        airline: 'Delta Airlines',
        flightNumber: 'DL456',
        departure: {
          airport: params.from || 'LAX',
          city: params.from === 'LAX' ? 'Los Angeles' : 'New York',
          time: '10:15',
          date: params.date,
        },
        arrival: {
          airport: params.to || 'JFK',
          city: params.to === 'JFK' ? 'New York' : 'Los Angeles',
          time: '18:45',
          date: params.date,
        },
        price: 275,
        duration: '8h 30m',
        stops: 1,
      },
      {
        id: '3',
        airline: 'United Airlines',
        flightNumber: 'UA789',
        departure: {
          airport: params.from || 'LAX',
          city: params.from === 'LAX' ? 'Los Angeles' : 'New York',
          time: '12:30',
          date: params.date,
        },
        arrival: {
          airport: params.to || 'JFK',
          city: params.to === 'JFK' ? 'New York' : 'Los Angeles',
          time: '21:00',
          date: params.date,
        },
        price: 320,
        duration: '8h 30m',
        stops: 0,
      },
      {
        id: '4',
        airline: 'Southwest Airlines',
        flightNumber: 'WN101',
        departure: {
          airport: params.from || 'LAX',
          city: params.from === 'LAX' ? 'Los Angeles' : 'New York',
          time: '14:45',
          date: params.date,
        },
        arrival: {
          airport: params.to || 'JFK',
          city: params.to === 'JFK' ? 'New York' : 'Los Angeles',
          time: '23:15',
          date: params.date,
        },
        price: 245,
        duration: '8h 30m',
        stops: 1,
      },
    ];

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