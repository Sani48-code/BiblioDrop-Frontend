import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { BookOpen, Sun, Moon, Menu, X, LogOut, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [theme, setTheme] = useState(
    () => localStorage.getItem('bibliodrop-theme') || 'bibliolight'
  )

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleTheme = () => {
    const next = theme === 'bibliolight' ? 'bibliodark' : 'bibliolight'
    setTheme(next)
    localStorage.setItem('bibliodrop-theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  const dashboardPath =
    user?.role === 'admin'
      ? '/dashboard/admin'
      : user?.role === 'librarian'
      ? '/dashboard/librarian'
      : '/dashboard/user'

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U'

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors hover:text-primary ${
      isActive ? 'text-primary border-b-2 border-primary pb-0.5' : 'text-base-content'
    }`

  const NavLinks = () => (
    <>
      <NavLink to="/" className={navLinkClass} end onClick={() => setDrawerOpen(false)}>
        Home
      </NavLink>
      <NavLink to="/browse" className={navLinkClass} onClick={() => setDrawerOpen(false)}>
        Browse Books
      </NavLink>
    </>
  )

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 bg-base-100/90 backdrop-blur-md border-b border-base-300 transition-shadow ${
          scrolled ? 'shadow-md' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <BookOpen className="text-primary" size={26} />
              <span className="font-display text-xl font-bold text-primary">BiblioDrop</span>
            </Link>

            {/* Center nav (desktop) */}
            <div className="hidden md:flex items-center gap-8">
              <NavLinks />
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="btn btn-ghost btn-sm btn-circle"
                aria-label="Toggle theme"
              >
                {theme === 'bibliodark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Auth buttons / user menu */}
              {!user ? (
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/login" className="btn btn-ghost btn-sm">
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-primary btn-sm">
                    Get Started
                  </Link>
                </div>
              ) : (
                <div className="dropdown dropdown-end hidden md:block">
                  <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                    {user.photoURL ? (
                      <div className="w-9 rounded-full overflow-hidden">
                        <img src={user.photoURL} alt={user.name} />
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-content text-sm font-bold">
                        {initials}
                      </div>
                    )}
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu shadow-lg bg-base-100 rounded-2xl w-56 mt-2 border border-base-300 p-2"
                  >
                    <li className="px-3 py-2">
                      <span className="font-semibold text-sm text-base-content block">{user.name}</span>
                      <span className="text-xs text-base-content/60 block truncate">{user.email}</span>
                    </li>
                    <div className="divider my-1"></div>
                    <li>
                      <Link to={dashboardPath} className="flex items-center gap-2">
                        <LayoutDashboard size={15} /> Dashboard
                      </Link>
                    </li>
                    <li>
                      <button onClick={handleLogout} className="flex items-center gap-2 text-error">
                        <LogOut size={15} /> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                className="btn btn-ghost btn-sm btn-circle md:hidden"
                onClick={() => setDrawerOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60] flex">
          <div
            className="flex-1 bg-black/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="w-72 bg-base-100 h-full flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-base-300">
              <Link to="/" className="flex items-center gap-2" onClick={() => setDrawerOpen(false)}>
                <BookOpen className="text-primary" size={22} />
                <span className="font-display text-lg font-bold text-primary">BiblioDrop</span>
              </Link>
              <button className="btn btn-ghost btn-sm btn-circle" onClick={() => setDrawerOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col gap-1 p-4 flex-1">
              <NavLinks />
              <div className="divider my-2"></div>
              {user ? (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-content font-bold">
                      {initials}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{user.name}</p>
                      <p className="text-xs text-base-content/60">{user.role}</p>
                    </div>
                  </div>
                  <Link
                    to={dashboardPath}
                    className="btn btn-ghost btn-sm justify-start gap-2"
                    onClick={() => setDrawerOpen(false)}
                  >
                    <LayoutDashboard size={15} /> Dashboard
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setDrawerOpen(false) }}
                    className="btn btn-ghost btn-sm justify-start gap-2 text-error"
                  >
                    <LogOut size={15} /> Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  <Link
                    to="/login"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setDrawerOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary btn-sm"
                    onClick={() => setDrawerOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  )
}

export default Navbar
