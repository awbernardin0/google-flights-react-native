# Google Flights React Native App

A mobile application that replicates Google Flights functionality with user authentication and flight search capabilities.

## Features

- **User Authentication**: Sign up and login functionality with local storage
- **Flight Search**: Search for flights with departure, destination, date, and passenger count
- **Flight Results**: Display flight results with airline, times, prices, and booking options
- **Modern UI**: Clean and intuitive user interface with React Native
- **TypeScript**: Full TypeScript support for better development experience

## Tech Stack

- **React Native**: 0.80.1
- **TypeScript**: 5.0.4
- **React Navigation**: For app navigation
- **AsyncStorage**: For local data persistence
- **Axios**: For API calls (Sky Scrapper API from RapidAPI)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── FlightCard.tsx  # Flight result card component
├── navigation/          # Navigation configuration
│   └── AppNavigator.tsx # Main app navigation
├── screens/            # App screens
│   ├── LoginScreen.tsx    # User login screen
│   ├── RegisterScreen.tsx # User registration screen
│   └── FlightSearchScreen.tsx # Flight search and results
├── services/           # API and business logic
│   ├── authService.ts     # Authentication service
│   └── flightApi.ts       # Flight search API service
├── types/              # TypeScript type definitions
│   └── index.ts           # App type definitions
└── utils/              # Utility functions
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

1. Sign up for a RapidAPI account
2. Subscribe to the Sky Scrapper API
3. Get your API key
4. Replace `YOUR_RAPIDAPI_KEY` in `src/services/flightApi.ts` with your actual API key

Currently, the app uses mock data for demonstration purposes.

## Features in Detail

### Authentication
- User registration with name, email, and password
- User login with email and password
- Local storage for user sessions
- Password validation and error handling

### Flight Search
- Search by departure and destination airports
- Date selection for travel
- Passenger count specification
- Real-time search results with loading states

### Flight Results
- Airline information and flight numbers
- Departure and arrival times and airports
- Flight duration and stop information
- Pricing display
- Booking button (placeholder for future implementation)

## Development Notes

- The app uses AsyncStorage for local data persistence
- Mock flight data is provided for demonstration
- The UI is designed to be responsive and user-friendly
- TypeScript is used throughout for type safety

## Future Enhancements

- Real API integration with Sky Scrapper
- Flight booking functionality
- User profile management
- Flight history and favorites
- Push notifications for price alerts
- Advanced search filters (price range, airlines, etc.)

## Screenshots

The app includes:
- Login screen with email and password fields
- Registration screen with full user details
- Flight search screen with search form
- Flight results with detailed flight cards

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is created for assessment purposes.
