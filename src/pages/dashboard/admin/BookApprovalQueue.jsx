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

  if (loading) return <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 bg-base-200 rounded-xl animate-pulse" />)}</div>

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-display font-bold">Book Approval Queue</h1>
        <span className="badge badge-warning">{books.length} pending</span>
      </div>

      {books.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-base-content/40 gap-4">
          <ClipboardCheck size={48} />
          <p className="text-lg font-semibold">No books pending approval</p>
          <p className="text-sm">All caught up!</p>
        </div>
      ) : (
        <div className="card bg-base-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Cover</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Librarian</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book._id} className="hover">
                    <td>
                      <img src={book.imageURL || 'https://placehold.co/40x50/e2e8f0/1e293b?text=📚'} alt={book.title} className="w-10 h-12 object-cover rounded-lg" />
                    </td>
                    <td className="font-medium text-sm max-w-[160px] truncate">{book.title}</td>
                    <td className="text-sm">{book.author}</td>
                    <td><span className="badge badge-sm badge-secondary">{book.category}</span></td>
                    <td className="text-xs text-base-content/60 max-w-[140px] truncate">{book.librarianEmail || '—'}</td>
                    <td className="text-xs text-base-content/60">
                      {book.createdAt ? new Date(book.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(book._id)}
                          disabled={actionLoading === book._id}
                          className="btn btn-success btn-xs gap-1"
                        >
                          {actionLoading === book._id ? <span className="loading loading-spinner loading-xs" /> : <CheckCircle size={12} />}
                          Approve
                        </button>
                        <button
                          onClick={() => setDeleteId(book._id)}
                          className="btn btn-error btn-xs gap-1"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete modal */}
      {deleteId && (
        <div className="modal modal-open">
          <div className="modal-box rounded-2xl">
            <h3 className="font-bold text-lg mb-2">Delete Book</h3>
            <p className="text-base-content/60 mb-6">Are you sure you want to permanently delete this book?</p>
            <div className="flex justify-end gap-3">
              <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-error" onClick={handleDelete}>Delete</button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setDeleteId(null)} />
        </div>
      )}
    </div>
  )
}

export default BookApprovalQueue
