import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-canvas px-page text-center">
      <div>
        <p className="text-sm font-semibold text-brand">404</p>
        <h1 className="mt-2 text-3xl font-bold">Page not found</h1>
        <p className="mt-3 text-sm text-ink-muted">
          The page you are looking for does not exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-control bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-hover"
        >
          Back to home
        </Link>
      </div>
    </main>
  )
}
