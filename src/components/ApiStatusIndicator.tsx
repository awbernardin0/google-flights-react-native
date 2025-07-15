import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

interface ApiStatusIndicatorProps {
  isConfigured: boolean;
}

const ApiStatusIndicator: React.FC<ApiStatusIndicatorProps> = ({ isConfigured }) => {
  if (!isConfigured) {
    return (
      <View style={styles.apiWarning}>
        <Text style={styles.apiWarningText}>
          ⚠️ Using mock data. Add your RapidAPI key to use real flight data.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.apiInfo}>
      <Text style={styles.apiInfoText}>
        ✅ Real API configured. Rate limit may apply on free tier.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  apiWarning: {
    backgroundColor: '#FFF3CD',
    borderColor: '#FFEAA7',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  apiWarningText: {
    color: '#856404',
    fontSize: 14,
    textAlign: 'center',
  },
  apiInfo: {
    backgroundColor: '#D1ECF1',
    borderColor: '#BEE5EB',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  apiInfoText: {
    color: '#0C5460',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ApiStatusIndicator; 