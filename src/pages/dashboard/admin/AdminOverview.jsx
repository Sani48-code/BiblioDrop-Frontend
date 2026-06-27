import { useEffect, useState } from 'react'
import { Users, BookOpen, Package, Wallet } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { useAxiosSecure } from '../../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'

const CATEGORY_COLORS = ['#4F46E5', '#06B6D4', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6', '#F97316', '#6B7280']

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
      <p className="text-primary">৳{payload[0].value}</p>
    </div>
  )
}

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

  if (loading) return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 bg-base-200 rounded-2xl animate-pulse" />)}
      </div>
    </div>
  )

  const stats = analytics?.stats || {}
  const revenueByMonth = analytics?.revenueByMonth || []
  const booksByCategory = analytics?.booksByCategory || []

  return (
    <div>
      <h1 className="font-display text-2xl text-base-content mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users} value={stats.totalUsers || 0} label="Total Users" iconBg="bg-primary/10 text-primary" />
        <StatCard icon={BookOpen} value={stats.totalBooks || 0} label="Total Books" iconBg="bg-secondary/10 text-secondary" />
        <StatCard icon={Package} value={stats.totalDeliveries || 0} label="Total Deliveries" iconBg="bg-info/10 text-info" />
        <StatCard icon={Wallet} value={`৳${(stats.totalRevenue || 0).toFixed(0)}`} label="Total Revenue" iconBg="bg-success/10 text-success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-base-100 border border-base-200 rounded-2xl p-5">
          <h3 className="font-semibold text-sm text-base-content mb-4">Revenue per Month (last 6 months)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueByMonth} barSize={28}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" fill="#4F46E5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-base-100 border border-base-200 rounded-2xl p-5">
          <h3 className="font-semibold text-sm text-base-content mb-4">Books by Category</h3>
          {booksByCategory.length === 0 ? (
            <div className="flex items-center justify-center h-52 text-base-content/40 text-sm">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={booksByCategory} dataKey="count" nameKey="category" cx="50%" cy="50%" outerRadius={75} innerRadius={40}>
                  {booksByCategory.map((_, i) => (
                    <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Legend iconType="circle" iconSize={8} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminOverview
