/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

// Mock the navigation components to avoid Jest issues
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: any) => children,
}));

jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: () => ({
    Navigator: ({ children }: any) => children,
    Screen: ({ children }: any) => children,
  }),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

import App from '../App';

describe('Google Flights App', () => {
  it('renders without crashing', () => {
    const tree = ReactTestRenderer.create(<App />);
    expect(tree).toBeDefined();
  });
});
