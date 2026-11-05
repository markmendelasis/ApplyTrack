import React, { createContext, useEffect, useState, useMemo, useCallback } from 'react';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isConfigured = isSupabaseConfigured();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(() => isConfigured);

  useEffect(() => {
    let mounted = true;

    if (!isConfigured) {
      return;
    }

    // 1. Initial session retrieval
    supabase.auth
      .getSession()
      .then(({ data: { session }, error }) => {
        if (!mounted) return;
        if (error) {
          console.error('Failed to get Supabase session:', error);
        }
        setSession(session);
        setUser(session?.user ?? null);
      })
      .catch((err) => {
        console.error('Session initialization error:', err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    // 2. Listen to active auth state changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (!mounted) return;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [isConfigured]);

  const signUp = useCallback(async (email: string, password: string) => {
    if (!isConfigured) {
      return {
        error: {
          name: 'ConfigurationError',
          message: 'Supabase credentials are not configured in your .env file.',
        } as AuthError,
      };
    }
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });
    return { error };
  }, [isConfigured]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!isConfigured) {
      return {
        error: {
          name: 'ConfigurationError',
          message: 'Supabase credentials are not configured in your .env file.',
        } as AuthError,
      };
    }
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    return { error };
  }, [isConfigured]);

  const signOut = useCallback(async () => {
    if (isConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Error signing out:', err);
      }
    }
    setUser(null);
    setSession(null);
  }, [isConfigured]);

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      isConfigured,
      signUp,
      signIn,
      signOut,
    }),
    [user, session, loading, isConfigured, signUp, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
