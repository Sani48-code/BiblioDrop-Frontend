import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, Sun, Moon, Menu, X, LogOut, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../hooks/useTheme'
import toast from 'react-hot-toast'

const navLinkClass = ({ isActive }) =>
  `relative text-sm font-medium transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-primary after:transition-all ${
    isActive
      ? 'text-primary after:w-full'
      : 'text-base-content/70 hover:text-primary after:w-0 hover:after:w-full'
  }`

const Navbar = () => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme, isDark } = useTheme()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
    navigate('/')
    setDrawerOpen(false)
  }

  const dashboardPath =
    user?.role === 'admin'
      ? '/dashboard/admin'
      : user?.role === 'librarian'
      ? '/dashboard/librarian'
      : '/dashboard/user'

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 bg-base-100/80 backdrop-blur-md border-b border-base-300 transition-shadow duration-300 ${
          scrolled ? 'shadow-md' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <BookOpen className="text-primary" size={24} strokeWidth={2.5} />
              <span className="font-display font-bold text-xl text-primary tracking-tight">BiblioDrop</span>
            </Link>

            {/* Center nav (desktop) */}
            <div className="hidden md:flex items-center gap-8">
              <NavLink to="/" className={navLinkClass} end>Home</NavLink>
              <NavLink to="/browse" className={navLinkClass}>Browse Books</NavLink>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Dark mode toggle */}
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1 rounded-full border border-base-300 px-3 py-1.5 bg-base-100 hover:border-primary/40 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={isDark ? 'moon' : 'sun'}
                    initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isDark
                      ? <Sun size={15} className="text-amber-400" />
                      : <Moon size={15} className="text-indigo-500" />
                    }
                  </motion.span>
                </AnimatePresence>
              </button>

              {/* Auth buttons / user menu (desktop) */}
              {!user ? (
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/login" className="btn btn-ghost btn-sm font-medium cursor-pointer">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm text-white px-5 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary font-medium hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-lg shadow-primary/25 cursor-pointer"
                  >
                    Get Started
                  </Link>
                </div>
              ) : (
                <div className="hidden md:block dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-ghost btn-circle cursor-pointer">
                    {user.photoURL ? (
                      <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary/20">
                        <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold">
                        {initials}
                      </div>
                    )}
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu shadow-xl bg-base-100 rounded-2xl w-60 mt-2 border border-base-200 p-2 z-[60]"
                  >
                    <li className="px-3 py-2 pointer-events-none">
                      <span className="font-semibold text-sm block">{user.name}</span>
                      <span className="text-xs text-base-content/50 block truncate">{user.email}</span>
                    </li>
                    <div className="divider my-1 h-px" />
                    <li>
                      <Link to={dashboardPath} className="flex items-center gap-2 rounded-xl hover:bg-base-200 px-3 py-2 text-sm">
                        <LayoutDashboard size={15} /> Dashboard
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-error rounded-xl hover:bg-error/10 px-3 py-2 text-sm w-full text-left cursor-pointer"
                      >
                        <LogOut size={15} /> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                className="btn btn-ghost btn-sm btn-circle md:hidden cursor-pointer"
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
      <AnimatePresence>
        {drawerOpen && (
          <div className="fixed inset-0 z-[60] flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 bg-black/50 backdrop-blur-sm"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-72 bg-base-100 h-full flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between p-5 border-b border-base-200">
                <Link to="/" className="flex items-center gap-2" onClick={() => setDrawerOpen(false)}>
                  <BookOpen className="text-primary" size={22} strokeWidth={2.5} />
                  <span className="font-display font-bold text-lg text-primary">BiblioDrop</span>
                </Link>
                <button className="btn btn-ghost btn-sm btn-circle cursor-pointer" onClick={() => setDrawerOpen(false)}>
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-col p-4 gap-1 flex-1 overflow-y-auto">
                <NavLink to="/" end className={navLinkClass} onClick={() => setDrawerOpen(false)}>
                  Home
                </NavLink>
                <NavLink to="/browse" className={navLinkClass} onClick={() => setDrawerOpen(false)}>
                  Browse Books
                </NavLink>

                <div className="my-3 h-px bg-base-200" />

                {user ? (
                  <>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{user.name}</p>
                        <p className="text-xs text-base-content/50 capitalize">{user.role}</p>
                      </div>
                    </div>
                    <Link
                      to={dashboardPath}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm hover:bg-base-200 transition-colors cursor-pointer"
                      onClick={() => setDrawerOpen(false)}
                    >
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-error hover:bg-error/10 transition-colors cursor-pointer w-full text-left"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 mt-2">
                    <Link to="/login" className="btn btn-ghost btn-sm cursor-pointer" onClick={() => setDrawerOpen(false)}>
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="text-center text-sm text-white px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary font-medium cursor-pointer"
                      onClick={() => setDrawerOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>

              {/* Dark mode in drawer */}
              <div className="p-4 border-t border-base-200">
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-base-200 transition-colors text-sm cursor-pointer"
                >
                  {isDark ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-indigo-500" />}
                  {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-16" />
    </>
  )
}

export default Navbar
