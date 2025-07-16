import { renderHook, act } from '@testing-library/react-native';
import { useForm } from '../useForm';

interface TestForm {
  name: string;
  email: string;
  age: number;
}

describe('useForm', () => {
  const initialValues: TestForm = {
    name: '',
    email: '',
    age: 0,
  };

  it('should initialize with provided values', () => {
    const { result } = renderHook(() => useForm<TestForm>(initialValues));

    expect(result.current.values).toEqual(initialValues);
    expect(typeof result.current.setValue).toBe('function');
    expect(typeof result.current.setValues).toBe('function');
    expect(typeof result.current.reset).toBe('function');
    expect(typeof result.current.updateValue).toBe('function');
  });

  it('should update a single value', () => {
    const { result } = renderHook(() => useForm<TestForm>(initialValues));

    act(() => {
      result.current.setValue('name', 'John Doe');
    });

    expect(result.current.values.name).toBe('John Doe');
    expect(result.current.values.email).toBe('');
    expect(result.current.values.age).toBe(0);
  });

  it('should update multiple values', () => {
    const { result } = renderHook(() => useForm<TestForm>(initialValues));

    act(() => {
      result.current.setValues({
        name: 'Jane Doe',
        email: 'jane@example.com',
      });
    });

    expect(result.current.values.name).toBe('Jane Doe');
    expect(result.current.values.email).toBe('jane@example.com');
    expect(result.current.values.age).toBe(0);
  });

  it('should reset to initial values', () => {
    const { result } = renderHook(() => useForm<TestForm>(initialValues));

    // First, update some values
    act(() => {
      result.current.setValue('name', 'John Doe');
      result.current.setValue('email', 'john@example.com');
      result.current.setValue('age', 25);
    });

    expect(result.current.values.name).toBe('John Doe');
    expect(result.current.values.email).toBe('john@example.com');
    expect(result.current.values.age).toBe(25);

    // Then reset
    act(() => {
      result.current.reset();
    });

    expect(result.current.values).toEqual(initialValues);
  });

  it('should handle updateValue alias', () => {
    const { result } = renderHook(() => useForm<TestForm>(initialValues));

    act(() => {
      result.current.updateValue('name', 'John Doe');
    });

    expect(result.current.values.name).toBe('John Doe');
  });

  it('should preserve other values when updating single value', () => {
    const { result } = renderHook(() => useForm<TestForm>(initialValues));

    // Set initial values
    act(() => {
      result.current.setValues({
        name: 'John Doe',
        email: 'john@example.com',
        age: 25,
      });
    });

    // Update only name
    act(() => {
      result.current.setValue('name', 'Jane Doe');
    });

    expect(result.current.values.name).toBe('Jane Doe');
    expect(result.current.values.email).toBe('john@example.com');
    expect(result.current.values.age).toBe(25);
  });

  it('should handle different data types', () => {
    const { result } = renderHook(() => useForm<TestForm>(initialValues));

    act(() => {
      result.current.setValue('name', 'John Doe');
      result.current.setValue('email', 'john@example.com');
      result.current.setValue('age', 30);
    });

    expect(typeof result.current.values.name).toBe('string');
    expect(typeof result.current.values.email).toBe('string');
    expect(typeof result.current.values.age).toBe('number');
  });
}); 