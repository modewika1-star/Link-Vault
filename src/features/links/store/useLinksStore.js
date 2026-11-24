import { create } from 'zustand'

const useLinksStore = create((set) => ({
  links: [],

  addLink: (link) =>
    set((state) => ({
      links: [link, ...state.links],
    })),

  removeLink: (id) =>
    set((state) => ({
      links: state.links.filter((link) => link.id !== id),
    })),
}))

export default useLinksStore
