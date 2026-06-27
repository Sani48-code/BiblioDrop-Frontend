import { useEffect, useState } from 'react'
import { Package } from 'lucide-react'
import { useAxiosSecure } from '../../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'

const STATUS_STYLE = {
  Pending: 'bg-warning/10 text-warning',
  Dispatched: 'bg-info/10 text-info',
  Delivered: 'bg-success/10 text-success',
  Cancelled: 'bg-error/10 text-error',
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
        <div key={i} className="h-16 bg-base-200 rounded-2xl animate-pulse" />
      ))}
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-base-content">Delivery History</h1>
        <span className="text-sm text-base-content/40">{orders.length} orders</span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-base-100 border border-base-200 rounded-2xl p-16 text-center">
          <Package size={40} className="text-base-content/20 mx-auto mb-3" />
          <p className="text-base-content/40 text-sm">No orders yet. Start browsing books!</p>
        </div>
      ) : (
        <div className="bg-base-100 border border-base-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-base-200 border-b border-base-300">
                  {['Book', 'Librarian', 'Fee', 'Date', 'Status'].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-base-content/50">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200">
                {orders.map((o) => (
                  <tr key={o._id} className="hover:bg-base-200/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-11 rounded-md overflow-hidden shrink-0 bg-base-200">
                          {o.bookImageURL || o.book?.coverImage
                            ? <img src={o.bookImageURL || o.book?.coverImage} alt={o.bookTitle} className="w-full h-full object-cover" />
                            : <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
                          }
                        </div>
                        <div>
                          <p className="font-medium text-base-content line-clamp-1">{o.bookTitle || o.book?.title || 'Unknown Book'}</p>
                          <p className="text-xs text-base-content/40">{o.book?.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-base-content/60">{o.librarianEmail || o.librarian?.name || '—'}</td>
                    <td className="px-5 py-4 font-semibold text-base-content">৳{o.deliveryFee || 0}</td>
                    <td className="px-5 py-4 text-base-content/50">
                      {o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[o.status] || 'bg-base-200 text-base-content'}`}>
                        {o.status}
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
