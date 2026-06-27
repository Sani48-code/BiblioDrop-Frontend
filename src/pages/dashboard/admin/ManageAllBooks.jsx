import { useEffect, useState } from 'react'
import { Trash2, EyeOff, Library } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAxiosSecure } from '../../../hooks/useAxiosSecure'

const STATUS_TABS = ['All', 'Published', 'Pending Approval', 'Unpublished', 'Checked Out']

const statusStyle = {
  'Pending Approval': 'badge-warning',
  Published: 'badge-success',
  Unpublished: 'badge-neutral',
  'Checked Out': 'badge-info',
}

const ManageAllBooks = () => {
  const axiosSecure = useAxiosSecure()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('All')
  const [deleteId, setDeleteId] = useState(null)

  const fetchBooks = () => {
    axiosSecure.get('/api/admin/books')
      .then((res) => setBooks(res.data?.books || res.data || []))
      .catch(() => toast.error('Failed to load books'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchBooks() }, [])

  const filtered = tab === 'All' ? books : books.filter((b) => b.status === tab)

  const handleUnpublish = async (id) => {
    try {
      await axiosSecure.patch(`/api/admin/books/${id}/unpublish`)
      setBooks((b) => b.map((bk) => bk._id === id ? { ...bk, status: 'Unpublished' } : bk))
      toast.success('Book unpublished')
    } catch {
      toast.error('Action failed')
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

  if (loading) return <div className="space-y-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-16 bg-base-200 rounded-xl animate-pulse" />)}</div>

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-display font-bold">Manage All Books</h1>
        <span className="badge badge-neutral">{books.length} total</span>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`btn btn-sm rounded-lg ${tab === t ? 'btn-primary' : 'btn-ghost'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-base-content/40 gap-4">
          <Library size={48} />
          <p className="text-lg font-semibold">No books in this category</p>
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
                  <th>Librarian</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((book) => (
                  <tr key={book._id} className="hover">
                    <td>
                      <img src={book.imageURL || 'https://placehold.co/40x50/e2e8f0/1e293b?text=📚'} alt={book.title} className="w-10 h-12 object-cover rounded-lg" />
                    </td>
                    <td className="font-medium text-sm max-w-[160px] truncate">{book.title}</td>
                    <td className="text-sm">{book.author}</td>
                    <td className="text-xs text-base-content/60 max-w-[140px] truncate">{book.librarianEmail || '—'}</td>
                    <td>
                      <span className={`badge badge-sm ${statusStyle[book.status] || 'badge-ghost'}`}>
                        {book.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        {book.status === 'Published' && (
                          <button onClick={() => handleUnpublish(book._id)} className="btn btn-warning btn-xs gap-1">
                            <EyeOff size={12} /> Unpublish
                          </button>
                        )}
                        <button onClick={() => setDeleteId(book._id)} className="btn btn-error btn-xs gap-1">
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
            <p className="text-base-content/60 mb-6">Permanently delete this book from the platform?</p>
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

export default ManageAllBooks
