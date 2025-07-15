import { useMemo } from 'react';
import { isApiConfigured } from '../config/api';

interface UseApiStatusReturn {
  isConfigured: boolean;
  statusMessage: string;
  statusIcon: string;
}

export const useApiStatus = (): UseApiStatusReturn => {
  const isConfigured = useMemo(() => isApiConfigured(), []);

  const statusMessage = useMemo(() => {
    return isConfigured 
      ? 'Real API configured. Rate limit may apply on free tier.'
      : 'Using mock data. Add your RapidAPI key to use real flight data.';
  }, [isConfigured]);

  const statusIcon = useMemo(() => {
    return isConfigured ? '✅' : '⚠️';
  }, [isConfigured]);

  return {
    isConfigured,
    statusMessage,
    statusIcon,
  };
}; 