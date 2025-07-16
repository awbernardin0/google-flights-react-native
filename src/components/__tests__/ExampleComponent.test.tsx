import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ExampleComponent from '../ExampleComponent';

describe('ExampleComponent', () => {
  it('renders with default title', () => {
    const { getByText } = render(<ExampleComponent />);
    expect(getByText('Hello World')).toBeTruthy();
  });

  it('renders with custom title', () => {
    const { getByText } = render(<ExampleComponent title="Custom Title" />);
    expect(getByText('Custom Title')).toBeTruthy();
  });

  it('calls onPress when button is pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(<ExampleComponent onPress={mockOnPress} />);
    
    fireEvent.press(getByText('Click me'));
    expect(mockOnPress).toHaveBeenCalled();
  });

  it('does not render button when onPress is not provided', () => {
    const { queryByText } = render(<ExampleComponent />);
    expect(queryByText('Click me')).toBeNull();
  });
}); 