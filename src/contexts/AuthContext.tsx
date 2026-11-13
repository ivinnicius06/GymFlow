import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, AuthResponse } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';

interface AuthContextData {
  session: Session | null;
  isGuest: boolean;
  initialLoading: boolean;
  loginAsGuest: () => void;
  signOut: () => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string) => Promise<AuthResponse>;
  setIsGuest: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loginAsGuest = () => {
    setIsGuest(true);
  };

  const signInWithPassword = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  };

  const signUp = async (email: string, password: string) => {
    return await supabase.auth.signUp({
      email,
      password,
    });
  };

  const signOut = async () => {
    if (session) {
      await supabase.auth.signOut();
    }
    setIsGuest(false);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        isGuest,
        initialLoading,
        loginAsGuest,
        signOut,
        signInWithPassword,
        signUp,
        setIsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
