import { renderHook, act } from '@testing-library/react-native';
import { useFlightSearch } from '../useFlightSearch';
import { flightApi } from '../../services/flightApi';
import { Alert } from 'react-native';

// Mock the flightApi
jest.mock('../../services/flightApi', () => ({
  flightApi: {
    searchFlights: jest.fn(),
    getMockFlights: jest.fn(),
  },
}));

// Mock Alert.alert directly
const mockAlert = jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());

describe('useFlightSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useFlightSearch());

    expect(result.current.flights).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasSearched).toBe(false);
    expect(result.current.isUsingRealApi).toBe(false);
    expect(result.current.apiFailed).toBe(false);
    expect(typeof result.current.searchFlights).toBe('function');
    expect(typeof result.current.resetSearch).toBe('function');
  });

  it('should show alert when search params are missing', async () => {
    const { result } = renderHook(() => useFlightSearch());

    await act(async () => {
      await result.current.searchFlights({
        from: '',
        to: 'JFK',
        departureDate: '2024-01-15',
        passengers: 1,
      });
    });

    expect(mockAlert).toHaveBeenCalledWith('Error', 'Please fill in the departure airport');
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle successful API search', async () => {
    const mockFlights = [
      {
        id: '1',
        airline: 'Test Airline',
        flightNumber: 'TA123',
        departure: { airport: 'LAX', city: 'Los Angeles', time: '10:00', date: '2024-01-15' },
        arrival: { airport: 'JFK', city: 'New York', time: '18:00', date: '2024-01-15' },
        price: 299,
        duration: '8h',
        stops: 0,
      },
    ];

    (flightApi.searchFlights as jest.Mock).mockResolvedValue({
      success: true,
      data: mockFlights,
    });

    const { result } = renderHook(() => useFlightSearch());

    await act(async () => {
      await result.current.searchFlights({
        from: 'LAX',
        to: 'JFK',
        departureDate: '2024-01-15',
        passengers: 1,
      });
    });

    expect(result.current.flights).toEqual(mockFlights);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasSearched).toBe(true);
    expect(result.current.isUsingRealApi).toBe(true);
    expect(result.current.apiFailed).toBe(false);
  });

  it('should handle API failure and fallback to mock data', async () => {
    const mockFlights = [
      {
        id: '1',
        airline: 'Mock Airline',
        flightNumber: 'MA123',
        departure: { airport: 'LAX', city: 'Los Angeles', time: '10:00', date: '2024-01-15' },
        arrival: { airport: 'JFK', city: 'New York', time: '18:00', date: '2024-01-15' },
        price: 299,
        duration: '8h',
        stops: 0,
      },
    ];

    (flightApi.searchFlights as jest.Mock).mockResolvedValue({
      success: false,
      data: mockFlights,
      error: 'API Error',
    });

    const { result } = renderHook(() => useFlightSearch());

    await act(async () => {
      await result.current.searchFlights({
        from: 'LAX',
        to: 'JFK',
        departureDate: '2024-01-15',
        passengers: 1,
      });
    });

    expect(result.current.flights).toEqual(mockFlights);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasSearched).toBe(true);
    expect(result.current.isUsingRealApi).toBe(false);
    expect(result.current.apiFailed).toBe(true);
  });

  it('should handle API exception and fallback to mock data', async () => {
    const mockFlights = [
      {
        id: '1',
        airline: 'Mock Airline',
        flightNumber: 'MA123',
        departure: { airport: 'LAX', city: 'Los Angeles', time: '10:00', date: '2024-01-15' },
        arrival: { airport: 'JFK', city: 'New York', time: '18:00', date: '2024-01-15' },
        price: 299,
        duration: '8h',
        stops: 0,
      },
    ];

    (flightApi.searchFlights as jest.Mock).mockRejectedValue(new Error('Network error'));
    (flightApi.getMockFlights as jest.Mock).mockReturnValue({
      success: true,
      data: mockFlights,
    });

    const { result } = renderHook(() => useFlightSearch());

    await act(async () => {
      await result.current.searchFlights({
        from: 'LAX',
        to: 'JFK',
        departureDate: '2024-01-15',
        passengers: 1,
      });
    });

    expect(result.current.flights).toEqual(mockFlights);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasSearched).toBe(true);
    expect(result.current.isUsingRealApi).toBe(false);
    expect(result.current.apiFailed).toBe(true);
  });

  it('should reset search state', () => {
    const { result } = renderHook(() => useFlightSearch());

    // First, set some state
    act(() => {
      result.current.resetSearch();
    });

    expect(result.current.flights).toEqual([]);
    expect(result.current.hasSearched).toBe(false);
    expect(result.current.isUsingRealApi).toBe(false);
    expect(result.current.apiFailed).toBe(false);
  });
}); 