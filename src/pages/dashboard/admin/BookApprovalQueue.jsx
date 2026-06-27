import { useEffect, useState } from 'react'
import { CheckCircle, Trash2, ClipboardCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAxiosSecure } from '../../../hooks/useAxiosSecure'

const BookApprovalQueue = () => {
  const axiosSecure = useAxiosSecure()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)

  const fetchBooks = () => {
    axiosSecure.get('/api/admin/books/pending')
      .then((res) => setBooks(res.data?.books || res.data || []))
      .catch(() => toast.error('Failed to load pending books'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchBooks() }, [])

  const handleApprove = async (id) => {
    setActionLoading(id)
    try {
      await axiosSecure.patch(`/api/admin/books/${id}/approve`)
      setBooks((b) => b.filter((bk) => bk._id !== id))
      toast.success('Book approved and published!')
    } catch {
      toast.error('Approval failed')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async () => {
    try {
      await axiosSecure.delete(`/api/admin/books/${deleteId}`)
      setBooks((b) => b.filter((bk) => bk._id !== deleteId))
      toast.success('Book deleted')
    } catch {
      toast.error('Delete failed')
    }
    setDeleteId(null)
  }

  if (loading) return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-32 bg-base-200 rounded-2xl animate-pulse" />)}
    </div>
  )

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="font-display text-2xl text-base-content">Book Approval Queue</h1>
        <span className="text-xs font-semibold bg-warning/10 text-warning px-2.5 py-1 rounded-full">{books.length} pending</span>
      </div>

      {books.length === 0 ? (
        <div className="bg-base-100 border border-base-200 rounded-2xl p-16 text-center">
          <ClipboardCheck size={40} className="text-base-content/20 mx-auto mb-3" />
          <p className="font-medium text-base-content/50 mb-1">All caught up!</p>
          <p className="text-sm text-base-content/40">No books pending approval.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {books.map((book) => (
            <div key={book._id} className="bg-base-100 border border-base-200 rounded-2xl p-5 flex items-start gap-5 hover:border-primary/30 transition-colors">
              {/* Cover */}
              <div className="w-16 h-22 rounded-xl overflow-hidden bg-base-200 shrink-0" style={{ aspectRatio: '2/3' }}>
                {book.imageURL ? (
                  <img src={book.imageURL} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-base-content truncate">{book.title}</h3>
                    <p className="text-sm text-base-content/60 mt-0.5">{book.author}</p>
                  </div>
                  <span className="shrink-0 text-xs bg-base-200 text-base-content/60 px-2.5 py-1 rounded-full">{book.category}</span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-base-content/40">
                  <span>Librarian: <span className="text-base-content/60">{book.librarianEmail || '—'}</span></span>
                  <span>Submitted: <span className="text-base-content/60">{book.createdAt ? new Date(book.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</span></span>
                </div>

                {book.description && (
                  <p className="text-xs text-base-content/50 mt-2 line-clamp-2 leading-relaxed">{book.description}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={() => handleApprove(book._id)}
                  disabled={actionLoading === book._id}
                  className="flex items-center gap-1.5 bg-success/10 text-success hover:bg-success hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                >
                  {actionLoading === book._id
                    ? <span className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                    : <CheckCircle size={14} />
                  }
                  Approve
                </button>
                <button
                  onClick={() => setDeleteId(book._id)}
                  className="flex items-center gap-1.5 bg-error/10 text-error hover:bg-error hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer"
                >
                  <Trash2 size={14} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteId && (
        <div className="modal modal-open">
          <div className="modal-box rounded-2xl bg-base-100">
            <h3 className="font-display text-lg text-base-content mb-2">Reject Book</h3>
            <p className="text-base-content/60 text-sm mb-6">Are you sure you want to permanently delete this book?</p>
            <div className="flex justify-end gap-3">
              <button className="border border-base-300 text-base-content/60 px-5 py-2 rounded-xl text-sm cursor-pointer" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="bg-error text-white px-5 py-2 rounded-xl text-sm cursor-pointer hover:opacity-90" onClick={handleDelete}>Delete</button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setDeleteId(null)} />
        </div>
      )}
    </div>
  )
}

export default BookApprovalQueue
