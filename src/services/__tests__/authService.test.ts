import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../authService';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const validCredentials = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    };

    it('should register a new user successfully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const result = await authService.register(validCredentials);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe('test@example.com');
      expect(result.user?.name).toBe('Test User');
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should fail when passwords do not match', async () => {
      const invalidCredentials = {
        ...validCredentials,
        confirmPassword: 'differentpassword',
      };

      const result = await authService.register(invalidCredentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Passwords do not match');
    });

    it('should fail when password is too short', async () => {
      const shortPasswordCredentials = {
        ...validCredentials,
        password: '123',
        confirmPassword: '123',
      };

      const result = await authService.register(shortPasswordCredentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Password must be at least 6 characters long');
    });

    it('should fail when email already exists', async () => {
      const existingUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Existing User',
        createdAt: new Date(),
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([existingUser]));

      const result = await authService.register(validCredentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email already registered');
    });

    it('should handle storage errors', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const result = await authService.register(validCredentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Registration failed');
    });
  });

  describe('login', () => {
    const loginCredentials = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login successfully with valid credentials', async () => {
      const existingUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([existingUser]));
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const result = await authService.login(loginCredentials);

      expect(result.success).toBe(true);
      expect(result.user?.email).toBe(existingUser.email);
      expect(result.user?.name).toBe(existingUser.name);
      expect(result.user?.id).toBe(existingUser.id);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should fail when user does not exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));

      const result = await authService.login(loginCredentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe('User not found');
    });

    it('should fail with invalid password', async () => {
      const existingUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([existingUser]));

      const result = await authService.login({
        email: 'test@example.com',
        password: '123', // Too short
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid password');
    });

    it('should handle storage errors', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const result = await authService.login(loginCredentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Login failed');
    });
  });

  describe('logout', () => {
    it('should remove current user from storage', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);

      await authService.logout();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('google_flights_current_user');
    });

    it('should handle storage errors gracefully', async () => {
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      // Should not throw
      await expect(authService.logout()).resolves.toBeUndefined();
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user when exists', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockUser));

      const result = await authService.getCurrentUser();

      expect(result?.email).toBe(mockUser.email);
      expect(result?.name).toBe(mockUser.name);
      expect(result?.id).toBe(mockUser.id);
    });

    it('should return null when no current user', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await authService.getCurrentUser();

      expect(result).toBeNull();
    });

    it('should handle storage errors', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const result = await authService.getCurrentUser();

      expect(result).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when user is authenticated', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockUser));

      const result = await authService.isAuthenticated();

      expect(result).toBe(true);
    });

    it('should return false when user is not authenticated', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await authService.isAuthenticated();

      expect(result).toBe(false);
    });

    it('should handle storage errors', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const result = await authService.isAuthenticated();

      expect(result).toBe(false);
    });
  });
}); 