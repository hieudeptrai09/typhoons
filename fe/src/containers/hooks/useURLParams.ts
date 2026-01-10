import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const useURLParams = <T>() => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const params = useMemo(() => {
    const result = {} as T;
    searchParams.forEach((value, key) => {
      result[key as keyof T] = value as T[keyof T];
    });
    return result;
  }, [searchParams]);

  const updateParams = (newParams: Partial<T>, clearUnmentioned = false) => {
    const urlParams = new URLSearchParams();

    if (clearUnmentioned) {
      // Only add new params
      Object.entries(newParams).forEach(([key, value]) => {
        if (value) urlParams.set(key, String(value));
      });
    } else {
      // Merge with existing params
      searchParams.forEach((value, key) => {
        urlParams.set(key, value);
      });
      Object.entries(newParams).forEach(([key, value]) => {
        if (value) {
          urlParams.set(key, String(value));
        } else {
          urlParams.delete(key);
        }
      });
    }

    const queryString = urlParams.toString();
    const currentPath = window.location.pathname;
    const newURL = queryString ? `${currentPath}?${queryString}` : currentPath;
    router.push(newURL);
  };

  return { params, updateParams };
};
