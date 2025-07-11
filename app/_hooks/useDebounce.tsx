import { useState, useEffect } from "react";

export const useDebounce = <T,>(
  value: T,
  delay: number
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return [debouncedValue, setDebouncedValue];
};

export default useDebounce;
