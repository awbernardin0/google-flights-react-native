import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { authService } from '../services/authService';
import { User } from '../types';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import FlightSearchScreen from '../screens/FlightSearchScreen';

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleRegister = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
  };

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
                navigation={{ navigate: () => handleLogout() }}
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
                  onLogin={handleLogin}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Register">
              {({ navigation }) => (
                <RegisterScreen
                  navigation={navigation}
                  onRegister={handleRegister}
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