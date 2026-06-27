import { useEffect, useState } from 'react'
import { Package } from 'lucide-react'
import { useAxiosSecure } from '../../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'

const statusStyle = {
  Pending: 'badge-warning',
  Dispatched: 'badge-info',
  Delivered: 'badge-success',
}

const DeliveryHistory = () => {
  const axiosSecure = useAxiosSecure()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosSecure.get('/api/orders/my-orders')
      .then((res) => setOrders(res.data?.orders || res.data || []))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-16 bg-base-200 rounded-xl animate-pulse" />
      ))}
    </div>
  )

  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-6">Delivery History</h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-base-content/40 gap-4">
          <Package size={48} />
          <p className="text-lg font-semibold">No deliveries yet</p>
          <p className="text-sm">Browse books and request your first delivery!</p>
        </div>
      ) : (
        <div className="card bg-base-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Book</th>
                  <th>Title</th>
                  <th>Fee</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => (
                  <tr key={order._id} className="hover">
                    <td className="text-base-content/50 text-sm">{i + 1}</td>
                    <td>
                      <img
                        src={order.bookImageURL || 'https://placehold.co/40x50/e2e8f0/1e293b?text=📚'}
                        alt={order.bookTitle}
                        className="w-10 h-12 object-cover rounded-lg"
                      />
                    </td>
                    <td className="font-medium text-sm max-w-[180px] truncate">{order.bookTitle || '—'}</td>
                    <td className="text-primary font-semibold">${order.deliveryFee || '—'}</td>
                    <td className="text-sm text-base-content/60">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td>
                      <span className={`badge badge-sm ${statusStyle[order.status] || 'badge-ghost'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default DeliveryHistory
