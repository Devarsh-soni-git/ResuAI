import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface AuthContextType {
  user: SupabaseUser | null;
  isLoading: boolean;
  isSigningIn: boolean;
  isSigningUp: boolean;
  isSigningOut: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Auth session error:', error);
        toast.error('Failed to check session');
      } else {
        setUser(session?.user ?? null);
      }
      setIsLoading(false);
    }).catch(err => {
      console.error('Unexpected error:', err);
      setIsLoading(false);
    });

    // Single auth state subscription — Supabase handles token refresh automatically
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setIsSigningIn(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        const msg = error.message.includes('Invalid') ? 'Invalid email or password' :
                   error.message.includes('Email not confirmed') ? 'Please confirm your email first' :
                   error.message;
        throw new Error(msg);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Sign in failed');
      throw error;
    } finally {
      setIsSigningIn(false);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    setIsSigningUp(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        const msg = error.message.includes('already') ? 'Email already registered. Please log in.' :
                   error.message.includes('Password') ? 'Password too weak. Use at least 8 characters.' :
                   error.message.includes('rate limit') ? 'Too many attempts. Please wait a moment and try again.' :
                   error.message;
        throw new Error(msg);
      }
      toast.success('Account created! Please check your email to confirm.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Sign up failed');
      throw error;
    } finally {
      setIsSigningUp(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setIsSigningOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Sign out failed');
      throw error;
    } finally {
      setIsSigningOut(false);
    }
  }, []);

  const value = {
    user,
    isLoading,
    isSigningIn,
    isSigningUp,
    isSigningOut,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};