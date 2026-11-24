import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const usePreferencesStore = create(
  persist(
    (set) => ({
      theme: 'light',
      viewMode: 'grid',
      setTheme: (theme) => set({ theme: theme === 'dark' ? 'dark' : 'light' }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      setViewMode: (viewMode) => set({ viewMode: viewMode === 'list' ? 'list' : 'grid' }),
    }),
    {
      name: 'link-vault:preferences',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme, viewMode: state.viewMode }),
    },
  ),
)

export default usePreferencesStore
