import { useState, useEffect, useCallback } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

interface ApiResponse<T> {
  data: T;
  count: number;
}

interface UseFetchDataResult<T> {
  data: T | null;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDataAsync = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchData<T>(endpoint);
      if (result) {
        setData(result.data);
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

  return { data, loading, error, refetch: fetchDataAsync };
};

export default fetchData;
