import axios from 'axios';
import { FlightSearchParams, FlightSearchResponse, Flight } from '../types';

const RAPIDAPI_KEY = 'YOUR_RAPIDAPI_KEY'; // Replace with actual key
const RAPIDAPI_HOST = 'sky-scrapper.p.rapidapi.com';

const api = axios.create({
  baseURL: 'https://sky-scrapper.p.rapidapi.com',
  headers: {
    'X-RapidAPI-Key': RAPIDAPI_KEY,
    'X-RapidAPI-Host': RAPIDAPI_HOST,
  },
});

export const flightApi = {
  searchFlights: async (params: FlightSearchParams): Promise<FlightSearchResponse> => {
    try {
      const response = await api.get('/flights/search', {
        params: {
          originSkyId: params.from,
          destinationSkyId: params.to,
          date: params.date,
          adults: params.passengers || 1,
          cabinClass: params.class || 'economy',
        },
      });

      // Transform the API response to match our Flight interface
      const flights: Flight[] = response.data.data?.itineraries?.map((itinerary: any, index: number) => ({
        id: `flight-${index}`,
        airline: itinerary.legs?.[0]?.carriers?.marketing?.[0]?.name || 'Unknown',
        flightNumber: itinerary.legs?.[0]?.carriers?.marketing?.[0]?.flightNumber || 'N/A',
        departure: {
          airport: itinerary.legs?.[0]?.origin?.displayCode || '',
          city: itinerary.legs?.[0]?.origin?.city || '',
          time: itinerary.legs?.[0]?.departure || '',
          date: params.date,
        },
        arrival: {
          airport: itinerary.legs?.[0]?.destination?.displayCode || '',
          city: itinerary.legs?.[0]?.destination?.city || '',
          time: itinerary.legs?.[0]?.arrival || '',
          date: params.date,
        },
        price: itinerary.pricing_options?.[0]?.price?.amount || 0,
        duration: itinerary.legs?.[0]?.duration || '',
        stops: itinerary.legs?.[0]?.stopCount || 0,
      })) || [];

      return {
        success: true,
        data: flights,
      };
    } catch (error) {
      console.error('Flight search error:', error);
      return {
        success: false,
        data: [],
        error: 'Failed to search flights',
      };
    }
  },

  // Mock data for development when API key is not available
  getMockFlights: (params: FlightSearchParams): FlightSearchResponse => {
    const mockFlights: Flight[] = [
      {
        id: '1',
        airline: 'American Airlines',
        flightNumber: 'AA123',
        departure: {
          airport: 'LAX',
          city: 'Los Angeles',
          time: '08:00',
          date: params.date,
        },
        arrival: {
          airport: 'JFK',
          city: 'New York',
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
          airport: 'LAX',
          city: 'Los Angeles',
          time: '10:15',
          date: params.date,
        },
        arrival: {
          airport: 'JFK',
          city: 'New York',
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
          airport: 'LAX',
          city: 'Los Angeles',
          time: '12:30',
          date: params.date,
        },
        arrival: {
          airport: 'JFK',
          city: 'New York',
          time: '21:00',
          date: params.date,
        },
        price: 320,
        duration: '8h 30m',
        stops: 0,
      },
    ];

    return {
      success: true,
      data: mockFlights,
    };
  },
}; 