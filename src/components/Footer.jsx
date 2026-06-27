import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import toast from 'react-hot-toast'

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.84L2.004 2.25H8.08l4.264 5.638 5.9-5.638zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
)

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const Footer = () => {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email) return
    toast.success('Thanks for subscribing!')
    setEmail('')
  }

  return (
    <footer className="bg-base-200 border-t border-base-300 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Column 1 — Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-3">
              <BookOpen className="text-primary" size={24} />
              <span className="font-display text-xl font-bold text-primary">BiblioDrop</span>
            </Link>
            <p className="text-base-content/70 text-sm mb-2">
              Connecting readers with their next great story
            </p>
            <p className="text-base-content/50 text-xs leading-relaxed">
              Browse thousands of books from local libraries and independent owners. Pay a small delivery fee and get your next read delivered to your door.
            </p>
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <h4 className="font-semibold text-base-content mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-base-content/70">
              {[
                { label: 'Home', to: '/' },
                { label: 'Browse Books', to: '/browse' },
                { label: 'About', to: '/' },
                { label: 'Contact', to: '/' },
                { label: 'Privacy Policy', to: '/' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="hover:text-primary transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Connect */}
          <div>
            <h4 className="font-semibold text-base-content mb-4">Connect</h4>
            <div className="flex gap-3 mb-6">
              {[
                { icon: <XIcon />, label: 'X', href: '#' },
                { icon: <FacebookIcon />, label: 'Facebook', href: '#' },
                { icon: <InstagramIcon />, label: 'Instagram', href: '#' },
                { icon: <LinkedInIcon />, label: 'LinkedIn', href: '#' },
              ].map(({ icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-base-300 flex items-center justify-center text-base-content/70 hover:bg-primary hover:text-primary-content transition-all"
                >
                  {icon}
                </a>
              ))}
            </div>
            <p className="text-sm text-base-content/70 mb-2">Stay in the loop</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="input input-bordered input-sm flex-1 text-sm"
              />
              <button type="submit" className="btn btn-primary btn-sm">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-base-300 pt-5 text-center">
          <p className="text-xs text-base-content/50">
            © 2025 BiblioDrop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
