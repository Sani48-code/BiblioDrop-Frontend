import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, BookMarked, Star, Heart,
  PlusCircle, BookCopy, Truck, ClipboardCheck, Users,
  Library, CreditCard, Menu, X, BookOpen, LogOut, Home,
} from 'lucide-react'
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

const roleBadge = {
  user: 'badge-primary',
  librarian: 'badge-secondary',
  admin: 'badge-accent',
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
      {/* Header */}
      <div className="p-5 border-b border-base-300">
        <div className="flex items-center justify-between mb-4">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen size={20} className="text-primary" />
            <span className="font-display font-bold text-primary text-lg">BiblioDrop</span>
          </Link>
          {onClose && (
            <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle lg:hidden">
              <X size={18} />
            </button>
          )}
        </div>
        {/* User info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">{user?.name}</p>
            <span className={`badge badge-sm ${roleBadge[user?.role] || 'badge-ghost'} mt-0.5 capitalize`}>
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-3 overflow-y-auto">
        {links.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to.split('/').length === 3}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-1 transition-all ${
                isActive
                  ? 'bg-primary text-primary-content shadow-sm'
                  : 'text-base-content/70 hover:bg-base-300 hover:text-base-content'
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
      <div className="p-3 border-t border-base-300 space-y-1">
        <Link
          to="/"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-base-content/70 hover:bg-base-300 hover:text-base-content transition-all"
        >
          <Home size={17} /> Back to Home
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-error/80 hover:bg-error/10 hover:text-error transition-all w-full text-left"
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

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="w-64 shrink-0">
            <SidebarContent onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-base-300 bg-base-100 sticky top-0 z-40">
          <button
            onClick={() => setSidebarOpen(true)}
            className="btn btn-ghost btn-sm btn-circle"
          >
            <Menu size={20} />
          </button>
          <span className="font-display font-bold text-primary">BiblioDrop</span>
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
            {initials}
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
