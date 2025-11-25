'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface SessionContextType {
  user: User | null;
  accessToken: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load session from localStorage on mount
    const token = localStorage.getItem('accessToken');
    const userStr = localStorage.getItem('user');
    // const refreshToken = localStorage.getItem('refreshToken');

    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        // Validate that user ID is UUID format (not old MongoDB ObjectId)
        if (userData.id && userData.id.length === 36 && userData.id.includes('-')) {
          setAccessToken(token);
          setUser(userData);
        } else {
          // Clear old session with invalid ID format
          console.warn('Clearing old session with invalid user ID format');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          localStorage.removeItem('refreshToken');
        }
      } catch (e) {
        console.error('Failed to parse user from localStorage');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken');
      }
    }

    setIsLoading(false);

    // Listen for storage events to sync across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessToken') {
        if (e.newValue) {
          setAccessToken(e.newValue);
        } else {
          setAccessToken(null);
        }
      } else if (e.key === 'user') {
        if (e.newValue) {
          try {
            setUser(JSON.parse(e.newValue));
          } catch (err) {
            console.error('Failed to parse user from storage event');
          }
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = (token: string, userData: User) => {
    setAccessToken(token);
    setUser(userData);
    console.log(token, 'stored in localStorage');
    console.log(userData, 'user data stored in localStorage');
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <SessionContext.Provider
      value={{
        user,
        accessToken,
        login,
        logout,
        updateUser,
        isAuthenticated: !!accessToken && !!user,
        isLoading,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
