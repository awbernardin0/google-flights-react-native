// Mock Data Utilities
// Centralized mock data for development and fallback scenarios

export const MOCK_AIRPORTS: { [key: string]: any[] } = {
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

/**
 * Get mock airport data for a given query
 */
export const getMockAirports = (query: string): any[] => {
  const upperQuery = query.toUpperCase();
  return MOCK_AIRPORTS[upperQuery] || [];
};

/**
 * Generate mock flights for development
 */
export const generateMockFlights = (params: any): any[] => {
  return [
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
}; 