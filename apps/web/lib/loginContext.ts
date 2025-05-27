import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import * as jose from 'jose'
import { z } from 'zod'

interface authI {
  token: string,
  isAuthenticated: boolean
  sessionExpirationDate: number
  userName: string
  userId: string
  isLoading: boolean
  login: (token: string) => void
  logout: () => void
  checkExpiration: () => void
}

const jwtSchema = z.object({
  sub: z.string(),
  exp: z.number(),
  username: z.string(),
})

const useAuth = create<authI>()(
  persist((set, get) => ({
    token: "",
    isAuthenticated: false,
    sessionExpirationDate: NaN,
    userName: "",
    userId: "",
    isLoading: true,

    login: (token: string) => set((state) => {
      const claims = jwtSchema.safeParse(jose.decodeJwt(token))

      if (!claims.success) {
        return state
      }

      return {
        token: token,
        isAuthenticated: true,
        sessionExpirationDate: claims.data.exp,
        userName: claims.data.username,
        userId: claims.data.sub,
      }
    }),

    logout: () => set({
      token: "",
      isAuthenticated: false,
      sessionExpirationDate: NaN,
      userName: "",
      userId: "",
    }),

    checkExpiration: () => {
      if (Date.now() > get().sessionExpirationDate * 1000) {
        get().logout()
      }
    }
  }),
    {
      name: "auth",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false
        }
      }
    }))

export default useAuth
