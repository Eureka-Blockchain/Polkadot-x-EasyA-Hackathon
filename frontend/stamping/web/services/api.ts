// API service for handling all requests to the backend
import fetchWrapper from './fetchWrapper';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  companyName?: string;
  registeredAddress?: string;
}

export interface CompanyData {
  id: string;
  name: string;
  email: string;
  registeredAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserData {
  id: string;
  fullName: string;
  email: string;
  companyId: string;
}

// Generate mock data functions
const generateMockCompanyData = (data: any, isDummy = false): CompanyData => {
  const now = new Date().toISOString();
  if (isDummy) {
    return {
      id: "company-dummy",
      name: "Demo Company",
      email: data.email,
      registeredAddress: "123 Demo Street, Demoville",
      createdAt: now,
      updatedAt: now
    };
  }
  
  return {
    id: "company-" + Math.random().toString(36).substring(2, 9),
    name: data.name || data.email.split('@')[0] + " Corp",
    email: data.email,
    registeredAddress: data.registeredAddress,
    createdAt: now,
    updatedAt: now
  };
};

const generateMockUserData = (data: any, isDummy = false): UserData => {
  if (isDummy) {
    return {
      id: "user-dummy",
      fullName: "Dummy User",
      email: data.email,
      companyId: "00000000-0000-0000-0000-000000000000"
    };
  }
  
  return {
    id: "user-" + Math.random().toString(36).substring(2, 9),
    fullName: data.fullName || data.email.split('@')[0],
    email: data.email,
    companyId: data.companyId || "00000000-0000-0000-0000-000000000000"
  };
};

// Authentication API functions
export const authAPI = {
  // Register company
  async registerCompany(data: { name: string, email: string, password: string, registeredAddress?: string }) {
    // Create mock data for development fallback
    const mockData = generateMockCompanyData(data);
    
    return fetchWrapper.post<CompanyData>('/register/company', data, { mockData });
  },

  // Login company
  async loginCompany(data: LoginData) {
    // Check if this is the dummy account
    const isDummy = data.email === 'dummy@eureka.com' && data.password === 'Monday100';
    // Create mock data for development fallback
    const mockData = generateMockCompanyData(data, isDummy);
    
    return fetchWrapper.post<CompanyData>('/login/company', null, {
      params: {
        email: data.email,
        password: data.password
      },
      mockData
    });
  },

  // Register user
  async registerUser(data: { fullName: string, email: string, companyId: string, password: string }) {
    // Create mock data for development fallback
    const mockData = generateMockUserData(data);
    
    return fetchWrapper.post<UserData>('/register/user', data, { mockData });
  },

  // Login user
  async loginUser(data: LoginData) {
    // Check if this is the dummy account
    const isDummy = data.email === 'dummy@eureka.com' && data.password === 'Monday100';
    // Create mock data for development fallback
    const mockData = generateMockUserData(data, isDummy);
    
    return fetchWrapper.post<UserData>('/login/user', data, { mockData });
  },
};

// User/profile API functions
export const userAPI = {
  // Get user profile
  async getProfile(token: string) {
    // Mock profile data
    const mockData = {
      user: {
        id: "user-123",
        name: "Current User",
        email: "user@example.com"
      },
      message: "You are authenticated!"
    };
    
    return fetchWrapper.get('/protected', { token, mockData });
  },
}; 