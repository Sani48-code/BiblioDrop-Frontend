import { useEffect, useState } from 'react'
import { BookMarked, Clock, Wallet } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { useAxiosSecure } from '../../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const PIE_COLORS = { Pending: '#FBBF24', Dispatched: '#38BDF8', Delivered: '#34D399' }

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
  const pending = orders.filter((o) => ['Pending', 'Dispatched'].includes(o.status))
  const totalSpent = delivered.reduce((s, o) => s + (o.deliveryFee || 0), 0)

  const now = new Date()
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
    const mo = orders.filter((o) => {
      const c = new Date(o.createdAt)
      return c.getMonth() === d.getMonth() && c.getFullYear() === d.getFullYear() && o.status === 'Delivered'
    })
    return { month: MONTHS[d.getMonth()], amount: mo.reduce((s, o) => s + (o.deliveryFee || 0), 0) }
  })

  const statusCounts = ['Pending', 'Dispatched', 'Delivered'].map((s) => ({
    name: s,
    value: orders.filter((o) => o.status === s).length,
  })).filter((s) => s.value > 0)

  if (loading) return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-28 bg-base-200 rounded-2xl animate-pulse" />)}
      </div>
    </div>
  )

  return (
    <div>
      <h1 className="font-display text-2xl text-base-content mb-6">My Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={BookMarked} value={delivered.length} label="Books Read" iconBg="bg-success/10 text-success" />
        <StatCard icon={Clock} value={pending.length} label="Pending Deliveries" iconBg="bg-warning/10 text-warning" />
        <StatCard icon={Wallet} value={`৳${totalSpent.toFixed(0)}`} label="Total Spent" iconBg="bg-primary/10 text-primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-base-100 border border-base-200 rounded-2xl p-5">
          <h3 className="font-semibold text-sm text-base-content mb-4">Monthly Spending (last 6 months)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} barSize={28}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" fill="#4F46E5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-base-100 border border-base-200 rounded-2xl p-5">
          <h3 className="font-semibold text-sm text-base-content mb-4">Delivery Status</h3>
          {statusCounts.length === 0 ? (
            <div className="flex items-center justify-center h-52 text-base-content/40 text-sm">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusCounts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} innerRadius={40}>
                  {statusCounts.map(({ name }) => (
                    <Cell key={name} fill={PIE_COLORS[name]} />
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

export default UserOverview
