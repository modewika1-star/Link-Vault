import { useState } from 'react'
import {
  FiBookmark,
  FiExternalLink,
  FiLink,
  FiSearch,
  FiTrash2,
} from 'react-icons/fi'
import LinkForm from '../features/links/components/LinkForm'
import useLinksStore from '../features/links/store/useLinksStore'

export default function HomePage() {
  const [search, setSearch] = useState('')
  const links = useLinksStore((state) => state.links)
  const addLink = useLinksStore((state) => state.addLink)
  const removeLink = useLinksStore((state) => state.removeLink)

  const filteredLinks = links.filter((link) =>
    `${link.title} ${link.url}`.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <main className="min-h-screen bg-canvas px-page py-section">
      <div className="mx-auto w-full max-w-[var(--ds-container-width)]">
        <header className="mb-section flex flex-wrap items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-card bg-brand text-xl text-white">
              <FiBookmark aria-hidden="true" />
            </span>
            <span>
              <span className="block text-xl font-bold tracking-tight">
                Link Vault
              </span>
              <span className="text-xs text-ink-muted">
                Your links, organized.
              </span>
            </span>
          </a>

          <span className="rounded-pill border border-line bg-surface px-4 py-2 text-xs font-medium text-ink-muted">
            Starter environment
          </span>
        </header>

        <section className="mb-10">
          <p className="mb-3 text-sm font-semibold text-brand">YOUR PERSONAL SPACE</p>
          <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Keep your useful links close.
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-ink-muted sm:text-base">
            Save websites in one place, find them quickly, and keep your
            digital resources organized.
          </p>
        </section>

        <section className="mb-section">
          <div className="mb-4 flex items-center gap-2">
            <FiLink className="text-brand" aria-hidden="true" />
            <h2 className="text-lg font-semibold">Add a new link</h2>
          </div>
          <LinkForm onAdd={addLink} />
        </section>

        <section>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Saved links</h2>
              <p className="mt-1 text-sm text-ink-muted">
                {links.length} {links.length === 1 ? 'link' : 'links'} saved
              </p>
            </div>

            <label className="flex w-full items-center gap-2 rounded-control border border-line bg-surface px-3 py-2.5 sm:w-72">
              <FiSearch className="shrink-0 text-ink-muted" aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search your links..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-ink-muted"
                aria-label="Search saved links"
              />
            </label>
          </div>

          {filteredLinks.length === 0 ? (
            <div className="rounded-panel border border-dashed border-line bg-surface px-6 py-14 text-center">
              <FiBookmark className="mx-auto mb-3 text-3xl text-ink-muted" />
              <h3 className="font-semibold">
                {links.length === 0 ? 'Your vault is empty' : 'No links found'}
              </h3>
              <p className="mt-2 text-sm text-ink-muted">
                {links.length === 0
                  ? 'Add your first link to get started.'
                  : 'Try searching with another title or URL.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {filteredLinks.map((link) => (
                <article
                  key={link.id}
                  className="flex min-w-0 items-center justify-between gap-4 rounded-card border border-line bg-surface p-card shadow-card"
                >
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold">{link.title}</h3>
                    <p className="mt-1 truncate text-xs text-ink-muted">
                      {link.url}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${link.title}`}
                      className="rounded-control p-2 text-brand transition hover:bg-canvas"
                    >
                      <FiExternalLink />
                    </a>
                    <button
                      type="button"
                      onClick={() => removeLink(link.id)}
                      aria-label={`Delete ${link.title}`}
                      className="rounded-control p-2 text-ink-muted transition hover:bg-canvas hover:text-danger"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="mt-section border-t border-line pt-6 text-center text-xs text-ink-muted">
          Link Vault · Project foundation
        </footer>
      </div>
    </main>
  )
}
