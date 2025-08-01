import { useState, useEffect, useCallback } from 'react';

interface useFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  fetchData: (customOptions?: RequestInit, customUrl?: string) => Promise<void>;
}

export function useFetch<T>(initialUrl: string, initialOptions?: RequestInit): useFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (customOptions?: RequestInit, customUrl?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(customUrl || initialUrl, customOptions || initialOptions);
      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [initialUrl, initialOptions]);

  // GET automático se `initialOptions?.method` for GET ou indefinido
  useEffect(() => {
    const isGet = !initialOptions?.method || initialOptions.method === 'GET';
    if (isGet) {
      fetchData();
    }
  }, [fetchData]);

  return { data, loading, error, fetchData };
}
