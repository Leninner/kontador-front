import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IUser, ILoginDto, IRegisterDto } from '@/common/interfaces/auth.interface';
import { authService } from '@/services/auth/auth.service';

interface AuthState {
  user: IUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: ILoginDto) => Promise<void>;
  register: (credentials: IRegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      setError: (error) => set({ error }),
      setLoading: (isLoading) => set({ isLoading }),
      
      login: async (credentials) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authService.login(credentials);
          if (response.success && response.data) {
            set({
              user: response.data.user,
              token: response.data.token,
              isAuthenticated: true,
            });
          }
        } catch (err) {
          set({ error: 'Failed to login' });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (credentials) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authService.register(credentials);
          if (response.success && response.data) {
            set({
              user: response.data.user,
              token: response.data.token,
              isAuthenticated: true,
            });
          }
        } catch (err) {
          set({ error: 'Failed to register' });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true, error: null });
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        } catch (err) {
          set({ error: 'Failed to logout' });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
); 