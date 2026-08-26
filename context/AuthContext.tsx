import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from 'firebase/auth';
import { auth } from '../firebase';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  email: string | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ ok: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setEmail(user?.email ?? null);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { ok: true };
    } catch (err: any) {
      const code: string = err?.code || 'auth/unknown';
      if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') {
        return { ok: false, error: 'Invalid email or password.' };
      }
      if (code === 'auth/too-many-requests') {
        return { ok: false, error: 'Too many failed attempts. Try again later.' };
      }
      return { ok: false, error: err?.message || 'Unable to sign in.' };
    }
  }, []);

  const logout = useCallback(() => {
    signOut(auth).catch(() => {});
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    const user = auth.currentUser;
    if (!user || !user.email) {
      return { ok: false, error: 'You must be signed in.' };
    }
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      return { ok: true };
    } catch (err: any) {
      const code: string = err?.code || 'auth/unknown';
      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        return { ok: false, error: 'Current password is incorrect.' };
      }
      if (code === 'auth/weak-password') {
        return { ok: false, error: 'New password is too weak (min 6 characters).' };
      }
      return { ok: false, error: err?.message || 'Unable to update password.' };
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, email, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};