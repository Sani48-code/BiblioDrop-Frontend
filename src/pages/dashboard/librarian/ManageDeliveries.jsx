import { useEffect, useState } from 'react'
import { Truck } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAxiosSecure } from '../../../hooks/useAxiosSecure'

const TABS = ['All', 'Pending', 'Dispatched', 'Delivered']
const STATUS_ORDER = ['Pending', 'Dispatched', 'Delivered']

const statusStyle = {
  Pending: 'badge-warning',
  Dispatched: 'badge-info',
  Delivered: 'badge-success',
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

  if (loading) return <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 bg-base-200 rounded-xl animate-pulse" />)}</div>

  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-6">Manage Deliveries</h1>

      {/* Filter tabs */}
      <div className="tabs tabs-boxed bg-base-200 w-fit mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`tab ${tab === t ? 'tab-active' : ''}`}
          >
            {t}
            {t !== 'All' && (
              <span className={`ml-1.5 badge badge-xs ${statusStyle[t] || ''}`}>
                {orders.filter((o) => o.status === t).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-base-content/40 gap-4">
          <Truck size={48} />
          <p className="text-lg font-semibold">No deliveries in this category</p>
        </div>
      ) : (
        <div className="card bg-base-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Reader</th>
                  <th>Book Title</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => {
                  const currentIdx = STATUS_ORDER.indexOf(order.status)
                  return (
                    <tr key={order._id} className="hover">
                      <td className="text-sm">{order.readerName || order.userEmail || '—'}</td>
                      <td className="font-medium text-sm max-w-[180px] truncate">{order.bookTitle || '—'}</td>
                      <td className="text-sm text-base-content/60">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td>
                        <span className={`badge badge-sm ${statusStyle[order.status] || 'badge-ghost'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="select select-bordered select-xs"
                        >
                          {STATUS_ORDER.map((s, idx) => (
                            <option key={s} value={s} disabled={idx < currentIdx}>
                              {s}
                            </option>
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
