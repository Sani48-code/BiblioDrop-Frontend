import { useEffect, useState } from 'react'
import { CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAxiosSecure } from '../../../hooks/useAxiosSecure'

const PAGE_SIZE = 10

const ViewTransactions = () => {
  const axiosSecure = useAxiosSecure()
  const [transactions, setTransactions] = useState([])
  const [total, setTotal] = useState(0)
  const [revenue, setRevenue] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  const totalPages = Math.ceil(total / PAGE_SIZE)

  useEffect(() => {
    setLoading(true)
    axiosSecure.get(`/api/admin/transactions?page=${page}&limit=${PAGE_SIZE}`)
      .then((res) => {
        setTransactions(res.data?.transactions || res.data || [])
        setTotal(res.data?.total || 0)
        setRevenue(res.data?.totalRevenue || 0)
      })
      .catch(() => toast.error('Failed to load transactions'))
      .finally(() => setLoading(false))
  }, [page])

  if (loading) return <div className="space-y-3">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-14 bg-base-200 rounded-2xl animate-pulse" />)}</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-base-content">Transactions</h1>
        <div className="bg-success/10 border border-success/20 px-5 py-3 rounded-2xl">
          <p className="text-xs text-base-content/50 mb-0.5">Total Revenue</p>
          <p className="font-display text-2xl font-bold text-success">৳{revenue.toFixed(0)}</p>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="bg-base-100 border border-base-200 rounded-2xl p-16 text-center">
          <CreditCard size={40} className="text-base-content/20 mx-auto mb-3" />
          <p className="text-base-content/40 text-sm">No transactions yet</p>
        </div>
      ) : (
        <div className="bg-base-100 border border-base-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-base-200 border-b border-base-300">
                  {['ID', 'User', 'Librarian', 'Book', 'Amount', 'Date'].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-base-content/50">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-base-200/40 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs bg-base-200 text-base-content/60 px-2 py-1 rounded-lg">
                        {(tx.stripeSessionId || tx._id || '').slice(0, 12)}…
                      </span>
                    </td>
                    <td className="px-5 py-4 text-base-content/60 max-w-[140px] truncate">{tx.userEmail || '—'}</td>
                    <td className="px-5 py-4 text-base-content/60 max-w-[140px] truncate">{tx.librarianEmail || '—'}</td>
                    <td className="px-5 py-4 font-medium text-base-content max-w-[160px] truncate">{tx.bookTitle || '—'}</td>
                    <td className="px-5 py-4 font-semibold text-primary">৳{(tx.amount || tx.deliveryFee || 0).toFixed(0)}</td>
                    <td className="px-5 py-4 text-base-content/50">
                      {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-5">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors cursor-pointer ${p === page ? 'bg-primary text-primary-content' : 'bg-base-200 text-base-content/60 hover:bg-base-300'}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ViewTransactions
