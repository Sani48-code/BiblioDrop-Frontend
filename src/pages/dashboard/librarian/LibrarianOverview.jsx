import { useEffect, useState } from 'react'
import { BookCopy, Wallet, Clock } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts'
import { useAxiosSecure } from '../../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const StatCard = ({ icon: Icon, value, label, iconBg }) => (
  <div className="bg-base-100 border border-base-200 rounded-2xl p-5 flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
        <Icon size={19} />
      </div>
      <span className="text-xs text-base-content/40 uppercase tracking-wider">{label}</span>
    </div>
    <p className="font-display text-3xl font-bold text-base-content">{value}</p>
  </div>
)

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-base-100 border border-base-200 shadow-lg rounded-xl p-3 text-sm">
      <p className="font-semibold mb-1">{label}</p>
      <p className="text-success">৳{payload[0].value}</p>
    </div>
  )
}

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

  if (loading) return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-28 bg-base-200 rounded-2xl animate-pulse" />)}
      </div>
    </div>
  )

  return (
    <div>
      <h1 className="font-display text-2xl text-base-content mb-6">Librarian Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={BookCopy} value={books.length} label="Books Listed" iconBg="bg-primary/10 text-primary" />
        <StatCard icon={Wallet} value={`৳${totalEarnings.toFixed(0)}`} label="Total Earnings" iconBg="bg-success/10 text-success" />
        <StatCard icon={Clock} value={pendingCount} label="Pending Requests" iconBg="bg-warning/10 text-warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-base-100 border border-base-200 rounded-2xl p-5">
          <h3 className="font-semibold text-sm text-base-content mb-4">Monthly Earnings (last 6 months)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyEarnings} barSize={28}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" fill="#34D399" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-base-100 border border-base-200 rounded-2xl p-5">
          <h3 className="font-semibold text-sm text-base-content mb-4">Top Requested Books</h3>
          {topBooks.length === 0 ? (
            <div className="flex items-center justify-center h-52 text-base-content/40 text-sm">No requests yet</div>
          ) : (
            <div className="space-y-3 mt-2">
              {topBooks.map((b, i) => (
                <div key={i} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-base-200 flex items-center justify-center text-xs font-bold text-base-content/50 shrink-0">{i + 1}</span>
                    <p className="text-sm text-base-content truncate">{b.title}</p>
                  </div>
                  <span className="shrink-0 text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded-full">{b.count} req</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LibrarianOverview
