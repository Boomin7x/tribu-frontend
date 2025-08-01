import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export function useUrlState(key: string, defaultValue: boolean = false) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Memoize the value computation to avoid recalculation on every render
  const value = useMemo(() => {
    const paramValue = searchParams.get(key);
    return paramValue === "true" || defaultValue;
  }, [searchParams, key, defaultValue]);

  // Memoize the setValue function to prevent unnecessary re-renders
  const setValue = useCallback(
    (newValue: boolean) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      if (newValue === true) {
        newSearchParams.set(key, "true");
      } else {
        newSearchParams.delete(key);
      }

      const newUrl = `?${newSearchParams.toString()}`;
      router.replace(newUrl, { scroll: false });
    },
    [searchParams, key, router]
  );

  return [value, setValue] as const;
}
