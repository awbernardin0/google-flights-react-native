import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LoginCredentials, RegisterCredentials } from '../types';

const USERS_STORAGE_KEY = 'google_flights_users';
const CURRENT_USER_KEY = 'google_flights_current_user';

export const authService = {
  // Register a new user
  register: async (credentials: RegisterCredentials): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      // Validate passwords match
      if (credentials.password !== credentials.confirmPassword) {
        return { success: false, error: 'Passwords do not match' };
      }

      // Validate password length
      if (credentials.password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters long' };
      }

      // Get existing users
      const existingUsersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const existingUsers: User[] = existingUsersJson ? JSON.parse(existingUsersJson) : [];

      // Check if email already exists
      const existingUser = existingUsers.find(user => user.email === credentials.email);
      if (existingUser) {
        return { success: false, error: 'Email already registered' };
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email: credentials.email,
        name: credentials.name,
        createdAt: new Date(),
      };

      // Save user to storage
      const updatedUsers = [...existingUsers, newUser];
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  },

  // Login user
  login: async (credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      // Get existing users
      const existingUsersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const existingUsers: User[] = existingUsersJson ? JSON.parse(existingUsersJson) : [];

      // Find user by email
      const user = existingUsers.find(u => u.email === credentials.email);
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      // In a real app, you would hash and verify passwords
      // For this demo, we'll use a simple check
      if (credentials.password.length < 6) {
        return { success: false, error: 'Invalid password' };
      }

      // Save current user session
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    try {
      const user = await authService.getCurrentUser();
      return !!user;
    } catch (error) {
      console.error('Authentication check error:', error);
      return false;
    }
  },
}; 