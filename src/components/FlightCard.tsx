import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Flight } from '../types';

interface FlightCardProps {
  flight: Flight;
  onPress?: () => void;
}

const FlightCard: React.FC<FlightCardProps> = ({ flight, onPress }) => {
  // Memoize computed values to prevent unnecessary re-calculations
  const stopsText = useMemo(() => 
    flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`,
    [flight.stops]
  );

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.airline}>{flight.airline}</Text>
        <Text style={styles.flightNumber}>{flight.flightNumber}</Text>
      </View>

      <View style={styles.route}>
        <View style={styles.departure}>
          <Text style={styles.time}>{flight.departure.time}</Text>
          <Text style={styles.airport}>{flight.departure.airport}</Text>
          <Text style={styles.city}>{flight.departure.city}</Text>
        </View>

        <View style={styles.durationContainer}>
          <View style={styles.durationLine} />
          <Text style={styles.duration}>{flight.duration}</Text>
          <Text style={styles.stops}>
            {stopsText}
          </Text>
        </View>

        <View style={styles.arrival}>
          <Text style={styles.time}>{flight.arrival.time}</Text>
          <Text style={styles.airport}>{flight.arrival.airport}</Text>
          <Text style={styles.city}>{flight.arrival.city}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.price}>${flight.price}</Text>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  airline: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  flightNumber: {
    fontSize: 14,
    color: '#666',
  },
  route: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  departure: {
    flex: 1,
    alignItems: 'flex-start',
  },
  arrival: {
    flex: 1,
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  airport: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginTop: 2,
  },
  city: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  durationContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  durationLine: {
    height: 2,
    backgroundColor: '#ddd',
    width: '100%',
    marginBottom: 4,
  },
  duration: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  stops: {
    fontSize: 10,
    color: '#999',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  bookButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default FlightCard; 