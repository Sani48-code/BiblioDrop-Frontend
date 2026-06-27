import { useEffect, useState } from 'react'
import { Truck } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAxiosSecure } from '../../../hooks/useAxiosSecure'

const TABS = ['All', 'Pending', 'Dispatched', 'Delivered']
const STATUS_ORDER = ['Pending', 'Dispatched', 'Delivered']

const STATUS_STYLE = {
  Pending: 'bg-warning/10 text-warning',
  Dispatched: 'bg-info/10 text-info',
  Delivered: 'bg-success/10 text-success',
}

const ManageDeliveries = () => {
  const axiosSecure = useAxiosSecure()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('All')

  useEffect(() => {
    axiosSecure.get('/api/orders/librarian-orders')
      .then((res) => setOrders(res.data?.orders || res.data || []))
      .catch(() => toast.error('Failed to load deliveries'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = tab === 'All' ? orders : orders.filter((o) => o.status === tab)

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axiosSecure.patch(`/api/orders/${orderId}/status`, { status: newStatus })
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status: newStatus } : o))
      toast.success(`Status updated to ${newStatus}`)
    } catch {
      toast.error('Status update failed')
    }
  }

  if (loading) return <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 bg-base-200 rounded-2xl animate-pulse" />)}</div>

  return (
    <div>
      <h1 className="font-display text-2xl text-base-content mb-6">Manage Deliveries</h1>

      {/* Underline tabs */}
      <div className="flex gap-1 border-b border-base-300 mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px cursor-pointer focus:outline-none ${
              tab === t
                ? 'border-primary text-primary'
                : 'border-transparent text-base-content/50 hover:text-base-content'
            }`}
          >
            {t}
            {t !== 'All' && (
              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full font-normal ${tab === t ? 'bg-primary/10 text-primary' : 'bg-base-200 text-base-content/50'}`}>
                {orders.filter((o) => o.status === t).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-base-100 border border-base-200 rounded-2xl p-16 text-center">
          <Truck size={40} className="text-base-content/20 mx-auto mb-3" />
          <p className="text-base-content/40 text-sm">No deliveries in this category</p>
        </div>
      ) : (
        <div className="bg-base-100 border border-base-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-base-200 border-b border-base-300">
                  {['Reader', 'Book', 'Date', 'Status', 'Update'].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-base-content/50">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200">
                {filtered.map((order) => {
                  const currentIdx = STATUS_ORDER.indexOf(order.status)
                  return (
                    <tr key={order._id} className="hover:bg-base-200/40 transition-colors">
                      <td className="px-5 py-4 text-base-content/70 max-w-[140px] truncate">{order.readerName || order.userEmail || '—'}</td>
                      <td className="px-5 py-4 font-medium text-base-content max-w-[180px] truncate">{order.bookTitle || '—'}</td>
                      <td className="px-5 py-4 text-base-content/50">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '—'}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[order.status] || 'bg-base-200 text-base-content'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="border border-base-300 focus:border-primary rounded-lg px-2 py-1.5 text-xs bg-base-100 outline-none focus:ring-1 focus:ring-primary/20 cursor-pointer"
                        >
                          {STATUS_ORDER.map((s, idx) => (
                            <option key={s} value={s} disabled={idx < currentIdx}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageDeliveries
