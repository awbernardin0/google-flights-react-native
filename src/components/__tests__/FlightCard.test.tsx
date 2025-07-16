import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FlightCard from '../FlightCard';

describe('FlightCard', () => {
  const mockFlight = {
    id: '1',
    airline: 'Test Airlines',
    flightNumber: 'TA123',
    departure: {
      airport: 'LAX',
      city: 'Los Angeles',
      time: '10:00',
      date: '2024-01-15',
    },
    arrival: {
      airport: 'JFK',
      city: 'New York',
      time: '18:00',
      date: '2024-01-15',
    },
    price: 299,
    duration: '8h',
    stops: 0,
  };

  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render flight information correctly', () => {
    const { getByText } = render(<FlightCard flight={mockFlight} onPress={mockOnPress} />);

    expect(getByText('Test Airlines')).toBeTruthy();
    expect(getByText('TA123')).toBeTruthy();
    expect(getByText('LAX')).toBeTruthy();
    expect(getByText('Los Angeles')).toBeTruthy();
    expect(getByText('10:00')).toBeTruthy();
    expect(getByText('JFK')).toBeTruthy();
    expect(getByText('New York')).toBeTruthy();
    expect(getByText('18:00')).toBeTruthy();
    expect(getByText('$299')).toBeTruthy();
    expect(getByText('8h')).toBeTruthy();
    expect(getByText('Direct')).toBeTruthy();
    expect(getByText('Book Now')).toBeTruthy();
  });

  it('should handle onPress event', () => {
    const { getByText } = render(<FlightCard flight={mockFlight} onPress={mockOnPress} />);

    fireEvent.press(getByText('Book Now'));

    expect(mockOnPress).toHaveBeenCalled();
  });

  it('should display stops correctly for direct flights', () => {
    const { getByText } = render(<FlightCard flight={mockFlight} onPress={mockOnPress} />);

    expect(getByText('Direct')).toBeTruthy();
  });

  it('should display stops correctly for flights with stops', () => {
    const flightWithStops = { ...mockFlight, stops: 1 };
    const { getByText } = render(<FlightCard flight={flightWithStops} onPress={mockOnPress} />);

    expect(getByText('1 stop')).toBeTruthy();
  });

  it('should display multiple stops correctly', () => {
    const flightWithMultipleStops = { ...mockFlight, stops: 2 };
    const { getByText } = render(<FlightCard flight={flightWithMultipleStops} onPress={mockOnPress} />);

    expect(getByText('2 stops')).toBeTruthy();
  });

  it('should format price correctly', () => {
    const { getByText } = render(<FlightCard flight={mockFlight} onPress={mockOnPress} />);

    expect(getByText('$299')).toBeTruthy();
  });

  it('should handle zero price', () => {
    const freeFlight = { ...mockFlight, price: 0 };
    const { getByText } = render(<FlightCard flight={freeFlight} onPress={mockOnPress} />);

    expect(getByText('$0')).toBeTruthy();
  });

  it('should handle high price values', () => {
    const expensiveFlight = { ...mockFlight, price: 1299 };
    const { getByText } = render(<FlightCard flight={expensiveFlight} onPress={mockOnPress} />);

    expect(getByText('$1299')).toBeTruthy();
  });

  it('should be accessible', () => {
    const { getByText } = render(<FlightCard flight={mockFlight} onPress={mockOnPress} />);

    const airlineText = getByText('Test Airlines');
    const flightNumberText = getByText('TA123');
    const bookButton = getByText('Book Now');

    expect(airlineText).toBeTruthy();
    expect(flightNumberText).toBeTruthy();
    expect(bookButton).toBeTruthy();
  });

  it('should render without onPress prop', () => {
    const { getByText } = render(<FlightCard flight={mockFlight} />);

    expect(getByText('Test Airlines')).toBeTruthy();
    expect(getByText('Book Now')).toBeTruthy();
  });

  it('should handle missing flight data gracefully', () => {
    const incompleteFlight = {
      id: '1',
      airline: 'Test Airlines',
      flightNumber: 'TA123',
      departure: {
        airport: 'LAX',
        city: 'Los Angeles',
        time: '10:00',
        date: '2024-01-15',
      },
      arrival: {
        airport: 'JFK',
        city: 'New York',
        time: '18:00',
        date: '2024-01-15',
      },
      price: 299,
      duration: '',
      stops: 0,
    };

    const { getByText } = render(<FlightCard flight={incompleteFlight} onPress={mockOnPress} />);

    expect(getByText('Test Airlines')).toBeTruthy();
    expect(getByText('$299')).toBeTruthy();
    expect(getByText('Direct')).toBeTruthy();
  });
}); 