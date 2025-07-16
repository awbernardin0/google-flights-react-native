import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import DateRangePicker from '../DateRangePicker';

// Mock the date picker and modal
jest.mock('@react-native-community/datetimepicker', () => {
  return function DateTimePicker(props: any) {
    return require('react').createElement('DateTimePicker', props);
  };
});

jest.mock('react-native-modal', () => {
  return function Modal(props: any) {
    return require('react').createElement('Modal', props);
  };
});

describe('DateRangePicker', () => {
  const defaultProps = {
    departureDate: '2024-01-15',
    returnDate: '2024-01-22',
    onDepartureDateChange: jest.fn(),
    onReturnDateChange: jest.fn(),
    isRoundTrip: true,
    onTripTypeChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly with round trip', () => {
    render(<DateRangePicker {...defaultProps} />);
    expect(screen.getByText('Dates')).toBeTruthy();
    expect(screen.getByText('Round trip')).toBeTruthy();
    expect(screen.getByText('Departure')).toBeTruthy();
    expect(screen.getByText('Return')).toBeTruthy();
    expect(screen.getByText('Mon, Jan 15')).toBeTruthy();
    expect(screen.getByText('Mon, Jan 22')).toBeTruthy();
  });

  it('should render correctly with one way trip', () => {
    const props = { ...defaultProps, isRoundTrip: false };
    const { getByText, queryByText } = render(<DateRangePicker {...props} />);
    expect(getByText('One way')).toBeTruthy();
    expect(getByText('Departure')).toBeTruthy();
    expect(queryByText('Return')).toBeFalsy();
    expect(getByText('Mon, Jan 15')).toBeTruthy();
  });

  it('should handle trip type change', () => {
    const { getByText } = render(<DateRangePicker {...defaultProps} />);
    fireEvent.press(getByText('Round trip'));
    expect(defaultProps.onTripTypeChange).toHaveBeenCalledWith(false);
  });

  it('should handle departure date press', () => {
    const { getByText } = render(<DateRangePicker {...defaultProps} />);
    fireEvent.press(getByText('Mon, Jan 15'));
    expect(getByText('Mon, Jan 15')).toBeTruthy();
  });

  it('should handle return date press', () => {
    const { getByText } = render(<DateRangePicker {...defaultProps} />);
    fireEvent.press(getByText('Mon, Jan 22'));
    expect(getByText('Mon, Jan 22')).toBeTruthy();
  });

  it('should show "Select date" when return date is not set', () => {
    const props = { ...defaultProps, returnDate: undefined };
    const { getByText } = render(<DateRangePicker {...props} />);
    expect(getByText('Select date')).toBeTruthy();
    expect(getByText('Mon, Jan 15')).toBeTruthy();
  });

  it('should format dates correctly', () => {
    const props = {
      ...defaultProps,
      departureDate: '2024-12-25',
      returnDate: '2024-12-31',
    };
    const { getByText } = render(<DateRangePicker {...props} />);
    expect(getByText('Wed, Dec 25')).toBeTruthy();
    expect(getByText('Tue, Dec 31')).toBeTruthy();
  });

  it('should handle single day trip', () => {
    const props = {
      ...defaultProps,
      departureDate: '2024-01-15',
      returnDate: '2024-01-15',
    };
    const { getAllByText } = render(<DateRangePicker {...props} />);
    const matches = getAllByText('Mon, Jan 15');
    expect(matches.length).toBeGreaterThan(1);
  });

  it('should not show trip duration for one way trips', () => {
    const props = { ...defaultProps, isRoundTrip: false };
    const { queryByText } = render(<DateRangePicker {...props} />);
    expect(queryByText(/day.*trip/)).toBeFalsy();
  });

  it('should handle missing return date in round trip', () => {
    const props = { ...defaultProps, returnDate: undefined };
    const { getByText } = render(<DateRangePicker {...props} />);
    expect(getByText('Mon, Jan 15')).toBeTruthy();
    expect(getByText('Select date')).toBeTruthy();
    expect(() => getByText(/day.*trip/)).toThrow();
  });

  it('should be accessible', () => {
    const { getByText } = render(<DateRangePicker {...defaultProps} />);
    const departureButton = getByText('Mon, Jan 15');
    const returnButton = getByText('Mon, Jan 22');
    const tripTypeButton = getByText('Round trip');
    expect(departureButton).toBeTruthy();
    expect(returnButton).toBeTruthy();
    expect(tripTypeButton).toBeTruthy();
  });
}); 