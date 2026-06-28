const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export interface ApiResponse<T> {
  data: T;
  count: number;
}

export async function fetchServerData<T>(endpoint: string): Promise<ApiResponse<T> | null> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`);
    return await response.json();
  } catch {
    return null;
  }
}
