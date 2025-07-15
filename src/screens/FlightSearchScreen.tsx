import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { flightApi } from '../services/flightApi';
import { Flight, FlightSearchParams } from '../types';
import FlightCard from '../components/FlightCard';
import { isApiConfigured } from '../config/api';

interface FlightSearchScreenProps {
  navigation: any;
  user: any;
}

const FlightSearchScreen: React.FC<FlightSearchScreenProps> = ({ navigation, user }) => {
  const [searchParams, setSearchParams] = useState<FlightSearchParams>({
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0], // Today's date
    passengers: 1,
  });
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isUsingRealApi, setIsUsingRealApi] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  // Get user's current location and set default airport
  useEffect(() => {
    getCurrentLocation();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      return true; // iOS handles permissions differently
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location to find nearby airports.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const getCurrentLocation = async () => {
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        console.log('Location permission denied');
        setIsLoadingLocation(false);
        return;
      }

      // Get current position using the proper geolocation library
      Geolocation.getCurrentPosition(
        async (position: any) => {
          const { latitude, longitude } = position.coords;
          console.log('Current location:', { latitude, longitude });

          try {
            // Get nearby airports
            const nearbyAirports = await flightApi.getNearbyAirports(latitude, longitude);
            console.log('Nearby airports:', nearbyAirports);

            if (nearbyAirports && nearbyAirports.length > 0) {
              // Set the closest airport as default
              const closestAirport = nearbyAirports[0];
              const airportCode = closestAirport.iataCode || closestAirport.code || closestAirport.skyId;
              
              if (airportCode) {
                setSearchParams(prev => ({
                  ...prev,
                  from: airportCode
                }));
                console.log('Set default airport to:', airportCode);
              }
            }
          } catch (error) {
            console.log('Failed to get nearby airports:', error);
          } finally {
            setIsLoadingLocation(false);
          }
        },
        (error: any) => {
          console.log('Location error:', error);
          setIsLoadingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } catch (error) {
      console.log('Location permission error:', error);
      setIsLoadingLocation(false);
    }
  };

  const handleSearch = async () => {
    if (!searchParams.from || !searchParams.to) {
      Alert.alert('Error', 'Please fill in both departure and destination');
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      // Check if real API is configured
      const apiConfigured = isApiConfigured();
      setIsUsingRealApi(apiConfigured);

      if (apiConfigured) {
        // Use real API
        const result = await flightApi.searchFlights(searchParams);
        if (result.success) {
          setFlights(result.data);
        } else {
          Alert.alert('Search Error', result.error || 'Failed to search flights');
          setFlights([]);
        }
      } else {
        // Use mock data
        const result = flightApi.getMockFlights(searchParams);
        setFlights(result.data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to search flights');
      setFlights([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    // This would be handled by the auth context
    navigation.navigate('Auth');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Flight Search</Text>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Welcome, {user?.name}</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.searchForm}>
          <Text style={styles.formTitle}>Search Flights</Text>
          
          {!isApiConfigured() && (
            <View style={styles.apiWarning}>
              <Text style={styles.apiWarningText}>
                ⚠️ Using mock data. Add your RapidAPI key to use real flight data.
              </Text>
            </View>
          )}
          
          {isApiConfigured() && (
            <View style={styles.apiInfo}>
              <Text style={styles.apiInfoText}>
                ✅ Real API configured. Rate limit may apply on free tier.
              </Text>
            </View>
          )}
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>From</Text>
            {isLoadingLocation && (
              <View style={styles.locationLoading}>
                <ActivityIndicator size="small" color="#007AFF" />
                <Text style={styles.locationLoadingText}>Finding nearest airport...</Text>
              </View>
            )}
            <TextInput
              style={styles.input}
              placeholder="From (e.g., LAX, New York)"
              value={searchParams.from}
              onChangeText={(text) => setSearchParams({ ...searchParams, from: text })}
              autoCapitalize="characters"
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="To (e.g., JFK, Los Angeles)"
            value={searchParams.to}
            onChangeText={(text) => setSearchParams({ ...searchParams, to: text })}
            autoCapitalize="characters"
          />

          <TextInput
            style={styles.input}
            placeholder="Date (YYYY-MM-DD)"
            value={searchParams.date}
            onChangeText={(text) => setSearchParams({ ...searchParams, date: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Passengers (default: 1)"
            value={searchParams.passengers?.toString() || '1'}
            onChangeText={(text) => setSearchParams({ ...searchParams, passengers: parseInt(text) || 1 })}
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={[styles.searchButton, isLoading && styles.buttonDisabled]}
            onPress={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.searchButtonText}>Search Flights</Text>
            )}
          </TouchableOpacity>
        </View>

        {hasSearched && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>
              {isLoading ? 'Searching...' : `Found ${flights.length} flights`}
            </Text>
            
            {!isLoading && isUsingRealApi && (
              <Text style={styles.apiStatus}>✅ Using real flight data</Text>
            )}
            
            {!isLoading && !isUsingRealApi && (
              <Text style={styles.apiStatus}>📱 Using demo data</Text>
            )}
            
            {!isLoading && flights.length === 0 && (
              <Text style={styles.noResults}>No flights found for your search criteria.</Text>
            )}

            {flights.map((flight) => (
              <FlightCard key={flight.id} flight={flight} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: {
    color: 'white',
    fontSize: 14,
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: 'white',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  content: {
    flex: 1,
  },
  searchForm: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
  },
  apiWarning: {
    backgroundColor: '#FFF3CD',
    borderColor: '#FFEAA7',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  apiWarningText: {
    color: '#856404',
    fontSize: 12,
    textAlign: 'center',
  },
  apiInfo: {
    backgroundColor: '#D1ECF1',
    borderColor: '#BEE5EB',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  apiInfoText: {
    color: '#0C5460',
    fontSize: 12,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  locationLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  locationLoadingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  searchButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  apiStatus: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  noResults: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 20,
  },
});

export default FlightSearchScreen; 