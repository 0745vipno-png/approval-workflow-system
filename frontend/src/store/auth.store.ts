import { create } from "zustand";
import type { User } from "../types/user";
import { ROLES } from "../constants/roles";

const AUTH_STORAGE_KEY = "approval-system-auth";

interface AuthState {
  currentUser: User | null;
  login: (user: User) => void;
  loginAsRequester: () => void;
  loginAsManager: () => void;
  logout: () => void;
}

function saveAuthToStorage(user: User | null) {
  if (user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

function loadAuthFromStorage(): User | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as User;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: loadAuthFromStorage(),

  login: (user) => {
    saveAuthToStorage(user);
    set({
      currentUser: user,
    });
  },

  loginAsRequester: () => {
    const user: User = {
      id: 1,
      name: "王小明",
      email: "requester@example.com",
      roles: [ROLES.REQUESTER],
    };

    saveAuthToStorage(user);

    set({
      currentUser: user,
    });
  },

  loginAsManager: () => {
    const user: User = {
      id: 2,
      name: "陳主任",
      email: "manager@example.com",
      roles: [ROLES.MANAGER],
    };

    saveAuthToStorage(user);

    set({
      currentUser: user,
    });
  },

  logout: () => {
    saveAuthToStorage(null);
    set({
      currentUser: null,
    });
  },
}));