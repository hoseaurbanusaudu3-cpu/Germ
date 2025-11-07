import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';
import socketService from '../services/socket';
import { toast } from 'sonner';

interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'teacher' | 'accountant' | 'parent';
  linkedId: number;
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (roles: string | string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      const currentUser = authAPI.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        // Connect socket
        socketService.connect();
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string, role: string) => {
    try {
      const response = await authAPI.login({ username, password, role });
      setUser(response.user);
      
      // Connect socket after successful login
      socketService.connect(response.token);
      
      toast.success('Login successful!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    socketService.disconnect();
    toast.info('Logged out successfully');
  };

  const hasRole = (roles: string | string[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
