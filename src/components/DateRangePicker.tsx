import React, { useState, useCallback, memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableNativeFeedback,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';

interface DateRangePickerProps {
  departureDate: string;
  returnDate?: string;
  onDepartureDateChange: (date: string) => void;
  onReturnDateChange: (date: string) => void;
  isRoundTrip?: boolean;
  onTripTypeChange?: (isRoundTrip: boolean) => void;
}

// Custom Touchable component for better Android support
const CustomTouchable: React.FC<{
  onPress: () => void;
  children: React.ReactNode;
  style?: any;
}> = ({ onPress, children, style }) => {
  if (Platform.OS === 'android') {
    return (
      <TouchableNativeFeedback
        onPress={onPress}
        background={TouchableNativeFeedback.Ripple('#E0E0E0', false)}
      >
        <View style={style}>
          {children}
        </View>
      </TouchableNativeFeedback>
    );
  }
  
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      {children}
    </TouchableOpacity>
  );
};

const DateRangePicker: React.FC<DateRangePickerProps> = memo(({
  departureDate,
  returnDate,
  onDepartureDateChange,
  onReturnDateChange,
  isRoundTrip = true,
  onTripTypeChange,
}) => {
  const [showDeparturePicker, setShowDeparturePicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());

  const formatDate = useCallback((date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }, []);

  const formatDateForInput = useCallback((date: Date): string => {
    return date.toISOString().split('T')[0];
  }, []);

  const handleDepartureDatePress = useCallback(() => {
    setTempDate(new Date(departureDate));
    setShowDeparturePicker(true);
  }, [departureDate]);

  const handleReturnDatePress = useCallback(() => {
    const returnDateObj = returnDate ? new Date(returnDate) : new Date();
    setTempDate(returnDateObj);
    setShowReturnPicker(true);
  }, [returnDate]);

  const handleDateChange = useCallback((event: any, selectedDate?: Date) => {
    // Handle Android differently - close picker immediately
    if (Platform.OS === 'android') {
      setShowDeparturePicker(false);
      setShowReturnPicker(false);
    }

    if (selectedDate) {
      const formattedDate = formatDateForInput(selectedDate);
      
      if (showDeparturePicker) {
        onDepartureDateChange(formattedDate);
        // If it's a round trip and no return date is set, set return date to departure + 7 days
        if (isRoundTrip && !returnDate) {
          const returnDateObj = new Date(selectedDate);
          returnDateObj.setDate(returnDateObj.getDate() + 7);
          onReturnDateChange(formatDateForInput(returnDateObj));
        }
      } else if (showReturnPicker) {
        onReturnDateChange(formattedDate);
      }
    }
  }, [showDeparturePicker, showReturnPicker, returnDate, isRoundTrip, onDepartureDateChange, onReturnDateChange, formatDateForInput]);

  const handleTripTypeChange = useCallback(() => {
    if (onTripTypeChange) {
      onTripTypeChange(!isRoundTrip);
    }
  }, [isRoundTrip, onTripTypeChange]);

  const getDateRangeText = useCallback(() => {
    if (!isRoundTrip) {
      return formatDate(departureDate);
    }
    
    if (!returnDate) {
      return `${formatDate(departureDate)} - Select return`;
    }
    
    return `${formatDate(departureDate)} - ${formatDate(returnDate)}`;
  }, [departureDate, returnDate, isRoundTrip, formatDate]);

  const getDaysDifference = useCallback(() => {
    if (!isRoundTrip || !returnDate) return null;
    
    const departure = new Date(departureDate);
    const returnDateObj = new Date(returnDate);
    const diffTime = returnDateObj.getTime() - departure.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }, [departureDate, returnDate, isRoundTrip]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Dates</Text>
        <CustomTouchable 
          style={styles.tripTypeButton} 
          onPress={handleTripTypeChange}
        >
          <Text style={styles.tripTypeText}>
            {isRoundTrip ? 'Round trip' : 'One way'}
          </Text>
        </CustomTouchable>
      </View>

      <View style={styles.dateContainer}>
        <CustomTouchable 
          style={styles.dateButton} 
          onPress={handleDepartureDatePress}
        >
          <Text style={styles.dateLabel}>Departure</Text>
          <Text style={styles.dateText}>{formatDate(departureDate)}</Text>
        </CustomTouchable>

        {isRoundTrip && (
          <>
            <View style={styles.separator} />
            <CustomTouchable 
              style={styles.dateButton} 
              onPress={handleReturnDatePress}
            >
              <Text style={styles.dateLabel}>Return</Text>
              <Text style={styles.dateText}>
                {returnDate ? formatDate(returnDate) : 'Select date'}
              </Text>
            </CustomTouchable>
          </>
        )}
      </View>

      {/* <Text style={styles.rangeText}>{getDateRangeText()}</Text>
      
      {isRoundTrip && getDaysDifference() && (
        <Text style={styles.daysText}>
          {getDaysDifference()} day{getDaysDifference() !== 1 ? 's' : ''} trip
        </Text>
      )} */}

      {/* Departure Date Picker Modal */}
      {Platform.OS === 'android' ? (
        showDeparturePicker && (
          <DateTimePicker
            value={tempDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
            maximumDate={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)} // 1 year from now
          />
        )
      ) : (
        <Modal
          isVisible={showDeparturePicker}
          onBackdropPress={() => setShowDeparturePicker(false)}
          style={styles.modal}
        >
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select Departure Date</Text>
                          <CustomTouchable onPress={() => setShowDeparturePicker(false)}>
              <Text style={styles.closeButton}>Done</Text>
            </CustomTouchable>
            </View>
            <DateTimePicker
              value={tempDate}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
              minimumDate={new Date()}
              maximumDate={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)} // 1 year from now
            />
          </View>
        </Modal>
      )}

      {/* Return Date Picker Modal */}
      {Platform.OS === 'android' ? (
        showReturnPicker && (
          <DateTimePicker
            value={tempDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date(departureDate)}
            maximumDate={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)} // 1 year from now
          />
        )
      ) : (
        <Modal
          isVisible={showReturnPicker}
          onBackdropPress={() => setShowReturnPicker(false)}
          style={styles.modal}
        >
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select Return Date</Text>
                          <CustomTouchable onPress={() => setShowReturnPicker(false)}>
              <Text style={styles.closeButton}>Done</Text>
            </CustomTouchable>
            </View>
            <DateTimePicker
              value={tempDate}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
              minimumDate={new Date(departureDate)}
              maximumDate={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)} // 1 year from now
            />
          </View>
        </Modal>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  tripTypeButton: {
    padding: 4,
    borderRadius: Platform.OS === 'android' ? 4 : 0,
  },
  tripTypeText: {
    fontSize: 14,
    color: Platform.OS === 'android' ? '#1976D2' : '#007AFF',
    textDecorationLine: Platform.OS === 'android' ? 'none' : 'underline',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: Platform.OS === 'android' ? 4 : 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 16,
    elevation: Platform.OS === 'android' ? 2 : 0,
    shadowColor: Platform.OS === 'ios' ? '#000' : undefined,
    shadowOffset: Platform.OS === 'ios' ? { width: 0, height: 2 } : undefined,
    shadowOpacity: Platform.OS === 'ios' ? 0.1 : undefined,
    shadowRadius: Platform.OS === 'ios' ? 3.84 : undefined,
  },
  dateButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Platform.OS === 'android' ? 8 : 0,
    minHeight: Platform.OS === 'android' ? 48 : 'auto',
  },
  dateLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  separator: {
    width: 1,
    height: 40,
    backgroundColor: '#ddd',
    marginHorizontal: 16,
  },
  rangeText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  daysText: {
    fontSize: 12,
    color: Platform.OS === 'android' ? '#1976D2' : '#007AFF',
    marginTop: 4,
    textAlign: 'center',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: Platform.OS === 'android' ? 8 : 20,
    borderTopRightRadius: Platform.OS === 'android' ? 8 : 20,
    padding: 20,
    elevation: Platform.OS === 'android' ? 8 : 0,
    shadowColor: Platform.OS === 'ios' ? '#000' : undefined,
    shadowOffset: Platform.OS === 'ios' ? { width: 0, height: -2 } : undefined,
    shadowOpacity: Platform.OS === 'ios' ? 0.25 : undefined,
    shadowRadius: Platform.OS === 'ios' ? 3.84 : undefined,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    fontSize: 16,
    color: Platform.OS === 'android' ? '#1976D2' : '#007AFF',
    fontWeight: '600',
  },
});

export default DateRangePicker; 