import { useEffect, useState } from 'react'
import { Edit2, Trash2, Eye, EyeOff, BookCopy } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAxiosSecure } from '../../../hooks/useAxiosSecure'
import { uploadImage } from '../../../utils/uploadImage'

const CATEGORIES = ['Fiction', 'Sci-Fi', 'Academic', 'History', 'Biography', 'Technology', 'Children', 'Other']

const STATUS_STYLE = {
  'Pending Approval': 'bg-warning/10 text-warning',
  Published: 'bg-success/10 text-success',
  Unpublished: 'bg-base-300 text-base-content/60',
  'Checked Out': 'bg-info/10 text-info',
}

const ManageInventory = () => {
  const axiosSecure = useAxiosSecure()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [editBook, setEditBook] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [editImageURL, setEditImageURL] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm()

  const fetchBooks = () => {
    axiosSecure.get('/api/books/my-books')
      .then((res) => setBooks(res.data?.books || res.data || []))
      .catch(() => toast.error('Failed to load books'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchBooks() }, [])

  const openEdit = (book) => {
    setEditBook(book)
    setEditImageURL(book.imageURL || '')
    setValue('title', book.title)
    setValue('author', book.author)
    setValue('category', book.category)
    setValue('description', book.description)
    setValue('deliveryFee', book.deliveryFee)
  }

  const handleEditUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file)
      setEditImageURL(url)
      toast.success('Image uploaded')
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleEditSubmit = async (data) => {
    setSubmitting(true)
    try {
      await axiosSecure.patch(`/api/books/${editBook._id}`, { ...data, imageURL: editImageURL, deliveryFee: Number(data.deliveryFee) })
      toast.success('Book updated')
      fetchBooks()
      setEditBook(null)
      reset()
    } catch {
      toast.error('Update failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    try {
      await axiosSecure.delete(`/api/books/${deleteId}`)
      setBooks((b) => b.filter((bk) => bk._id !== deleteId))
      toast.success('Book deleted')
    } catch {
      toast.error('Delete failed')
    }
    setDeleteId(null)
  }

  const handleToggle = async (book) => {
    const action = book.status === 'Published' ? 'unpublish' : 'publish'
    try {
      await axiosSecure.patch(`/api/books/${book._id}/${action}`)
      fetchBooks()
      toast.success(`Book ${action}ed`)
    } catch {
      toast.error('Action failed')
    }
  }

  if (loading) return <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 bg-base-200 rounded-2xl animate-pulse" />)}</div>

  const ActionBtn = ({ onClick, title, children, danger }) => (
    <button
      onClick={onClick}
      title={title}
      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${danger ? 'bg-error/10 text-error/70 hover:bg-error/20 hover:text-error' : 'bg-base-200 text-base-content/50 hover:bg-base-300 hover:text-base-content'}`}
    >
      {children}
    </button>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-base-content">Manage Inventory</h1>
        <span className="text-sm text-base-content/40">{books.length} books</span>
      </div>

      {books.length === 0 ? (
        <div className="bg-base-100 border border-base-200 rounded-2xl p-16 text-center">
          <BookCopy size={40} className="text-base-content/20 mx-auto mb-3" />
          <p className="text-base-content/40 text-sm">No books listed yet</p>
        </div>
      ) : (
        <div className="bg-base-100 border border-base-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-base-200 border-b border-base-300">
                  {['Cover', 'Title', 'Category', 'Fee', 'Status', ''].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-base-content/50">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200">
                {books.map((book) => (
                  <tr key={book._id} className="hover:bg-base-200/40 transition-colors">
                    <td className="px-5 py-3">
                      <div className="w-8 h-11 rounded-md overflow-hidden bg-base-200">
                        {book.imageURL
                          ? <img src={book.imageURL} alt={book.title} className="w-full h-full object-cover" />
                          : <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
                        }
                      </div>
                    </td>
                    <td className="px-5 py-3 font-medium text-base-content max-w-[180px] truncate">{book.title}</td>
                    <td className="px-5 py-3">
                      <span className="text-xs bg-base-200 text-base-content/60 px-2 py-1 rounded-full">{book.category}</span>
                    </td>
                    <td className="px-5 py-3 font-semibold text-base-content">৳{book.deliveryFee}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[book.status] || 'bg-base-200 text-base-content'}`}>
                        {book.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <ActionBtn onClick={() => openEdit(book)} title="Edit book">
                          <Edit2 size={13} />
                        </ActionBtn>
                        {(book.status === 'Published' || book.status === 'Unpublished') && (
                          <ActionBtn onClick={() => handleToggle(book)} title={book.status === 'Published' ? 'Unpublish' : 'Publish'}>
                            {book.status === 'Published' ? <EyeOff size={13} /> : <Eye size={13} />}
                          </ActionBtn>
                        )}
                        <ActionBtn onClick={() => setDeleteId(book._id)} title="Delete book" danger>
                          <Trash2 size={13} />
                        </ActionBtn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editBook && (
        <div className="modal modal-open">
          <div className="modal-box rounded-2xl max-w-lg bg-base-100">
            <h3 className="font-display text-lg text-base-content mb-4">Edit Book</h3>
            <form onSubmit={handleSubmit(handleEditSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[['title', 'Title'], ['author', 'Author']].map(([key, label]) => (
                  <div key={key}>
                    <label className="text-xs font-medium text-base-content/60 block mb-1">{label}</label>
                    <input className="w-full border border-base-300 focus:border-primary rounded-xl px-3 py-2 text-sm bg-base-100 outline-none focus:ring-2 focus:ring-primary/20" {...register(key, { required: true })} />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-base-content/60 block mb-1">Category</label>
                  <select className="w-full border border-base-300 focus:border-primary rounded-xl px-3 py-2 text-sm bg-base-100 outline-none focus:ring-2 focus:ring-primary/20" {...register('category', { required: true })}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-base-content/60 block mb-1">Delivery Fee (৳)</label>
                  <input type="number" min={1} step="0.01" className="w-full border border-base-300 focus:border-primary rounded-xl px-3 py-2 text-sm bg-base-100 outline-none focus:ring-2 focus:ring-primary/20" {...register('deliveryFee', { required: true, min: 1 })} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-base-content/60 block mb-1">Description</label>
                <textarea className="w-full border border-base-300 focus:border-primary rounded-xl px-3 py-2 text-sm bg-base-100 outline-none focus:ring-2 focus:ring-primary/20 resize-none" rows={3} {...register('description', { required: true, minLength: 50 })} />
              </div>
              <div>
                <label className="text-xs font-medium text-base-content/60 block mb-1">Cover Image</label>
                <div className="flex items-center gap-3">
                  {editImageURL && <img src={editImageURL} alt="cover" className="w-10 h-14 object-cover rounded-lg border border-base-300" />}
                  <label className="flex items-center gap-2 border border-base-300 hover:border-primary text-sm text-base-content/60 px-3 py-2 rounded-xl cursor-pointer transition-colors">
                    <input type="file" accept="image/*" className="hidden" onChange={handleEditUpload} />
                    {uploading ? <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /> : 'Change image'}
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" className="border border-base-300 text-base-content/60 px-4 py-2 rounded-xl text-sm cursor-pointer hover:border-base-400" onClick={() => { setEditBook(null); reset() }}>Cancel</button>
                <button type="submit" disabled={submitting} className="bg-primary text-primary-content px-5 py-2 rounded-xl text-sm font-medium cursor-pointer hover:opacity-90 disabled:opacity-50">
                  {submitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop" onClick={() => { setEditBook(null); reset() }} />
        </div>
      )}

      {deleteId && (
        <div className="modal modal-open">
          <div className="modal-box rounded-2xl bg-base-100">
            <h3 className="font-display text-lg text-base-content mb-2">Delete Book</h3>
            <p className="text-base-content/60 text-sm mb-6">Are you sure? This cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button className="border border-base-300 text-base-content/60 px-5 py-2 rounded-xl text-sm cursor-pointer hover:border-base-400" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="bg-error text-white px-5 py-2 rounded-xl text-sm cursor-pointer hover:opacity-90" onClick={handleDelete}>Delete</button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setDeleteId(null)} />
        </div>
      )}
    </div>
  )
}

export default ManageInventory
