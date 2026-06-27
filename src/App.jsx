import { Routes, Route } from 'react-router-dom'
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

// User
import UserOverview from './pages/dashboard/user/UserOverview'
import DeliveryHistory from './pages/dashboard/user/DeliveryHistory'
import ReadingList from './pages/dashboard/user/ReadingList'
import MyReviews from './pages/dashboard/user/MyReviews'
import Wishlist from './pages/dashboard/user/Wishlist'

// Librarian
import LibrarianOverview from './pages/dashboard/librarian/LibrarianOverview'
import AddBook from './pages/dashboard/librarian/AddBook'
import ManageInventory from './pages/dashboard/librarian/ManageInventory'
import ManageDeliveries from './pages/dashboard/librarian/ManageDeliveries'

// Admin
import AdminOverview from './pages/dashboard/admin/AdminOverview'
import BookApprovalQueue from './pages/dashboard/admin/BookApprovalQueue'
import ManageUsers from './pages/dashboard/admin/ManageUsers'
import ManageAllBooks from './pages/dashboard/admin/ManageAllBooks'
import ViewTransactions from './pages/dashboard/admin/ViewTransactions'

const PublicLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-base-100">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
)

const App = () => (
  <Routes>
    <Route
      path="/"
      element={
        <PublicLayout>
          <Home />
        </PublicLayout>
      }
    />
    <Route
      path="/browse"
      element={
        <PublicLayout>
          <BrowseBooks />
        </PublicLayout>
      }
    />
    <Route
      path="/books/:id"
      element={
        <PublicLayout>
          <BookDetails />
        </PublicLayout>
      }
    />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route
      path="/payment-success"
      element={
        <PublicLayout>
          <PaymentSuccess />
        </PublicLayout>
      }
    />

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

    <Route
      path="*"
      element={
        <PublicLayout>
          <NotFound />
        </PublicLayout>
      }
    />
  </Routes>
)

export default App
