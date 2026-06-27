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
      <h1 className="text-2xl font-display font-bold mb-6">My Reviews</h1>

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-base-content/40 gap-4">
          <Star size={48} />
          <p className="text-lg font-semibold">No reviews yet</p>
          <p className="text-sm">You can review books you&apos;ve received</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev._id} className="card bg-base-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <img
                  src={rev.bookImageURL || 'https://placehold.co/60x80/e2e8f0/1e293b?text=📚'}
                  alt={rev.bookTitle}
                  className="w-14 h-18 object-cover rounded-lg shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-sm truncate">{rev.bookTitle}</p>
                      <StarRating value={rev.rating} readOnly size="sm" />
                      <p className="text-xs text-base-content/40 mt-0.5">
                        {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : ''}
                      </p>
                    </div>
                    {editingId !== rev._id && (
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => startEdit(rev)} className="btn btn-ghost btn-xs"><Edit2 size={13} /></button>
                        <button onClick={() => setDeleteId(rev._id)} className="btn btn-ghost btn-xs text-error"><Trash2 size={13} /></button>
                      </div>
                    )}
                  </div>

                  {editingId === rev._id ? (
                    <form onSubmit={handleSubmit(handleEditSubmit)} className="mt-3 space-y-2">
                      <StarRating value={editRating} onChange={setEditRating} size="sm" />
                      <textarea
                        {...register('editComment', { required: true })}
                        className="textarea textarea-bordered w-full text-sm"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <button type="submit" className="btn btn-primary btn-xs">Save</button>
                        <button type="button" onClick={() => setEditingId(null)} className="btn btn-ghost btn-xs">Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <p className="text-sm text-base-content/70 mt-2">{rev.comment}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete modal */}
      {deleteId && (
        <div className="modal modal-open">
          <div className="modal-box rounded-2xl">
            <h3 className="font-bold text-lg mb-2">Delete Review</h3>
            <p className="text-base-content/60 mb-6">Are you sure you want to delete this review?</p>
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

export default MyReviews
