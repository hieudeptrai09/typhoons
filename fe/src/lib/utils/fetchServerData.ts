const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export interface ApiResponse<T> {
  data: T;
  count: number;
}

export async function fetchServerData<T>(
  endpoint: string,
  revalidate?: number,
): Promise<ApiResponse<T> | null> {
  try {
    console.log("api", `${API_BASE}${endpoint}`);
    const response = await fetch(`${API_BASE}${endpoint}`, {
      next: { revalidate: revalidate ?? 3600 },
    });
    return await response.json();
  } catch {
    return null;
  }
}
