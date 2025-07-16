import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface ExampleComponentProps {
  title?: string;
  onPress?: () => void;
}

const ExampleComponent: React.FC<ExampleComponentProps> = ({ 
  title = 'Hello World', 
  onPress 
}) => {
  return (
    <View>
      <Text>{title}</Text>
      {onPress && (
        <TouchableOpacity onPress={onPress}>
          <Text>Click me</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ExampleComponent; 