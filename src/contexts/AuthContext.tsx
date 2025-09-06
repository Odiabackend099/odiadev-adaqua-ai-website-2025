import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
  last_sign_in_at?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock authentication for now - in production, integrate with Supabase
    const mockUser: User = {
      id: '1',
      email: 'demo@odia.dev',
      full_name: 'Demo User',
      created_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
    };
    
    // Simulate loading
    setTimeout(() => {
      setUser(mockUser);
      setLoading(false);
    }, 1000);
  }, []);

  const signOut = async () => {
    setUser(null);
    // In production, call Supabase auth.signOut()
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
