import { create } from "zustand";

export type AppLanguage = "zh-TW" | "en";

const UI_LANGUAGE_STORAGE_KEY = "approval-system-language";

interface UiState {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  toggleLanguage: () => void;
}

function loadLanguageFromStorage(): AppLanguage {
  try {
    const raw = localStorage.getItem(UI_LANGUAGE_STORAGE_KEY);

    if (raw === "zh-TW" || raw === "en") {
      return raw;
    }

    return "zh-TW";
  } catch {
    return "zh-TW";
  }
}

function saveLanguageToStorage(language: AppLanguage) {
  localStorage.setItem(UI_LANGUAGE_STORAGE_KEY, language);
}

export const useUiStore = create<UiState>((set, get) => ({
  language: loadLanguageFromStorage(),

  setLanguage: (language) => {
    saveLanguageToStorage(language);
    set({ language });
  },

  toggleLanguage: () => {
    const nextLanguage: AppLanguage =
      get().language === "zh-TW" ? "en" : "zh-TW";

    saveLanguageToStorage(nextLanguage);
    set({ language: nextLanguage });
  },
}));