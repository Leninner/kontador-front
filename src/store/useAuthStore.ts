/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { IUser, IRegisterDto, IAuthResponse, IVerifyPhoneDto } from '@/modules/auth/auth.interface'
import { authService } from '@/modules/auth/auth.service'
import { toast } from 'sonner'

interface AuthState {
  user: IUser | null
  token: string | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<IAuthResponse | undefined>
  register: (credentials: IRegisterDto) => Promise<void>
  logout: () => Promise<void>
  setError: (error: string | null) => void
  setLoading: (isLoading: boolean) => void
  getUser: () => Promise<void>
  updateUser: (user: Omit<IUser, 'phone'>) => Promise<void>
  verifyPhone: (data: IVerifyPhoneDto) => Promise<void>
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

      login: async (email, password) => {
        try {
          set({ isLoading: true, error: null })

          if (!email || !password) {
            toast.error('Email y contraseña son requeridos')
            return
          }

          const response = await authService.login({ email, password })

          if (response.success && response.data) {
            set({
              user: response.data.user,
              token: response.data.token,
              isAuthenticated: true,
            })
            toast.success('Inicio de sesión exitoso')
            return response
          }
        } catch (err: any) {
          const errorMessage = err.response.data.error.message || err.response.data.message

          if (errorMessage instanceof Array) {
            errorMessage.forEach((message) => {
              toast.error(message)
            })
          } else {
            toast.error(errorMessage)
          }
        } finally {
          set({ isLoading: false })
        }
      },

      register: async (credentials) => {
        try {
          set({ isLoading: true, error: null })
          const response = await authService.register(credentials)
          if (response.success && response.data) {
            set({
              user: response.data.user,
              token: response.data.token,
              isAuthenticated: true,
            })

            await authService.login({ email: credentials.email, password: credentials.password })
            toast.success('Registro exitoso')
          }
        } catch (err: any) {
          const errorMessage = err.response.data.error.message || err.response.data.message

          if (errorMessage instanceof Array) {
            errorMessage.forEach((message) => {
              toast.error(message)
            })
          } else {
            toast.error(errorMessage)
          }
        } finally {
          set({ isLoading: false })
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true, error: null })
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          })
        } catch (err) {
          console.log(err)
          toast.error('Ocurrió un error al cerrar sesión')
        } finally {
          set({ isLoading: false })
        }
      },

      updateUser: async (user: Omit<IUser, 'phone'>) => {
        try {
          set({ isLoading: true, error: null })
          const response = await authService.updateUser(user)
          if (response.success && response.data) {
            const responseFromGetUser = await authService.getUser()
            if (responseFromGetUser.success && responseFromGetUser.data && responseFromGetUser.data.user) {
              set({ user: responseFromGetUser.data.user })
              toast.success('Usuario actualizado exitosamente')
            }
          }
        } catch (err) {
          console.log(err)
          toast.error('Ocurrió un error al actualizar el usuario')
        } finally {
          set({ isLoading: false })
        }
      },

      getUser: async () => {
        const response = await authService.getUser()
        if (response.success && response.data) {
          console.log('response.data.user', response.data.user)
          set({ user: response.data.user })
        }
      },

      verifyPhone: async (data) => {
        try {
          set({ isLoading: true, error: null })
          const response = await authService.verifyPhone(data)
          if (response.success && response.data) {
            const responseFromGetUser = await authService.getUser()
            if (responseFromGetUser.success && responseFromGetUser.data) {
              set({ user: responseFromGetUser.data.user })
            }
            toast.success('Número de teléfono verificado exitosamente')
          }
        } catch (err: any) {
          const errorMessage = err.response?.data?.error?.message || 'Error al verificar el número de teléfono'
          toast.error(errorMessage)
        } finally {
          set({ isLoading: false })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
