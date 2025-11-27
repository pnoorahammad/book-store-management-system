import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, role?: 'customer' | 'admin') => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database (in a real app, this would be backend)
const mockUsers: Array<User & { password: string }> = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@bookstore.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'customer123',
    role: 'customer',
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      return { success: true };
    }

    return { success: false, error: 'Invalid email or password' };
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: 'customer' | 'admin' = 'customer'
  ): Promise<{ success: boolean; error?: string }> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if user already exists
    if (mockUsers.find(u => u.email === email)) {
      return { success: false, error: 'Email already registered' };
    }

    // Create new user
    const newUser: User & { password: string } = {
      id: String(mockUsers.length + 1),
      name,
      email,
      password,
      role,
    };

    mockUsers.push(newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
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
