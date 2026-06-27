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

  if (loading) return <div className="space-y-3">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-14 bg-base-200 rounded-xl animate-pulse" />)}</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold">View Transactions</h1>
        <div className="card bg-success/10 border border-success/30 px-5 py-3 rounded-xl">
          <p className="text-xs text-base-content/60 mb-0.5">Total Revenue</p>
          <p className="text-2xl font-bold text-success">${revenue.toFixed(2)}</p>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-base-content/40 gap-4">
          <CreditCard size={48} />
          <p className="text-lg font-semibold">No transactions yet</p>
        </div>
      ) : (
        <div className="card bg-base-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>User</th>
                  <th>Librarian</th>
                  <th>Book</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover">
                    <td>
                      <span className="font-mono text-xs bg-base-300 px-2 py-1 rounded">
                        {(tx.stripeSessionId || tx._id || '').slice(0, 16)}…
                      </span>
                    </td>
                    <td className="text-sm text-base-content/70 max-w-[140px] truncate">{tx.userEmail || '—'}</td>
                    <td className="text-sm text-base-content/70 max-w-[140px] truncate">{tx.librarianEmail || '—'}</td>
                    <td className="text-sm font-medium max-w-[160px] truncate">{tx.bookTitle || '—'}</td>
                    <td className="font-semibold text-primary">${(tx.amount || tx.deliveryFee || 0).toFixed(2)}</td>
                    <td className="text-xs text-base-content/50">
                      {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-5">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-ghost'}`}>{p}</button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ViewTransactions
