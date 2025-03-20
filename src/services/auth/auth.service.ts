interface LoginCredentials {
  email: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Mock delay to simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock validation
    if (credentials.email === 'test@example.com' && credentials.password === 'password') {
      return {
        success: true,
        token: 'mock-jwt-token',
        user: {
          id: '1',
          email: credentials.email,
          name: 'Test User'
        }
      };
    }

    return {
      success: false,
      error: 'Invalid credentials'
    };
  },

  logout: async (): Promise<void> => {
    // Mock delay to simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}; 