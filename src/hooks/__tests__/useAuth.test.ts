import { renderHook, act } from '@testing-library/react-native';
import { useAuth } from '../useAuth';
import { authService } from '../../services/authService';

// Mock the authService
jest.mock('../../services/authService', () => ({
  authService: {
    getCurrentUser: jest.fn(),
    logout: jest.fn(),
  },
}));

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    (authService.getCurrentUser as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBe(null);
    expect(result.current.isLoading).toBe(true);
    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.register).toBe('function');
    expect(typeof result.current.logout).toBe('function');
    expect(typeof result.current.checkAuthStatus).toBe('function');
  });

  it('should load existing user on mount', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      createdAt: new Date(),
    };

    (authService.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth());

    // Wait for the effect to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle authentication check error', async () => {
    (authService.getCurrentUser as jest.Mock).mockRejectedValue(new Error('Auth error'));

    const { result } = renderHook(() => useAuth());

    // Wait for the effect to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.user).toBe(null);
    expect(result.current.isLoading).toBe(false);
  });

  it('should login user', () => {
    const { result } = renderHook(() => useAuth());
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      createdAt: new Date(),
    };

    act(() => {
      result.current.login(mockUser);
    });

    expect(result.current.user).toEqual(mockUser);
  });

  it('should register user', () => {
    const { result } = renderHook(() => useAuth());
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      createdAt: new Date(),
    };

    act(() => {
      result.current.register(mockUser);
    });

    expect(result.current.user).toEqual(mockUser);
  });

  it('should logout user', async () => {
    const { result } = renderHook(() => useAuth());
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      createdAt: new Date(),
    };

    // First set a user
    act(() => {
      result.current.login(mockUser);
    });

    expect(result.current.user).toEqual(mockUser);

    // Then logout
    await act(async () => {
      await result.current.logout();
    });

    expect(authService.logout).toHaveBeenCalled();
    expect(result.current.user).toBe(null);
  });

  it('should check auth status', async () => {
    const { result } = renderHook(() => useAuth());
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      createdAt: new Date(),
    };

    (authService.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

    await act(async () => {
      await result.current.checkAuthStatus();
    });

    expect(authService.getCurrentUser).toHaveBeenCalled();
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isLoading).toBe(false);
  });
}); 