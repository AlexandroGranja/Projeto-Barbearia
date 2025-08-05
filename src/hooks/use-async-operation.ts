import { useState, useCallback } from 'react';
import { classifySupabaseError, withRetry, logError, AppError } from '@/lib/error-handling';

interface AsyncOperationState {
  isLoading: boolean;
  error: AppError | null;
  data: any;
}

interface UseAsyncOperationOptions {
  enableRetry?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: AppError) => void;
}

export const useAsyncOperation = (options: UseAsyncOperationOptions = {}) => {
  const [state, setState] = useState<AsyncOperationState>({
    isLoading: false,
    error: null,
    data: null
  });

  const execute = useCallback(async (operation: () => Promise<any>) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = options.enableRetry 
        ? await withRetry(operation)
        : await operation();

      setState({
        isLoading: false,
        error: null,
        data: result
      });

      options.onSuccess?.(result);
      return result;
    } catch (error) {
      const appError = classifySupabaseError(error);
      logError(appError, 'AsyncOperation');

      setState({
        isLoading: false,
        error: appError,
        data: null
      });

      options.onError?.(appError);
      throw appError;
    }
  }, [options]);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      data: null
    });
  }, []);

  return {
    ...state,
    execute,
    reset
  };
};