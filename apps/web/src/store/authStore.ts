import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/api";
import type { UserDto } from "@cammani/shared";

interface AuthState {
  user: UserDto | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: "buyer" | "seller") => Promise<void>;
  logout: () => void;
  setUser: (user: UserDto) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post("/auth/login", { email, password });
          const { accessToken, refreshToken, user } = data.data;
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          set({ user, accessToken, refreshToken, isLoading: false });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      register: async (name, email, password, role = "buyer") => {
        set({ isLoading: true });
        try {
          const { data } = await api.post("/auth/register", { name, email, password, role });
          const { accessToken, refreshToken, user } = data.data;
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          set({ user, accessToken, refreshToken, isLoading: false });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      logout: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        set({ user: null, accessToken: null, refreshToken: null });
      },

      setUser: (user) => set({ user }),
    }),
    { name: "cammani-auth", partialize: (s) => ({ user: s.user }) }
  )
);
