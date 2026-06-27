import { useEffect, useState } from 'react'
import { Edit2, Trash2, Eye, EyeOff, BookCopy } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAxiosSecure } from '../../../hooks/useAxiosSecure'
import { uploadImage } from '../../../utils/uploadImage'

const CATEGORIES = ['Fiction', 'Sci-Fi', 'Academic', 'History', 'Biography', 'Technology', 'Children', 'Other']

const statusStyle = {
  'Pending Approval': 'badge-warning',
  Published: 'badge-success',
  Unpublished: 'badge-neutral',
  'Checked Out': 'badge-info',
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

  if (loading) return <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 bg-base-200 rounded-xl animate-pulse" />)}</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold">Manage Inventory</h1>
        <span className="badge badge-neutral">{books.length} books</span>
      </div>

      {books.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-base-content/40 gap-4">
          <BookCopy size={48} />
          <p className="text-lg font-semibold">No books listed yet</p>
        </div>
      ) : (
        <div className="card bg-base-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Cover</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Fee</th>
                  <th>Status</th>
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
                    <td><span className="badge badge-sm badge-secondary">{book.category}</span></td>
                    <td className="text-primary font-semibold">${book.deliveryFee}</td>
                    <td>
                      <span className={`badge badge-sm ${statusStyle[book.status] || 'badge-ghost'}`}>
                        {book.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(book)} className="btn btn-ghost btn-xs" title="Edit">
                          <Edit2 size={13} />
                        </button>
                        {(book.status === 'Published' || book.status === 'Unpublished') && (
                          <button onClick={() => handleToggle(book)} className="btn btn-ghost btn-xs" title={book.status === 'Published' ? 'Unpublish' : 'Publish'}>
                            {book.status === 'Published' ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>
                        )}
                        <button onClick={() => setDeleteId(book._id)} className="btn btn-ghost btn-xs text-error" title="Delete">
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

      {/* Edit Modal */}
      {editBook && (
        <div className="modal modal-open">
          <div className="modal-box rounded-2xl max-w-lg">
            <h3 className="font-bold text-lg mb-4">Edit Book</h3>
            <form onSubmit={handleSubmit(handleEditSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label pb-1"><span className="label-text text-xs">Title</span></label>
                  <input className="input input-bordered w-full input-sm" {...register('title', { required: true })} />
                </div>
                <div>
                  <label className="label pb-1"><span className="label-text text-xs">Author</span></label>
                  <input className="input input-bordered w-full input-sm" {...register('author', { required: true })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label pb-1"><span className="label-text text-xs">Category</span></label>
                  <select className="select select-bordered w-full select-sm" {...register('category', { required: true })}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label pb-1"><span className="label-text text-xs">Delivery Fee ($)</span></label>
                  <input type="number" min={1} step="0.01" className="input input-bordered w-full input-sm" {...register('deliveryFee', { required: true, min: 1 })} />
                </div>
              </div>
              <div>
                <label className="label pb-1"><span className="label-text text-xs">Description</span></label>
                <textarea className="textarea textarea-bordered w-full text-sm" rows={3} {...register('description', { required: true, minLength: 50 })} />
              </div>
              <div>
                <label className="label pb-1"><span className="label-text text-xs">Cover Image</span></label>
                <div className="flex items-center gap-3">
                  {editImageURL && <img src={editImageURL} alt="cover" className="w-12 h-14 object-cover rounded-lg" />}
                  <label className="btn btn-ghost btn-sm gap-1 cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={handleEditUpload} />
                    {uploading ? <span className="loading loading-spinner loading-xs" /> : 'Change image'}
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setEditBook(null); reset() }}>Cancel</button>
                <button type="submit" disabled={submitting} className="btn btn-primary btn-sm">
                  {submitting ? <span className="loading loading-spinner loading-xs" /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop" onClick={() => { setEditBook(null); reset() }} />
        </div>
      )}

      {/* Delete modal */}
      {deleteId && (
        <div className="modal modal-open">
          <div className="modal-box rounded-2xl">
            <h3 className="font-bold text-lg mb-2">Delete Book</h3>
            <p className="text-base-content/60 mb-6">Are you sure? This cannot be undone.</p>
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

export default ManageInventory
