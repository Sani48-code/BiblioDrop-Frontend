import { useEffect, useState } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

const ScrollProgress = () => {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const scrolled = el.scrollTop / (el.scrollHeight - el.clientHeight)
      setPct(Math.min(1, Math.max(0, scrolled)) * 100)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div
      className="fixed top-0 left-0 z-[9999] h-0.5 bg-gradient-to-r from-primary to-secondary pointer-events-none transition-all duration-75"
      style={{ width: `${pct}%` }}
    />
  )
}
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'

import Home from './pages/Home'
import BrowseBooks from './pages/BrowseBooks'
import BookDetails from './pages/BookDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import PaymentSuccess from './pages/PaymentSuccess'
import NotFound from './pages/NotFound'

import DashboardLayout from './pages/dashboard/DashboardLayout'
import UserOverview from './pages/dashboard/user/UserOverview'
import DeliveryHistory from './pages/dashboard/user/DeliveryHistory'
import ReadingList from './pages/dashboard/user/ReadingList'
import MyReviews from './pages/dashboard/user/MyReviews'
import Wishlist from './pages/dashboard/user/Wishlist'

import LibrarianOverview from './pages/dashboard/librarian/LibrarianOverview'
import AddBook from './pages/dashboard/librarian/AddBook'
import ManageInventory from './pages/dashboard/librarian/ManageInventory'
import ManageDeliveries from './pages/dashboard/librarian/ManageDeliveries'

import AdminOverview from './pages/dashboard/admin/AdminOverview'
import BookApprovalQueue from './pages/dashboard/admin/BookApprovalQueue'
import ManageUsers from './pages/dashboard/admin/ManageUsers'
import ManageAllBooks from './pages/dashboard/admin/ManageAllBooks'
import ViewTransactions from './pages/dashboard/admin/ViewTransactions'

const PublicLayout = () => (
  <>
    <Navbar />
    <main className="min-h-screen">
      <Outlet />
    </main>
    <Footer />
  </>
)

const App = () => (
  <>
    <ScrollProgress />
    <Toaster
      position="top-right"
      toastOptions={{
        className: 'font-sans text-sm',
        style: { borderRadius: '12px', padding: '12px 16px' },
        success: { iconTheme: { primary: '#34D399', secondary: 'white' } },
        error: { iconTheme: { primary: '#F87171', secondary: 'white' } },
      }}
    />
    <Routes>
      {/* Public routes with Navbar + Footer */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<BrowseBooks />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
      </Route>

      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User Dashboard */}
      <Route
        path="/dashboard/user"
        element={
          <PrivateRoute role="user">
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<UserOverview />} />
        <Route path="history" element={<DeliveryHistory />} />
        <Route path="reading" element={<ReadingList />} />
        <Route path="reviews" element={<MyReviews />} />
        <Route path="wishlist" element={<Wishlist />} />
      </Route>

      {/* Librarian Dashboard */}
      <Route
        path="/dashboard/librarian"
        element={
          <PrivateRoute role="librarian">
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<LibrarianOverview />} />
        <Route path="add" element={<AddBook />} />
        <Route path="inventory" element={<ManageInventory />} />
        <Route path="deliveries" element={<ManageDeliveries />} />
      </Route>

      {/* Admin Dashboard */}
      <Route
        path="/dashboard/admin"
        element={
          <PrivateRoute role="admin">
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="approval" element={<BookApprovalQueue />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="books" element={<ManageAllBooks />} />
        <Route path="transactions" element={<ViewTransactions />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  </>
)

export default App
