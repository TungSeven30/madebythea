'use client';

/**
 * Hook to handle Zustand hydration with localStorage
 * Prevents hydration mismatch between server and client
 */

import { useEffect, useState } from 'react';

export function useHydration() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}
