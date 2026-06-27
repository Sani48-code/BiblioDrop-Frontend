import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import toast from 'react-hot-toast'

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
)

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const SOCIAL = [
  { icon: <XIcon />, label: 'X', href: '#' },
  { icon: <FacebookIcon />, label: 'Facebook', href: '#' },
  { icon: <InstagramIcon />, label: 'Instagram', href: '#' },
  { icon: <LinkedInIcon />, label: 'LinkedIn', href: '#' },
]

const Footer = () => {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email) return
    toast.success('🎉 You\'re on the list!')
    setEmail('')
  }

  return (
    <footer className="bg-neutral text-neutral-content">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Column 1 — Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <BookOpen size={22} className="text-primary" strokeWidth={2.5} />
              <span className="font-display font-bold text-xl text-white">BiblioDrop</span>
            </Link>
            <p className="text-white/60 text-sm italic leading-relaxed font-display mb-3">
              "Connecting readers with their next great story, one doorstep at a time."
            </p>
            <p className="text-white/40 text-xs leading-relaxed">
              Browse thousands of books from local libraries and independent book owners. Fast delivery, secure payments.
            </p>
          </div>

          {/* Column 2 — Quick Links */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-white/80 font-semibold text-sm mb-4 uppercase tracking-wider">Explore</h4>
              <ul className="space-y-2.5">
                {[
                  { label: 'Home', to: '/' },
                  { label: 'Browse Books', to: '/browse' },
                  { label: 'About', to: '/' },
                  { label: 'Contact', to: '/' },
                ].map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="text-white/50 hover:text-white text-sm transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white/80 font-semibold text-sm mb-4 uppercase tracking-wider">Legal</h4>
              <ul className="space-y-2.5">
                {['Privacy Policy', 'Terms of Use', 'Cookie Policy'].map((label) => (
                  <li key={label}>
                    <Link to="/" className="text-white/50 hover:text-white text-sm transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 3 — Community */}
          <div>
            <h4 className="text-white/80 font-semibold text-sm mb-4 uppercase tracking-wider">Follow Us</h4>
            <div className="flex gap-2 mb-6">
              {SOCIAL.map(({ icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-primary flex items-center justify-center text-white/60 hover:text-white transition-all cursor-pointer"
                >
                  {icon}
                </a>
              ))}
            </div>
            <p className="text-white/50 text-xs mb-3">Get new arrivals in your inbox</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-primary to-secondary text-white text-sm px-4 py-2 rounded-xl hover:opacity-90 transition-opacity cursor-pointer shrink-0"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/30 text-xs">© 2025 BiblioDrop. All rights reserved.</p>
          <p className="text-white/30 text-xs">Made with ❤️ for book lovers</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
