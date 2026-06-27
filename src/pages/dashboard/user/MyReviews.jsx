import { useEffect, useState } from 'react'
import { Edit2, Trash2, Star } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAxiosSecure } from '../../../hooks/useAxiosSecure'
import StarRating from '../../../components/StarRating'

const MyReviews = () => {
  const axiosSecure = useAxiosSecure()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editRating, setEditRating] = useState(0)
  const [deleteId, setDeleteId] = useState(null)

  const { register, handleSubmit, reset, setValue } = useForm()

  useEffect(() => {
    axiosSecure.get('/api/reviews/my-reviews')
      .then((res) => setReviews(res.data?.reviews || res.data || []))
      .catch(() => toast.error('Failed to load reviews'))
      .finally(() => setLoading(false))
  }, [])

  const startEdit = (rev) => {
    setEditingId(rev._id)
    setEditRating(rev.rating)
    setValue('editComment', rev.comment)
  }

  const handleEditSubmit = async (data) => {
    try {
      await axiosSecure.patch(`/api/reviews/${editingId}`, { rating: editRating, comment: data.editComment })
      setReviews((r) => r.map((rev) => rev._id === editingId ? { ...rev, rating: editRating, comment: data.editComment } : rev))
      toast.success('Review updated')
      setEditingId(null)
      reset()
    } catch {
      toast.error('Update failed')
    }
  }

  const handleDelete = async () => {
    try {
      await axiosSecure.delete(`/api/reviews/${deleteId}`)
      setReviews((r) => r.filter((rev) => rev._id !== deleteId))
      toast.success('Review deleted')
    } catch {
      toast.error('Delete failed')
    }
    setDeleteId(null)
  }

  if (loading) return <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-28 bg-base-200 rounded-2xl animate-pulse" />)}</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-base-content">My Reviews</h1>
        <span className="text-sm text-base-content/40">{reviews.length} reviews</span>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-base-100 border border-base-200 rounded-2xl p-16 text-center">
          <Star size={40} className="text-base-content/20 mx-auto mb-3" />
          <p className="text-base-content/40 text-sm">You can review books you&apos;ve received</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev._id} className="bg-base-100 border border-base-200 rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-16 rounded-xl overflow-hidden bg-base-200 shrink-0">
                  {rev.bookImageURL ? (
                    <img src={rev.bookImageURL} alt={rev.bookTitle} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-sm line-clamp-1 text-base-content">{rev.bookTitle}</p>
                      <StarRating value={rev.rating} readOnly size="sm" />
                      <p className="text-xs text-base-content/40 mt-0.5">
                        {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}
                      </p>
                    </div>
                    {editingId !== rev._id && (
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => startEdit(rev)}
                          title="Edit review"
                          className="w-8 h-8 rounded-lg bg-base-200 hover:bg-base-300 flex items-center justify-center text-base-content/60 hover:text-base-content transition-colors cursor-pointer"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteId(rev._id)}
                          title="Delete review"
                          className="w-8 h-8 rounded-lg bg-error/10 hover:bg-error/20 flex items-center justify-center text-error/70 hover:text-error transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </div>

                  {editingId === rev._id ? (
                    <form onSubmit={handleSubmit(handleEditSubmit)} className="mt-3 space-y-3">
                      <StarRating value={editRating} onChange={setEditRating} size="sm" />
                      <textarea
                        {...register('editComment', { required: true })}
                        className="w-full border border-base-300 focus:border-primary rounded-xl px-4 py-3 text-sm bg-base-100 outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <button type="submit" className="px-4 py-1.5 bg-primary text-primary-content text-xs rounded-lg font-medium cursor-pointer hover:opacity-90">Save</button>
                        <button type="button" onClick={() => setEditingId(null)} className="px-4 py-1.5 border border-base-300 text-base-content/60 text-xs rounded-lg cursor-pointer hover:border-base-400">Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <p className="text-sm text-base-content/60 mt-2 leading-relaxed">{rev.comment}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteId && (
        <div className="modal modal-open">
          <div className="modal-box rounded-2xl">
            <h3 className="font-display text-lg text-base-content mb-2">Delete Review</h3>
            <p className="text-base-content/60 text-sm mb-6">Are you sure you want to delete this review?</p>
            <div className="flex justify-end gap-3">
              <button className="border border-base-300 text-base-content/60 px-5 py-2 rounded-xl text-sm hover:border-base-400 cursor-pointer" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="bg-error text-white px-5 py-2 rounded-xl text-sm cursor-pointer hover:opacity-90" onClick={handleDelete}>Delete</button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setDeleteId(null)} />
        </div>
      )}
    </div>
  )
}

export default MyReviews
