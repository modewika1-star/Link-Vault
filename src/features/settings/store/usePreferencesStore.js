import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const usePreferencesStore = create(
  persist(
    (set) => ({
      theme: 'light',
      viewMode: 'grid',
      language: 'en',
      setTheme: (theme) => set({ theme: theme === 'dark' ? 'dark' : 'light' }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      setViewMode: (viewMode) => set({ viewMode: viewMode === 'list' ? 'list' : 'grid' }),
      setLanguage: (language) => set({ language: language === 'ar' ? 'ar' : 'en' }),
      toggleLanguage: () => set((state) => ({ language: state.language === 'ar' ? 'en' : 'ar' })),
    }),
    {
      name: 'link-vault:preferences',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme, viewMode: state.viewMode, language: state.language }),
    },
  ),
)

export default usePreferencesStore
