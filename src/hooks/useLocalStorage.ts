import { useState } from 'react';

export function useLocalStorage(key: string, initialValue: boolean) {
  const [value, setValue] = useState<boolean>(() => {
    const stored = window.localStorage.getItem(key);
    return stored === null ? initialValue : stored === 'true';
  });

  const update = (next: boolean) => {
    setValue(next);
    window.localStorage.setItem(key, String(next));
  };

  return [value, update] as const;
}
