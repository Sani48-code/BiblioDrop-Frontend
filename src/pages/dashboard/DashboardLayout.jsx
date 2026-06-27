import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, BookMarked, Star, Heart,
  PlusCircle, BookCopy, Truck, ClipboardCheck, Users,
  Library, CreditCard, Menu, X, BookOpen, LogOut, Home,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const NAV = {
  user: [
    { label: 'Overview', icon: LayoutDashboard, to: '/dashboard/user' },
    { label: 'Delivery History', icon: Package, to: '/dashboard/user/history' },
    { label: 'Reading List', icon: BookMarked, to: '/dashboard/user/reading' },
    { label: 'My Reviews', icon: Star, to: '/dashboard/user/reviews' },
    { label: 'Wishlist', icon: Heart, to: '/dashboard/user/wishlist' },
  ],
  librarian: [
    { label: 'Overview', icon: LayoutDashboard, to: '/dashboard/librarian' },
    { label: 'Add Book', icon: PlusCircle, to: '/dashboard/librarian/add' },
    { label: 'Manage Inventory', icon: BookCopy, to: '/dashboard/librarian/inventory' },
    { label: 'Manage Deliveries', icon: Truck, to: '/dashboard/librarian/deliveries' },
  ],
  admin: [
    { label: 'Overview', icon: LayoutDashboard, to: '/dashboard/admin' },
    { label: 'Book Approval', icon: ClipboardCheck, to: '/dashboard/admin/approval' },
    { label: 'Manage Users', icon: Users, to: '/dashboard/admin/users' },
    { label: 'Manage Books', icon: Library, to: '/dashboard/admin/books' },
    { label: 'Transactions', icon: CreditCard, to: '/dashboard/admin/transactions' },
  ],
}

const roleBadgeStyle = {
  user: 'badge-info',
  librarian: 'badge-warning',
  admin: 'badge-error',
}

const SidebarContent = ({ onClose }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const links = NAV[user?.role] || []

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out')
    navigate('/')
  }

  return (
    <div className="h-full flex flex-col bg-base-200 border-r border-base-300">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-base-300 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" onClick={onClose}>
          <BookOpen size={20} className="text-primary" strokeWidth={2.5} />
          <span className="font-display font-bold text-primary text-lg">BiblioDrop</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle lg:hidden cursor-pointer">
            <X size={18} />
          </button>
        )}
      </div>

      {/* User profile card */}
      <div className="px-4 py-4 border-b border-base-300">
        <div className="bg-base-100 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden">
            {user?.photoURL
              ? <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
              : initials
            }
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm truncate text-base-content">{user?.name}</p>
            <span className={`badge badge-sm ${roleBadgeStyle[user?.role] || 'badge-ghost'} capitalize mt-0.5`}>
              {user?.role}
            </span>
            <p className="text-xs text-base-content/40 truncate mt-0.5">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-0.5">
        {links.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to.split('/').length === 3}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary text-primary-content shadow-sm shadow-primary/25'
                  : 'text-base-content/60 hover:bg-base-300 hover:text-base-content'
              }`
            }
            onClick={onClose}
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-base-300 space-y-0.5">
        <Link
          to="/"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-base-content/60 hover:bg-base-300 hover:text-base-content transition-all cursor-pointer"
        >
          <Home size={17} /> Back to Home
        </Link>
        <button
          onClick={handleLogout}
          className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-error/80 hover:bg-error/10 hover:text-error transition-all cursor-pointer focus:outline-none"
        >
          <LogOut size={17} /> Logout
        </button>
      </div>
    </div>
  )
}

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuth()

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  return (
    <div className="flex min-h-screen bg-base-100">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-64 shrink-0"
            >
              <SidebarContent onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between h-14 px-4 border-b border-base-300 bg-base-100 sticky top-0 z-40">
          <button onClick={() => setSidebarOpen(true)} className="btn btn-ghost btn-sm btn-circle cursor-pointer">
            <Menu size={20} />
          </button>
          <span className="font-display font-bold text-primary">BiblioDrop</span>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
            {initials}
          </div>
        </div>

        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
