import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const useLinksStore = create(
  persist(
    (set) => ({
      links: [],

      addLink: (link) =>
        set((state) => ({
          links: [link, ...state.links],
        })),

      removeLink: (id) =>
        set((state) => ({
          links: state.links.filter((link) => link.id !== id),
        })),
    }),
    {
      name: 'link-vault:links',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ links: state.links }),
    },
  ),
)

export default useLinksStore
