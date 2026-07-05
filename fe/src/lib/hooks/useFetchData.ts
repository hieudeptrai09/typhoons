import { useCallback, useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

interface ApiResponse<T> {
  data: T;
  count: number;
}

interface UseFetchDataResult<T> {
  data: T | null;
  count: number;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

const fetchData = async <T>(endpoint: string): Promise<ApiResponse<T> | null> => {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`);
    return await response.json();
  } catch {
    return null;
  }
};

export const useFetchData = <T>(endpoint: string): UseFetchDataResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDataAsync = useCallback(async () => {
    if (!endpoint) {
      setData(null);
      setCount(0);
      setLoading(false);
      setError(null);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const result = await fetchData<T>(endpoint);
      if (result) {
        setData(result.data);
        setCount(result.count ?? 0);
      } else {
        setError(new Error("Failed to fetch data"));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchDataAsync();
  }, [endpoint, fetchDataAsync]);

  return { data, count, loading, error, refetch: fetchDataAsync };
};

export default fetchData;
