import { useState, useCallback } from 'react';

/**
 * Custom hook for managing table/card view toggle with localStorage persistence.
 * @param {string} pageKey - Unique key for the page (e.g., 'admin-residents')
 * @param {string} defaultView - Default view: 'table' or 'card'
 */
export const useViewToggle = (pageKey, defaultView = 'table') => {
  const storageKey = `view-toggle-${pageKey}`;
  
  const [view, setView] = useState(() => {
    try {
      return localStorage.getItem(storageKey) || defaultView;
    } catch {
      return defaultView;
    }
  });

  const changeView = useCallback((newView) => {
    setView(newView);
    try {
      localStorage.setItem(storageKey, newView);
    } catch {
      // Silently fail if localStorage is unavailable
    }
  }, [storageKey]);

  return [view, changeView];
};

export default useViewToggle;
