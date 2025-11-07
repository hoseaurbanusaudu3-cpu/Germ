import { useState, useCallback } from 'react';
import { handleApiError } from '../services/api';
import { toast } from 'sonner';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    onSuccess,
    onError,
    showSuccessToast = true,
    showErrorToast = true,
    successMessage,
  } = options;

  const execute = useCallback(
    async (...args: any[]) => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiFunction(...args);
        setData(result);

        if (showSuccessToast && successMessage) {
          toast.success(successMessage);
        }

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (err: any) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);

        if (showErrorToast) {
          toast.error(errorMessage);
        }

        if (onError) {
          onError(errorMessage);
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, onSuccess, onError, showSuccessToast, showErrorToast, successMessage]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

// Hook for fetching data on mount
export function useFetch<T = any>(
  apiFunction: () => Promise<T>,
  options: UseApiOptions & { enabled?: boolean } = {}
) {
  const { enabled = true, ...apiOptions } = options;
  const { data, loading, error, execute } = useApi<T>(apiFunction, apiOptions);

  useState(() => {
    if (enabled) {
      execute();
    }
  });

  return {
    data,
    loading,
    error,
    refetch: execute,
  };
}
