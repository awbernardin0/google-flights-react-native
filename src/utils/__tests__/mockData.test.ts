import { getMockAirports, generateMockFlights, MOCK_AIRPORTS } from '../mockData';

describe('mockData', () => {
  describe('getMockAirports', () => {
    it('should return airports for valid query', () => {
      const result = getMockAirports('LAX');
      
      expect(result).toHaveLength(1);
      expect(result[0].iataCode).toBe('LAX');
      expect(result[0].name).toBe('Los Angeles International Airport');
      expect(result[0].city).toBe('Los Angeles');
    });

    it('should return empty array for invalid query', () => {
      const result = getMockAirports('INVALID');
      
      expect(result).toHaveLength(0);
    });

    it('should be case insensitive', () => {
      const result = getMockAirports('lax');
      
      expect(result).toHaveLength(1);
      expect(result[0].iataCode).toBe('LAX');
    });

    it('should return multiple airports for known codes', () => {
      const testCases = [
        { code: 'JFK', expected: 'John F. Kennedy International Airport' },
        { code: 'SFO', expected: 'San Francisco International Airport' },
        { code: 'ORD', expected: 'O\'Hare International Airport' },
        { code: 'MIA', expected: 'Miami International Airport' },
      ];

      testCases.forEach(({ code, expected }) => {
        const result = getMockAirports(code);
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe(expected);
      });
    });
  });

  describe('generateMockFlights', () => {
    const mockParams = {
      from: 'LAX',
      to: 'JFK',
      departureDate: '2024-01-15',
      passengers: 1,
    };

    it('should generate mock flights with correct structure', () => {
      const result = generateMockFlights(mockParams);
      
      expect(result).toHaveLength(1); // Only one destination when 'to' is provided
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('airline');
      expect(result[0]).toHaveProperty('flightNumber');
      expect(result[0]).toHaveProperty('departure');
      expect(result[0]).toHaveProperty('arrival');
      expect(result[0]).toHaveProperty('price');
      expect(result[0]).toHaveProperty('duration');
      expect(result[0]).toHaveProperty('stops');
    });

    it('should use provided parameters in flight data', () => {
      const result = generateMockFlights(mockParams);
      
      result.forEach(flight => {
        expect(flight.departure.airport).toBe('LAX');
        expect(flight.arrival.airport).toBe('JFK');
        expect(flight.departure.date).toBe('2024-01-15');
        expect(flight.arrival.date).toBe('2024-01-15');
      });
    });

    it('should generate different airlines when multiple destinations', () => {
      // Test with no destination to get multiple flights
      const paramsWithNoDestination = { ...mockParams, to: '' };
      const result = generateMockFlights(paramsWithNoDestination);
      const airlines = result.map(flight => flight.airline);
      
      expect(airlines).toContain('American Airlines');
      expect(airlines).toContain('Delta Airlines');
      expect(airlines).toContain('United Airlines');
      expect(airlines).toContain('Southwest Airlines');
    });

    it('should generate realistic price ranges', () => {
      const result = generateMockFlights(mockParams);
      
      result.forEach(flight => {
        expect(flight.price).toBeGreaterThan(0);
        expect(flight.price).toBeLessThan(1000);
      });
    });

    it('should include both direct and connecting flights when multiple destinations', () => {
      // Test with no destination to get multiple flights
      const paramsWithNoDestination = { ...mockParams, to: '' };
      const result = generateMockFlights(paramsWithNoDestination);
      const stops = result.map(flight => flight.stops);
      
      expect(stops).toContain(0); // Direct flights
      expect(stops).toContain(1); // Connecting flights
    });

    it('should handle missing parameters gracefully', () => {
      const incompleteParams = {
        from: '',
        to: '',
        departureDate: '2024-01-15',
      };
      
      const result = generateMockFlights(incompleteParams);
      
      expect(result).toHaveLength(4); // Multiple destinations when no 'to' is provided
      result.forEach(flight => {
        expect(flight.departure.airport).toBe('LAX'); // Default
        // Arrival airport will be one of the popular destinations
        expect(['JFK', 'SFO', 'ORD', 'MIA', 'DFW', 'ATL', 'DEN', 'LAS', 'SEA']).toContain(flight.arrival.airport);
      });
    });

    it('should generate multiple flights when no destination is provided', () => {
      const paramsWithNoDestination = { ...mockParams, to: '' };
      const result = generateMockFlights(paramsWithNoDestination);
      
      expect(result).toHaveLength(4); // Should generate 4 flights to popular destinations
      result.forEach(flight => {
        expect(flight.departure.airport).toBe('LAX');
        expect(['JFK', 'SFO', 'ORD', 'MIA', 'DFW', 'ATL', 'DEN', 'LAS', 'SEA']).toContain(flight.arrival.airport);
      });
    });
  });

  describe('MOCK_AIRPORTS', () => {
    it('should contain expected airport data', () => {
      expect(MOCK_AIRPORTS).toHaveProperty('LAX');
      expect(MOCK_AIRPORTS).toHaveProperty('JFK');
      expect(MOCK_AIRPORTS).toHaveProperty('SFO');
    });

    it('should have consistent structure for all airports', () => {
      Object.values(MOCK_AIRPORTS).forEach(airports => {
        airports.forEach(airport => {
          expect(airport).toHaveProperty('skyId');
          expect(airport).toHaveProperty('iataCode');
          expect(airport).toHaveProperty('name');
          expect(airport).toHaveProperty('city');
          expect(airport).toHaveProperty('displayCode');
          expect(airport).toHaveProperty('cityName');
        });
      });
    });

    it('should have unique IATA codes', () => {
      const allCodes = Object.keys(MOCK_AIRPORTS);
      const uniqueCodes = new Set(allCodes);
      
      expect(allCodes.length).toBe(uniqueCodes.size);
    });
  });
}); 