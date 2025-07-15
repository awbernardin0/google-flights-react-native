import { useState, useCallback } from 'react';

interface UseFormReturn<T> {
  values: T;
  setValue: (key: keyof T, value: any) => void;
  setValues: (values: Partial<T>) => void;
  reset: () => void;
  updateValue: (key: keyof T, value: any) => void;
}

export const useForm = <T extends Record<string, any>>(
  initialValues: T
): UseFormReturn<T> => {
  const [values, setValues] = useState<T>(initialValues);

  const setValue = useCallback((key: keyof T, value: any) => {
    setValues(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const updateValues = useCallback((newValues: Partial<T>) => {
    setValues(prev => ({
      ...prev,
      ...newValues,
    }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
  }, [initialValues]);

  return {
    values,
    setValue,
    setValues: updateValues,
    reset,
    updateValue: setValue,
  };
}; 