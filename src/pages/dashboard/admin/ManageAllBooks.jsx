import { useEffect, useState } from 'react'
import { Trash2, EyeOff, Library } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAxiosSecure } from '../../../hooks/useAxiosSecure'

const STATUS_TABS = ['All', 'Published', 'Pending Approval', 'Unpublished', 'Checked Out']

const STATUS_STYLE = {
  'Pending Approval': 'bg-warning/10 text-warning',
  Published: 'bg-success/10 text-success',
  Unpublished: 'bg-base-300 text-base-content/60',
  'Checked Out': 'bg-info/10 text-info',
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

  if (loading) return <div className="space-y-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-16 bg-base-200 rounded-2xl animate-pulse" />)}</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-base-content">Manage All Books</h1>
        <span className="text-sm text-base-content/40">{books.length} books</span>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer focus:outline-none ${
              tab === t
                ? 'bg-primary text-primary-content shadow-sm'
                : 'bg-base-200 text-base-content/60 hover:bg-base-300 hover:text-base-content'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-base-100 border border-base-200 rounded-2xl p-16 text-center">
          <Library size={40} className="text-base-content/20 mx-auto mb-3" />
          <p className="text-base-content/40 text-sm">No books in this category</p>
        </div>
      ) : (
        <div className="bg-base-100 border border-base-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-base-200 border-b border-base-300">
                  {['Cover', 'Title', 'Author', 'Librarian', 'Status', ''].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-base-content/50">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200">
                {filtered.map((book) => (
                  <tr key={book._id} className="hover:bg-base-200/40 transition-colors">
                    <td className="px-5 py-3">
                      <div className="w-8 h-11 rounded-md overflow-hidden bg-base-200">
                        {book.imageURL
                          ? <img src={book.imageURL} alt={book.title} className="w-full h-full object-cover" />
                          : <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
                        }
                      </div>
                    </td>
                    <td className="px-5 py-3 font-medium text-base-content max-w-[160px] truncate">{book.title}</td>
                    <td className="px-5 py-3 text-base-content/70">{book.author}</td>
                    <td className="px-5 py-3 text-base-content/50 max-w-[140px] truncate text-xs">{book.librarianEmail || '—'}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[book.status] || 'bg-base-200 text-base-content'}`}>
                        {book.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        {book.status === 'Published' && (
                          <button
                            onClick={() => handleUnpublish(book._id)}
                            title="Unpublish"
                            className="w-8 h-8 rounded-lg bg-warning/10 text-warning/70 hover:bg-warning/20 hover:text-warning flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <EyeOff size={13} />
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteId(book._id)}
                          title="Delete"
                          className="w-8 h-8 rounded-lg bg-error/10 text-error/70 hover:bg-error/20 hover:text-error flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
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

      {deleteId && (
        <div className="modal modal-open">
          <div className="modal-box rounded-2xl bg-base-100">
            <h3 className="font-display text-lg text-base-content mb-2">Delete Book</h3>
            <p className="text-base-content/60 text-sm mb-6">Permanently delete this book from the platform?</p>
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

export default ManageAllBooks
