import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { FlightSearchParams } from '../types';
import FlightCard from '../components/FlightCard';
import SearchInput from '../components/SearchInput';
import ApiStatusIndicator from '../components/ApiStatusIndicator';
import DateRangePicker from '../components/DateRangePicker';
import { useFlightSearch, useLocation, useApiStatus } from '../hooks';

interface FlightSearchScreenProps {
  navigation: any;
  user: any;
}

const FlightSearchScreen: React.FC<FlightSearchScreenProps> = ({ navigation, user }) => {
  const [searchParams, setSearchParams] = useState<FlightSearchParams>({
    from: '',
    to: '',
    departureDate: new Date().toISOString().split('T')[0], // Today's date
    returnDate: undefined,
    passengers: 1,
    isRoundTrip: true,
  });

  // Custom hooks
  const {
    flights,
    isLoading,
    hasSearched,
    isUsingRealApi,
    apiFailed,
    searchFlights,
  } = useFlightSearch();

  const { isLoadingLocation } = useLocation(setSearchParams);
  const { isConfigured: isApiConfiguredValue } = useApiStatus();

  const handleSearch = () => {
    searchFlights(searchParams);
  };

  const handleLogout = () => {
    navigation.navigate('Auth');
  };

  // Memoize computed values to prevent unnecessary re-renders
  const resultsTitle = useMemo(() => 
    isLoading ? 'Searching...' : `Found ${flights.length} flights`, 
    [isLoading, flights.length]
  );
  const hasFlights = useMemo(() => flights.length > 0, [flights.length]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Flights</Text>
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
          
          <ApiStatusIndicator isConfigured={isApiConfiguredValue} />
          
          <SearchInput
            label="From"
            placeholder="From (e.g., LAX, New York)"
            value={searchParams.from}
            onChangeText={(text) => setSearchParams({ ...searchParams, from: text })}
            loading={isLoadingLocation}
            loadingText="Finding nearest airport..."
          />

          <SearchInput
            label="To"
            placeholder="To (e.g., JFK, Los Angeles)"
            value={searchParams.to}
            onChangeText={(text) => setSearchParams({ ...searchParams, to: text })}
          />

          <DateRangePicker
            departureDate={searchParams.departureDate}
            returnDate={searchParams.returnDate}
            onDepartureDateChange={(date) => setSearchParams({ ...searchParams, departureDate: date })}
            onReturnDateChange={(date) => setSearchParams({ ...searchParams, returnDate: date })}
            isRoundTrip={searchParams.isRoundTrip}
            onTripTypeChange={(isRoundTrip) => setSearchParams({ ...searchParams, isRoundTrip })}
          />

          <SearchInput
            label="Passengers"
            placeholder="Passengers (default: 1)"
            value={searchParams.passengers?.toString() || '1'}
            onChangeText={(text) => setSearchParams({ ...searchParams, passengers: parseInt(text) || 1 })}
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
              {resultsTitle}
            </Text>
            
            {!isLoading && isUsingRealApi && !apiFailed && (
              <Text style={styles.apiStatus}>✅ Using real flight data</Text>
            )}
            
            {!isLoading && !isUsingRealApi && !apiFailed && (
              <Text style={styles.apiStatus}>📱 Using demo data</Text>
            )}
            
            {!isLoading && apiFailed && (
              <Text style={styles.apiStatus}>⚠️ API failed, showing demo data</Text>
            )}
            
            {!isLoading && !hasFlights && (
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