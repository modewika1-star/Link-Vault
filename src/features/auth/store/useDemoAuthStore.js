import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const getDisplayName = (email) => {
  const localPart = String(email || '').split('@')[0] || 'Member'
  return localPart
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

const useDemoAuthStore = create(
  persist(
    (set) => ({
      user: null,
      signIn: (email) => set({
        user: {
          email: email.trim().toLowerCase(),
          fullName: getDisplayName(email),
          accountType: 'demo',
        },
      }),
      register: ({ fullName, email }) => set({
        user: {
          email: email.trim().toLowerCase(),
          fullName: fullName.trim(),
          accountType: 'demo',
        },
      }),
      signOut: () => set({ user: null }),
    }),
    {
      name: 'link-vault:demo-session',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    },
  ),
)

export default useDemoAuthStore
