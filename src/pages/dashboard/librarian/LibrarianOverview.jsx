import { useEffect, useState } from 'react'
import { BookCopy, DollarSign, Clock } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts'
import { useAxiosSecure } from '../../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const StatCard = ({ icon: Icon, value, label, color }) => (
  <div className="card bg-base-200 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-base-content/60">{label}</p>
    </div>
  </div>
)

const LibrarianOverview = () => {
  const axiosSecure = useAxiosSecure()
  const [books, setBooks] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      axiosSecure.get('/api/books/my-books'),
      axiosSecure.get('/api/orders/librarian-orders'),
    ]).then(([booksRes, ordersRes]) => {
      setBooks(booksRes.data?.books || booksRes.data || [])
      setOrders(ordersRes.data?.orders || ordersRes.data || [])
    }).catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false))
  }, [])

  const totalEarnings = orders.filter(o => o.status === 'Delivered').reduce((s, o) => s + (o.deliveryFee || 0), 0)
  const pendingCount = orders.filter(o => o.status === 'Pending').length

  const now = new Date()
  const monthlyEarnings = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
    const mo = orders.filter((o) => {
      const c = new Date(o.createdAt)
      return c.getMonth() === d.getMonth() && c.getFullYear() === d.getFullYear() && o.status === 'Delivered'
    })
    return { month: MONTHS[d.getMonth()], amount: mo.reduce((s, o) => s + (o.deliveryFee || 0), 0) }
  })

  // Top 3 books by request count
  const bookRequestMap = {}
  orders.forEach((o) => {
    const key = o.bookId
    if (!bookRequestMap[key]) bookRequestMap[key] = { title: o.bookTitle, count: 0 }
    bookRequestMap[key].count++
  })
  const topBooks = Object.values(bookRequestMap).sort((a, b) => b.count - a.count).slice(0, 3)

  if (loading) return <div className="loading loading-spinner loading-lg text-primary block mx-auto mt-20" />

  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-6">Librarian Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={BookCopy} value={books.length} label="Books Listed" color="bg-primary" />
        <StatCard icon={DollarSign} value={`$${totalEarnings.toFixed(2)}`} label="Total Earnings" color="bg-success" />
        <StatCard icon={Clock} value={pendingCount} label="Pending Requests" color="bg-warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold mb-4 text-sm">Monthly Earnings (last 6 months)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyEarnings}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => [`$${v}`, 'Earned']} />
              <Bar dataKey="amount" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card bg-base-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold mb-4 text-sm">Top Requested Books</h3>
          {topBooks.length === 0 ? (
            <p className="text-base-content/40 text-sm text-center py-8">No requests yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead><tr><th>Title</th><th>Requests</th></tr></thead>
                <tbody>
                  {topBooks.map((b, i) => (
                    <tr key={i}>
                      <td className="truncate max-w-[200px] text-sm">{b.title}</td>
                      <td><span className="badge badge-primary badge-sm">{b.count}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LibrarianOverview
