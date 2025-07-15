import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../hooks';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import FlightSearchScreen from '../screens/FlightSearchScreen';

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  const { user, isLoading, login, register, logout } = useAuth();

  if (isLoading) {
    return null; // You could show a loading screen here
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {user ? (
          // Authenticated stack
          <Stack.Screen name="Main">
            {() => (
              <FlightSearchScreen
                navigation={{ navigate: () => logout() }}
                user={user}
              />
            )}
          </Stack.Screen>
        ) : (
          // Auth stack
          <>
            <Stack.Screen name="Login">
              {({ navigation }) => (
                <LoginScreen
                  navigation={navigation}
                  onLogin={login}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Register">
              {({ navigation }) => (
                <RegisterScreen
                  navigation={navigation}
                  onRegister={register}
                />
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 