# Google Flights React Native App

A mobile application that replicates Google Flights functionality with user authentication, location-based search, and comprehensive flight search capabilities.

## Features

- **User Authentication**: Sign up and login functionality with local storage
- **Location-Based Search**: Automatic detection of nearest airport using GPS
- **Smart Flight Search**: Search with optional destination (like Google Flights)
- **Date Range Picker**: Round-trip and one-way flight selection with native date pickers
- **Passenger Management**: Flexible passenger count input with smart defaults
- **Real API Integration**: Sky Scrapper API from RapidAPI with graceful fallback to mock data
- **Flight Results**: Display flight results with airline, times, prices, and detailed information
- **Modern UI**: Clean and intuitive user interface optimized for both iOS and Android
- **TypeScript**: Full TypeScript support for better development experience
- **Comprehensive Testing**: 90+ tests covering components, hooks, and services

## Tech Stack

- **React Native**: 0.80.1
- **TypeScript**: 5.0.4
- **React Navigation**: For app navigation
- **AsyncStorage**: For local data persistence
- **Axios**: For API calls (Sky Scrapper API from RapidAPI)
- **React Native Geolocation**: For location-based airport detection
- **React Native DateTimePicker**: For native date selection
- **React Native Modal**: For modal dialogs
- **Jest & React Native Testing Library**: For comprehensive testing

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── FlightCard.tsx      # Flight result card component
│   ├── SearchInput.tsx     # Reusable search input component
│   ├── ApiStatusIndicator.tsx # API status display component
│   └── DateRangePicker.tsx # Date range selection component
├── hooks/              # Custom React hooks
│   ├── useFlightSearch.ts  # Flight search logic
│   ├── useLocation.ts      # Location and nearby airports
│   ├── useAuth.ts          # Authentication state
│   ├── useForm.ts          # Generic form state
│   └── useApiStatus.ts     # API configuration status
├── navigation/          # Navigation configuration
│   └── AppNavigator.tsx    # Main app navigation
├── screens/            # App screens
│   ├── LoginScreen.tsx     # User login screen
│   ├── RegisterScreen.tsx  # User registration screen
│   └── FlightSearchScreen.tsx # Flight search and results
├── services/           # API and business logic
│   ├── authService.ts      # Authentication service
│   └── flightApi.ts        # Flight search API service
├── types/              # TypeScript type definitions
│   └── index.ts            # App type definitions
├── utils/              # Utility functions
│   ├── apiTransformers.ts  # API response transformers
│   ├── mockData.ts         # Mock data generators
│   └── locationService.ts  # Location utilities
└── config/             # Configuration files
    └── api.ts             # API configuration
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd google-flights-react-native
```

2. Install dependencies:
```bash
npm install
```

3. For iOS (requires macOS):
```bash
cd ios && pod install && cd ..
```

4. Start the Metro bundler:
```bash
npm start
```

5. Run the app:

For iOS:
```bash
npm run ios
```

For Android:
```bash
npm run android
```

## API Configuration

The app uses the Sky Scrapper API from RapidAPI for flight search. To use the real API:

1. **Sign up for a RapidAPI account** at https://rapidapi.com
2. **Subscribe to the Sky Scrapper API** at https://rapidapi.com/apiheya/api/sky-scrapper (they have a free tier)
3. **Get your API key** from the RapidAPI dashboard
4. **Replace the API key** in `src/config/api.ts`:
   ```typescript
   export const API_CONFIG = {
     RAPIDAPI_KEY: 'YOUR_ACTUAL_API_KEY_HERE', // Replace this
     // ... rest of config
   };
   ```
5. **Restart the app** to load the new configuration

**Note:** The app will automatically fall back to mock data if:
- No API key is configured
- The API key is invalid
- The API is unavailable
- API rate limits are exceeded

This ensures the app always works for demonstration purposes.

## Location Services

The app uses device GPS to automatically detect your nearest airport:
- **iOS**: Requires location permission in Settings
- **Android**: Requests location permission on first use
- **Fallback**: Uses LAX as default if location is unavailable

## Features in Detail

### Authentication
- User registration with name, email, and password
- User login with email and password
- Local storage for user sessions
- Password validation and error handling
- Form state management with custom hooks

### Location-Based Search
- Automatic GPS detection of nearest airport
- Integration with Sky Scrapper's nearby airports API
- Graceful fallback to default airport (LAX)
- Location permission handling for iOS and Android

### Smart Flight Search
- **Optional Destination**: Search with only departure airport (like Google Flights)
- **Flexible Input**: Clear and edit passenger count with smart defaults
- **Date Range Picker**: Native date selection with round-trip/one-way toggle
- **Real-time Results**: Loading states and API status indicators
- **Mock Data Fallback**: Comprehensive demo data when API unavailable

### Flight Results
- Airline information and flight numbers
- Departure and arrival times and airports
- Flight duration and stop information
- Pricing display with realistic ranges
- Multiple flight options with varied airlines and routes
- API status indicators (real vs demo data)

### User Experience
- **Native Feel**: Platform-specific date pickers and UI elements
- **Performance Optimized**: React.memo, useMemo, and useCallback hooks
- **Responsive Design**: Works seamlessly on iOS and Android
- **Error Handling**: Graceful degradation and user-friendly messages

## Development Notes

- **Modular Architecture**: Custom hooks for reusable logic, separate utilities for API transformers and mock data
- **Performance Optimized**: React.memo, useMemo, and useCallback hooks prevent unnecessary re-renders
- **Comprehensive Testing**: 90+ tests covering components, hooks, services, and utilities
- **Type Safety**: Full TypeScript implementation with proper type definitions
- **Error Handling**: Graceful API failure handling with user-friendly fallbacks
- **Platform Optimization**: Native date pickers and platform-specific UI elements

## Future Enhancements

- **Flight Booking**: Integration with booking APIs for actual ticket purchases
- **User Profiles**: Enhanced user management with preferences and history
- **Flight History**: Save and manage previous searches and bookings
- **Favorites**: Bookmark favorite routes and airlines
- **Push Notifications**: Price alerts and flight status updates
- **Advanced Filters**: Price range, airlines, stop preferences, cabin class
- **Multi-city Trips**: Support for complex multi-destination itineraries
- **Offline Support**: Cache flight data for offline viewing
- **Social Features**: Share flight deals with friends
- **Accessibility**: Enhanced screen reader support and accessibility features

## Screenshots

The app includes:
- **Authentication Screens**: Login and registration with form validation
- **Flight Search Screen**: Smart search with location detection and optional destination
- **Date Range Picker**: Native date selection with round-trip/one-way options
- **Flight Results**: Detailed flight cards with airline info, pricing, and booking options
- **API Status Indicators**: Clear indication of real vs demo data usage

## Testing

Run the comprehensive test suite:

```bash
npm test
```

The test suite includes:
- **90+ tests** covering components, hooks, services, and utilities
- **Component tests** for UI elements and user interactions
- **Hook tests** for custom React hooks and state management
- **Service tests** for API integration and data transformation
- **Utility tests** for helper functions and mock data generation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. **Run tests**: `npm test` to ensure all tests pass
5. **Test on both platforms**: iOS and Android
6. Submit a pull request with detailed description

## License

This project is created for assessment purposes.
