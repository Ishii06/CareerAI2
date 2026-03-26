import { create } from "zustand";
import axios from "axios";

interface User {
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoggedIn: false,

  setUser: (user) => set({ user, isLoggedIn: !!user }),

  login: (user) => set({ user, isLoggedIn: true }),

  logout: async () => {
    try {
      await axios.post("https://careerai-laww.onrender.com/api/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      set({ user: null, isLoggedIn: false });
    }
  },

  fetchUser: async () => {
    try {
      const res = await axios.get("https://careerai-laww.onrender.com/api/auth/profile", { withCredentials: true });
      if (res.data.user) {
        set({ user: res.data.user, isLoggedIn: true });
      } else {
        set({ user: null, isLoggedIn: false });
      }
    } catch {
      set({ user: null, isLoggedIn: false });
    }
  },
}));
