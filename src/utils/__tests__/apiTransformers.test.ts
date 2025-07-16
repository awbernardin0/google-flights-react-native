import { transformAirportData, extractApiData, handleApiError } from '../apiTransformers';

describe('apiTransformers', () => {
  describe('transformAirportData', () => {
    it('should transform valid airport data', () => {
      const mockAirportData = [
        {
          skyId: 'LAX',
          presentation: {
            title: 'Los Angeles International Airport',
            subtitle: 'Los Angeles, CA',
          },
          navigation: {
            localizedName: 'Los Angeles',
            entityType: 'AIRPORT',
          },
        },
        {
          skyId: 'JFK',
          presentation: {
            title: 'John F. Kennedy International Airport',
            subtitle: 'New York, NY',
          },
          navigation: {
            localizedName: 'New York',
            entityType: 'AIRPORT',
          },
        },
      ];

      const result = transformAirportData(mockAirportData);

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('skyId');
      expect(result[0]).toHaveProperty('iataCode');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('city');
      expect(result[0]).toHaveProperty('displayCode');
      expect(result[0]).toHaveProperty('cityName');
      expect(result[0]).toHaveProperty('entityType');
      expect(result[0]).toHaveProperty('subtitle');

      expect(result[0].skyId).toBe('LAX');
      expect(result[0].iataCode).toBe('LAX');
      expect(result[0].name).toBe('Los Angeles International Airport');
      expect(result[0].city).toBe('Los Angeles');
      expect(result[0].displayCode).toBe('LAX');
      expect(result[0].cityName).toBe('Los Angeles');
      expect(result[0].entityType).toBe('AIRPORT');
      expect(result[0].subtitle).toBe('Los Angeles, CA');
    });

    it('should handle missing presentation data', () => {
      const incompleteData = [
        {
          skyId: 'LAX',
          navigation: {
            localizedName: 'Los Angeles',
            entityType: 'AIRPORT',
          },
        },
      ];

      const result = transformAirportData(incompleteData);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Los Angeles');
      expect(result[0].city).toBe('Los Angeles');
      expect(result[0].subtitle).toBe('');
    });

    it('should handle missing navigation data', () => {
      const incompleteData = [
        {
          skyId: 'LAX',
          presentation: {
            title: 'Los Angeles International Airport',
            subtitle: 'Los Angeles, CA',
          },
        },
      ];

      const result = transformAirportData(incompleteData);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Los Angeles International Airport');
      expect(result[0].city).toBe('Los Angeles International Airport');
      expect(result[0].cityName).toBe('Los Angeles International Airport');
      expect(result[0].entityType).toBe('AIRPORT');
    });

    it('should handle completely empty data', () => {
      const emptyData = [
        {
          skyId: 'LAX',
        },
      ];

      const result = transformAirportData(emptyData);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('');
      expect(result[0].city).toBe('');
      expect(result[0].cityName).toBe('');
      expect(result[0].subtitle).toBe('');
      expect(result[0].entityType).toBe('AIRPORT');
    });
  });

  describe('extractApiData', () => {
    it('should extract data from nested response', () => {
      const nestedResponse = {
        data: {
          data: ['item1', 'item2'],
        },
      };

      const result = extractApiData(nestedResponse);

      expect(result).toEqual(['item1', 'item2']);
    });

    it('should extract data from simple response', () => {
      const simpleResponse = {
        data: ['item1', 'item2'],
      };

      const result = extractApiData(simpleResponse);

      expect(result).toEqual(['item1', 'item2']);
    });

    it('should return empty array for null response', () => {
      const nullResponse = null;

      const result = extractApiData(nullResponse);

      expect(result).toEqual([]);
    });

    it('should return empty array for response without data', () => {
      const emptyResponse = {};

      const result = extractApiData(emptyResponse);

      expect(result).toEqual([]);
    });
  });

  describe('handleApiError', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    it('should log error with context', () => {
      const error = new Error('Test error');
      const context = 'Test context';

      handleApiError(error, context);

      expect(consoleSpy).toHaveBeenCalledWith('Test context error:', error);
    });

    it('should handle rate limit errors', () => {
      const rateLimitError = {
        response: {
          status: 429,
        },
      };
      const context = 'API call';

      const logSpy = jest.spyOn(console, 'log').mockImplementation();

      handleApiError(rateLimitError, context);

      expect(logSpy).toHaveBeenCalledWith('Rate limit exceeded, using mock data');
    });

    it('should handle errors without response', () => {
      const error = new Error('Network error');
      const context = 'Network call';

      handleApiError(error, context);

      expect(consoleSpy).toHaveBeenCalledWith('Network call error:', error);
    });
  });
}); 