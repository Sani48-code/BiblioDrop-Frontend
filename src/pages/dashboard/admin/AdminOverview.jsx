import { useEffect, useState } from 'react'
import { Users, BookOpen, Package, DollarSign } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { useAxiosSecure } from '../../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const CATEGORY_COLORS = ['#4F46E5', '#06B6D4', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6', '#F97316', '#6B7280']

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

const AdminOverview = () => {
  const axiosSecure = useAxiosSecure()
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosSecure.get('/api/admin/analytics')
      .then((res) => setAnalytics(res.data))
      .catch(() => toast.error('Failed to load analytics'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading loading-spinner loading-lg text-primary block mx-auto mt-20" />

  const stats = analytics?.stats || {}
  const revenueByMonth = analytics?.revenueByMonth || []
  const booksByCategory = analytics?.booksByCategory || []

  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} value={stats.totalUsers || 0} label="Total Users" color="bg-primary" />
        <StatCard icon={BookOpen} value={stats.totalBooks || 0} label="Total Books" color="bg-secondary" />
        <StatCard icon={Package} value={stats.totalDeliveries || 0} label="Total Deliveries" color="bg-accent" />
        <StatCard icon={DollarSign} value={`$${(stats.totalRevenue || 0).toFixed(2)}`} label="Total Revenue" color="bg-success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold mb-4 text-sm">Revenue per Month (last 6 months)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueByMonth}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => [`$${v}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#4F46E5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card bg-base-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold mb-4 text-sm">Books by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={booksByCategory} dataKey="count" nameKey="category" cx="50%" cy="50%" outerRadius={70}>
                {booksByCategory.map((_, i) => (
                  <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default AdminOverview
