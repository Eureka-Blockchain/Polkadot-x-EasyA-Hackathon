"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, userAPI, LoginData, SignupData, UserData, CompanyData } from '../services/api';

type AuthUserType = 'company' | 'user';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserData | CompanyData | null;
  userType: AuthUserType | null;
  token: string | null;
  login: (data: LoginData, type: AuthUserType) => Promise<void>;
  signup: (data: SignupData, type: AuthUserType) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Helper function to safely access localStorage
const getLocalStorageItem = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

// Helper function to safely set localStorage
const setLocalStorageItem = (key: string, value: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
};

// Helper function to safely remove localStorage item
const removeLocalStorageItem = (key: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserData | CompanyData | null>(null);
  const [userType, setUserType] = useState<AuthUserType | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const router = useRouter();

  // Check for existing auth on mount
  useEffect(() => {
    const savedToken = getLocalStorageItem('auth_token');
    const savedUserType = getLocalStorageItem('user_type') as AuthUserType | null;
    const savedUser = getLocalStorageItem('user');

    if (savedToken && savedUserType && savedUser) {
      setToken(savedToken);
      setUserType(savedUserType);
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }

    setIsLoading(false);
  }, []);

  const login = async (data: LoginData, type: AuthUserType) => {
    setIsLoading(true);
    try {
      let response;
      
      if (type === 'company') {
        response = await authAPI.loginCompany(data);
      } else {
        response = await authAPI.loginUser(data);
      }

      // In a real app, the token would come from the backend
      // For now, we'll simulate it
      const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
      
      // Save auth data
      setLocalStorageItem('auth_token', mockToken);
      setLocalStorageItem('user_type', type);
      setLocalStorageItem('user', JSON.stringify(response));
      
      // Update state
      setToken(mockToken);
      setUser(response);
      setUserType(type);
      setIsAuthenticated(true);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Check if this is a development environment with a network error
      if (process.env.NODE_ENV === 'development' && error.isNetworkError) {
        console.warn('Network error during login - trying to use mock data fallback');
        try {
          // For dummy accounts in development, we can still authenticate them
          if (data.email === 'dummy@eureka.com' && data.password === 'Monday100') {
            const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
            
            let mockUser;
            if (type === 'company') {
              mockUser = {
                id: "company-dummy",
                name: "Demo Company",
                email: data.email,
                registeredAddress: "123 Demo Street, Demo City",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              };
            } else {
              mockUser = {
                id: "user-dummy",
                fullName: "Dummy User",
                email: data.email,
                companyId: "00000000-0000-0000-0000-000000000000"
              };
            }
            
            // Save auth data
            setLocalStorageItem('auth_token', mockToken);
            setLocalStorageItem('user_type', type);
            setLocalStorageItem('user', JSON.stringify(mockUser));
            
            // Update state
            setToken(mockToken);
            setUser(mockUser);
            setUserType(type);
            setIsAuthenticated(true);
            
            // Redirect to dashboard
            router.push('/dashboard');
            return;
          }
        } catch (fallbackError) {
          console.error('Fallback login also failed:', fallbackError);
        }
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupData, type: AuthUserType) => {
    setIsLoading(true);
    try {
      if (type === 'company') {
        const companyData = {
          name: data.companyName || data.name,
          email: data.email,
          password: data.password,
          registeredAddress: data.registeredAddress
        };
        
        const response = await authAPI.registerCompany(companyData);
        
        // After successful registration, login the user
        await login({ email: data.email, password: data.password }, 'company');
      } else {
        // For user signup, we'll use a default companyId if not provided
        const userData = {
          fullName: data.name,
          email: data.email,
          password: data.password,
          // Using a default company ID for now
          companyId: "00000000-0000-0000-0000-000000000000"
        };
        
        try {
          const response = await authAPI.registerUser(userData);
          // After successful registration, login the user
          await login({ email: data.email, password: data.password }, 'user');
        } catch (err: any) {
          // Check if this is a development environment with a network error
          if (process.env.NODE_ENV === 'development' && err.isNetworkError) {
            console.warn('Network error during user registration - using direct fallback auth');
            
            // Create a mock user response
            const mockUserResponse = {
              id: "user-" + Math.random().toString(36).substring(2, 9),
              fullName: data.name,
              email: data.email,
              companyId: "00000000-0000-0000-0000-000000000000"
            };
            
            // Mock token
            const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
            
            // Save auth data
            setLocalStorageItem('auth_token', mockToken);
            setLocalStorageItem('user_type', 'user');
            setLocalStorageItem('user', JSON.stringify(mockUserResponse));
            
            // Update state
            setToken(mockToken);
            setUser(mockUserResponse);
            setUserType('user');
            setIsAuthenticated(true);
            
            // Redirect to dashboard
            router.push('/dashboard');
          } else {
            // Rethrow non-network errors or in production
            throw err;
          }
        }
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      
      // Check if this is a development environment with a network error
      if (process.env.NODE_ENV === 'development' && error.isNetworkError) {
        console.warn('Network error during company registration - using direct fallback auth');
        
        if (type === 'company') {
          // Create a mock company response
          const mockCompanyResponse = {
            id: "company-" + Math.random().toString(36).substring(2, 9),
            name: data.companyName || data.name,
            email: data.email,
            registeredAddress: data.registeredAddress,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          // Mock token
          const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
          
          // Save auth data
          setLocalStorageItem('auth_token', mockToken);
          setLocalStorageItem('user_type', 'company');
          setLocalStorageItem('user', JSON.stringify(mockCompanyResponse));
          
          // Update state
          setToken(mockToken);
          setUser(mockCompanyResponse);
          setUserType('company');
          setIsAuthenticated(true);
          
          // Redirect to dashboard
          router.push('/dashboard');
          return;
        }
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear local storage
    removeLocalStorageItem('auth_token');
    removeLocalStorageItem('user_type');
    removeLocalStorageItem('user');
    
    // Reset state
    setToken(null);
    setUser(null);
    setUserType(null);
    setIsAuthenticated(false);
    
    // Redirect to login
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        userType,
        token,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 