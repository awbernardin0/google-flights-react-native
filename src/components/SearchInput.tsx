import React, { memo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';

interface SearchInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  loading?: boolean;
  loadingText?: string;
}

const SearchInput: React.FC<SearchInputProps> = memo(({
  label,
  placeholder,
  value,
  onChangeText,
  loading = false,
  loadingText = 'Loading...',
}) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      {loading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{loadingText}</Text>
        </View>
      )}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="characters"
        autoCorrect={false}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 8,
  },
});

export default SearchInput; 