import { useEffect, useState } from 'react'
import { BookOpen, Package, DollarSign } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { useAxiosSecure } from '../../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const PIE_COLORS = { Pending: '#F59E0B', Dispatched: '#06B6D4', Delivered: '#10B981' }

const StatCard = ({ icon: Icon, value, label, color }) => (
  <div className="card bg-base-200 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold text-base-content">{value}</p>
      <p className="text-sm text-base-content/60">{label}</p>
    </div>
  </div>
)

const UserOverview = () => {
  const axiosSecure = useAxiosSecure()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosSecure.get('/api/orders/my-orders')
      .then((res) => setOrders(res.data?.orders || res.data || []))
      .catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false))
  }, [])

  const delivered = orders.filter((o) => o.status === 'Delivered')
  const pending = orders.filter((o) => o.status === 'Pending' || o.status === 'Dispatched')
  const totalSpent = orders.filter(o => o.status === 'Delivered').reduce((s, o) => s + (o.deliveryFee || 0), 0)

  // Monthly spending (last 6 months)
  const now = new Date()
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
    const monthOrders = orders.filter((o) => {
      const created = new Date(o.createdAt)
      return created.getMonth() === d.getMonth() && created.getFullYear() === d.getFullYear() && o.status === 'Delivered'
    })
    return {
      month: MONTHS[d.getMonth()],
      amount: monthOrders.reduce((s, o) => s + (o.deliveryFee || 0), 0),
    }
  })

  // Status breakdown
  const statusCounts = ['Pending', 'Dispatched', 'Delivered'].map((s) => ({
    name: s,
    value: orders.filter((o) => o.status === s).length,
  }))

  if (loading) return <div className="loading loading-spinner loading-lg text-primary block mx-auto mt-20" />

  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-6">My Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={BookOpen} value={delivered.length} label="Books Read" color="bg-primary" />
        <StatCard icon={Package} value={pending.length} label="Pending Deliveries" color="bg-secondary" />
        <StatCard icon={DollarSign} value={`$${totalSpent.toFixed(2)}`} label="Total Spent" color="bg-accent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold mb-4 text-sm">Monthly Spending (last 6 months)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => [`$${v}`, 'Spent']} />
              <Bar dataKey="amount" fill="#4F46E5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card bg-base-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold mb-4 text-sm">Delivery Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={statusCounts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                {statusCounts.map(({ name }) => (
                  <Cell key={name} fill={PIE_COLORS[name]} />
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

export default UserOverview
