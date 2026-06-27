import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Heart, ShoppingCart, Edit2, Trash2, EyeOff, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { useAuth } from '../contexts/AuthContext'
import StarRating from '../components/StarRating'
import LoadingSpinner from '../components/LoadingSpinner'

const API = import.meta.env.VITE_API_URL

const BookDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [inWishlist, setInWishlist] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const [payLoading, setPayLoading] = useState(false)
  const [reviews, setReviews] = useState([])
  const [canReview, setCanReview] = useState(false)
  const [userReview, setUserReview] = useState(null)
  const [reviewRating, setReviewRating] = useState(0)
  const [editingReview, setEditingReview] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const { register, handleSubmit, reset, setValue } = useForm()

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/api/books/${id}`),
      axios.get(`${API}/api/reviews?bookId=${id}`).catch(() => ({ data: [] })),
    ]).then(([bookRes, reviewRes]) => {
      setBook(bookRes.data)
      const revs = reviewRes.data?.reviews || reviewRes.data || []
      setReviews(revs)
    }).catch(() => toast.error('Failed to load book details'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!user || !book) return
    axios.get(`${API}/api/wishlist`, { withCredentials: true })
      .then((res) => {
        const list = res.data?.wishlist || res.data || []
        setInWishlist(list.some((w) => (w.bookId || w._id) === id))
      }).catch(() => {})

    if (user.role === 'user') {
      axios.get(`${API}/api/orders/check-delivered?bookId=${id}`, { withCredentials: true })
        .then((res) => setCanReview(res.data?.canReview || false))
        .catch(() => {})

      const myRev = reviews.find((r) => r.userId === user._id || r.userEmail === user.email)
      setUserReview(myRev || null)
    }
  }, [user, book, reviews, id])

  if (loading) return <LoadingSpinner />
  if (!book) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-base-content/60">Book not found</p>
    </div>
  )

  const isOwner = user && book.librarianId === user._id
  const isAdmin = user?.role === 'admin'
  const isAvailable = book.status === 'Published'

  const handleWishlist = async () => {
    if (!user) return toast.error('Please login to add to wishlist')
    setWishlistLoading(true)
    try {
      if (inWishlist) {
        await axios.delete(`${API}/api/wishlist/${id}`, { withCredentials: true })
        setInWishlist(false)
        toast.success('Removed from wishlist')
      } else {
        await axios.post(`${API}/api/wishlist`, { bookId: id }, { withCredentials: true })
        setInWishlist(true)
        toast.success('Added to wishlist')
      }
    } catch {
      toast.error('Wishlist action failed')
    } finally {
      setWishlistLoading(false)
    }
  }

  const handleRequestDelivery = async () => {
    if (!user) return toast.error('Please login to request delivery')
    setPayLoading(true)
    try {
      const res = await axios.post(
        `${API}/api/stripe/create-checkout-session`,
        { bookId: id },
        { withCredentials: true }
      )
      window.location.href = res.data.url
    } catch {
      toast.error('Payment initiation failed')
    } finally {
      setPayLoading(false)
    }
  }

  const handleDeleteBook = async () => {
    try {
      await axios.delete(`${API}/api/books/${id}`, { withCredentials: true })
      toast.success('Book deleted')
      navigate('/browse')
    } catch {
      toast.error('Delete failed')
    }
    setDeleteModalOpen(false)
  }

  const handleToggleStatus = async () => {
    const action = book.status === 'Published' ? 'unpublish' : 'publish'
    try {
      await axios.patch(`${API}/api/books/${id}/${action}`, {}, { withCredentials: true })
      setBook((b) => ({ ...b, status: action === 'publish' ? 'Published' : 'Unpublished' }))
      toast.success(`Book ${action}ed`)
    } catch {
      toast.error('Action failed')
    }
  }

  const handleSubmitReview = async (data) => {
    if (!reviewRating) return toast.error('Please select a star rating')
    try {
      await axios.post(
        `${API}/api/reviews`,
        { bookId: id, rating: reviewRating, comment: data.comment },
        { withCredentials: true }
      )
      toast.success('Review submitted!')
      reset()
      setReviewRating(0)
      const res = await axios.get(`${API}/api/reviews?bookId=${id}`)
      setReviews(res.data?.reviews || res.data || [])
    } catch {
      toast.error('Failed to submit review')
    }
  }

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(`${API}/api/reviews/${reviewId}`, { withCredentials: true })
      setReviews((r) => r.filter((rev) => rev._id !== reviewId))
      toast.success('Review deleted')
    } catch {
      toast.error('Failed to delete review')
    }
  }

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : 0

  const requestBtnDisabled =
    !isAvailable || !user || isOwner || payLoading

  const requestBtnTitle = !isAvailable
    ? 'Currently unavailable'
    : !user
    ? 'Login to request delivery'
    : isOwner
    ? 'You own this book'
    : ''

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        {/* Left: image */}
        <div>
          <div className="relative rounded-2xl overflow-hidden shadow-lg">
            <img
              src={book.imageURL || 'https://placehold.co/600x400/e2e8f0/1e293b?text=No+Cover'}
              alt={book.title}
              className="w-full h-96 object-cover"
            />
            <span className={`absolute top-3 right-3 badge ${isAvailable ? 'badge-success' : 'badge-error'}`}>
              {isAvailable ? 'Available' : 'Checked Out'}
            </span>
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            disabled={wishlistLoading}
            className={`btn btn-outline mt-4 gap-2 w-full rounded-xl ${inWishlist ? 'border-error text-error' : ''}`}
          >
            <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
            {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          </button>
        </div>

        {/* Right: details */}
        <div className="flex flex-col gap-4">
          <div>
            <span className="badge badge-secondary mb-2">{book.category}</span>
            <h1 className="text-3xl font-display font-bold text-base-content mb-1">{book.title}</h1>
            <p className="text-base-content/60 text-sm">by {book.author}</p>
            <p className="text-xs text-base-content/40 mt-1">
              Added: {book.createdAt ? new Date(book.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>

          {reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <StarRating value={Math.round(avgRating)} readOnly size="sm" />
              <span className="text-sm text-base-content/60">{avgRating} ({reviews.length} reviews)</span>
            </div>
          )}

          <p className="text-base-content/70 leading-relaxed text-sm">{book.description}</p>

          <div className="mt-2">
            <p className="text-xs text-base-content/50 uppercase tracking-wider mb-1">Delivery Fee</p>
            <p className="text-3xl font-bold text-primary">${book.deliveryFee}</p>
          </div>

          <div title={requestBtnTitle}>
            <button
              onClick={handleRequestDelivery}
              disabled={requestBtnDisabled}
              className="btn btn-primary btn-wide rounded-xl gap-2"
            >
              {payLoading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <ShoppingCart size={18} />
              )}
              Request Delivery
            </button>
            {requestBtnTitle && (
              <p className="text-xs text-base-content/50 mt-1">{requestBtnTitle}</p>
            )}
          </div>

          {/* Librarian owner controls */}
          {isOwner && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-base-300">
              <button className="btn btn-ghost btn-sm gap-1">
                <Edit2 size={14} /> Edit
              </button>
              {(book.status === 'Published' || book.status === 'Unpublished') && (
                <button onClick={handleToggleStatus} className="btn btn-ghost btn-sm gap-1">
                  {book.status === 'Published' ? <EyeOff size={14} /> : <Eye size={14} />}
                  {book.status === 'Published' ? 'Unpublish' : 'Publish'}
                </button>
              )}
              <button
                onClick={() => setDeleteModalOpen(true)}
                className="btn btn-ghost btn-sm text-error gap-1"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}

          {/* Admin controls */}
          {isAdmin && !isOwner && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-base-300">
              <button onClick={handleToggleStatus} className="btn btn-warning btn-sm gap-1">
                <EyeOff size={14} /> Force Unpublish
              </button>
              <button
                onClick={() => setDeleteModalOpen(true)}
                className="btn btn-error btn-sm gap-1"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t border-base-300 pt-10">
        <div className="flex items-center gap-4 mb-6">
          <h3 className="text-2xl font-display font-semibold">Reader Reviews</h3>
          {reviews.length > 0 && (
            <span className="badge badge-secondary">{reviews.length} reviews</span>
          )}
        </div>

        {/* Review form */}
        {user?.role === 'user' && canReview && !userReview && (
          <form onSubmit={handleSubmit(handleSubmitReview)} className="card bg-base-200 p-6 rounded-2xl mb-8 shadow-sm">
            <h4 className="font-semibold mb-3">Write a Review</h4>
            <div className="mb-3">
              <StarRating value={reviewRating} onChange={setReviewRating} />
            </div>
            <textarea
              {...register('comment', { required: true })}
              placeholder="Share your thoughts about this book..."
              className="textarea textarea-bordered w-full mb-3"
              rows={3}
            />
            <button type="submit" className="btn btn-primary btn-sm">
              Submit Review
            </button>
          </form>
        )}

        {/* User's own review */}
        {userReview && (
          <div className="card bg-primary/5 border border-primary/20 p-5 rounded-2xl mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm">Your Review</span>
              <div className="flex gap-2">
                <button onClick={() => setEditingReview(true)} className="btn btn-ghost btn-xs"><Edit2 size={12} /></button>
                <button onClick={() => handleDeleteReview(userReview._id)} className="btn btn-ghost btn-xs text-error"><Trash2 size={12} /></button>
              </div>
            </div>
            <StarRating value={userReview.rating} readOnly size="sm" />
            <p className="text-sm mt-2 text-base-content/70">{userReview.comment}</p>
          </div>
        )}

        {reviews.length === 0 && (
          <div className="text-center py-12 text-base-content/40">
            <p>No reviews yet. Be the first to review this book!</p>
          </div>
        )}

        <div className="space-y-4">
          {reviews
            .filter((r) => r._id !== userReview?._id)
            .map((rev) => (
              <div key={rev._id} className="card bg-base-200 p-5 rounded-2xl">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                    {rev.userName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">{rev.userName || 'Anonymous'}</span>
                      <span className="text-xs text-base-content/40">
                        {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : ''}
                      </span>
                    </div>
                    <StarRating value={rev.rating} readOnly size="sm" />
                    <p className="text-sm mt-1 text-base-content/70">{rev.comment}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Delete confirm modal */}
      {deleteModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box rounded-2xl">
            <h3 className="font-bold text-lg mb-2">Delete Book</h3>
            <p className="text-base-content/60 mb-6">
              Are you sure you want to delete <strong>{book.title}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button className="btn btn-ghost" onClick={() => setDeleteModalOpen(false)}>Cancel</button>
              <button className="btn btn-error" onClick={handleDeleteBook}>Delete</button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setDeleteModalOpen(false)} />
        </div>
      )}
    </div>
  )
}

export default BookDetails
