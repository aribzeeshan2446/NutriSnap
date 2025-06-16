
'use client';

import { useCallback } from 'react';
// Removed: import useLocalStorage from './use-local-storage';
// Removed: import { useRouter } from 'next/navigation';

// Removed: const AUTH_KEY = 'nutrisnap_is_authenticated';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void; // Kept as no-op for now, can be removed if nothing calls it
  logout: () => void; // Kept as no-op for now, can be removed if nothing calls it
}

export function useAuth(): AuthState {
  // No longer uses localStorage or router for auth purposes
  const isAuthenticated = true;
  const isLoading = false;

  const login = useCallback(() => {
    // No-op: Authentication is removed, so login does nothing.
    console.log("Login function called, but authentication is removed.");
  }, []);

  const logout = useCallback(() => {
    // No-op: Authentication is removed, so logout does nothing.
    console.log("Logout function called, but authentication is removed.");
    // In a real scenario with a backend, this might clear session cookies or tokens.
    // For this purely client-side prototype with auth removed, it's a no-op.
    // If there were local user data to clear that ISN'T settings/log (which are generic now),
    // it could be done here, but settings/log are persisted per-browser.
  }, []);

  return { isAuthenticated, isLoading, login, logout };
}

