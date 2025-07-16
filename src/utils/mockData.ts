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
  // If no destination is provided, show flights to popular destinations from the departure airport
  const popularDestinations = ['JFK', 'SFO', 'ORD', 'MIA', 'DFW', 'ATL', 'DEN', 'LAS', 'SEA'];
  
  // If destination is provided, use it; otherwise, use popular destinations
  const destinations = params.to ? [params.to] : popularDestinations;
  
  const flights: any[] = [];
  let flightId = 1;
  
  destinations.forEach((dest, index) => {
    if (index >= 4) return; // Limit to 4 flights for demo
    
    const airlines = ['American Airlines', 'Delta Airlines', 'United Airlines', 'Southwest Airlines'];
    const flightNumbers = ['AA123', 'DL456', 'UA789', 'WN101'];
    const times = ['08:00', '10:15', '12:30', '14:45'];
    const prices = [299, 275, 320, 245];
    
    flights.push({
      id: flightId.toString(),
      airline: airlines[index % airlines.length],
      flightNumber: flightNumbers[index % flightNumbers.length],
      departure: {
        airport: params.from || 'LAX',
        city: getCityName(params.from),
        time: times[index % times.length],
        date: params.departureDate,
      },
      arrival: {
        airport: dest,
        city: getCityName(dest),
        time: getArrivalTime(times[index % times.length]),
        date: params.departureDate,
      },
      price: prices[index % prices.length],
      duration: '8h 30m',
      stops: index % 2, // Alternate between direct and connecting flights
    });
    
    flightId++;
  });
  
  return flights;
};

// Helper function to get city name from airport code
const getCityName = (airportCode: string): string => {
  const cityMap: { [key: string]: string } = {
    'LAX': 'Los Angeles',
    'JFK': 'New York',
    'SFO': 'San Francisco',
    'ORD': 'Chicago',
    'MIA': 'Miami',
    'DFW': 'Dallas',
    'ATL': 'Atlanta',
    'DEN': 'Denver',
    'LAS': 'Las Vegas',
    'SEA': 'Seattle',
  };
  return cityMap[airportCode] || 'Unknown';
};

// Helper function to calculate arrival time
const getArrivalTime = (departureTime: string): string => {
  const [hours, minutes] = departureTime.split(':').map(Number);
  const arrivalHours = (hours + 8) % 24; // 8 hour flight
  return `${arrivalHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}; 