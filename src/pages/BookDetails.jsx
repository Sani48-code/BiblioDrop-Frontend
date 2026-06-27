import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Heart, ShoppingCart, Edit2, Trash2, EyeOff, Eye, CheckCircle, XCircle, Truck, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { useAuth } from '../contexts/AuthContext'
import { useAxiosSecure } from '../hooks/useAxiosSecure'
import StarRating from '../components/StarRating'
import LoadingSpinner from '../components/LoadingSpinner'
import { BookOpen } from 'lucide-react'

const API = import.meta.env.VITE_API_URL

const BookDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()

  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState([])
  const [inWishlist, setInWishlist] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const [payLoading, setPayLoading] = useState(false)
  const [canReview, setCanReview] = useState(false)
  const [userReview, setUserReview] = useState(null)
  const [reviewRating, setReviewRating] = useState(0)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [editingReview, setEditingReview] = useState(false)
  const [editRating, setEditRating] = useState(0)

  const { register, handleSubmit, reset, setValue } = useForm()

  const fetchReviews = () =>
    axios.get(`${API}/api/reviews?bookId=${id}`).then((res) => {
      const revs = res.data?.reviews || res.data || []
      setReviews(revs)
      if (user) {
        const myRev = revs.find((r) => r.userId === user._id || r.userEmail === user.email)
        setUserReview(myRev || null)
      }
    }).catch(() => {})

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/api/books/${id}`),
      fetchReviews(),
    ]).then(([bookRes]) => {
      setBook(bookRes.data)
    }).catch(() => toast.error('Failed to load book'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!user || !book) return
    axiosSecure.get('/api/wishlist')
      .then((res) => {
        const list = res.data?.wishlist || res.data || []
        setInWishlist(list.some((w) => (w.bookId || w._id) === id))
      }).catch(() => {})
    if (user.role === 'user') {
      axiosSecure.get(`/api/orders/check-delivered?bookId=${id}`)
        .then((res) => setCanReview(res.data?.canReview || false))
        .catch(() => {})
    }
  }, [user, book, id])

  if (loading) return <LoadingSpinner />
  if (!book) return <div className="flex items-center justify-center min-h-[60vh] text-base-content/40">Book not found</div>

  const isOwner = user && book.librarianId === user._id
  const isAdmin = user?.role === 'admin'
  const isAvailable = book.status === 'Published'

  const handleWishlist = async () => {
    if (!user) return toast.error('Please login to add to wishlist')
    setWishlistLoading(true)
    try {
      if (inWishlist) {
        await axiosSecure.delete(`/api/wishlist/${id}`)
        setInWishlist(false)
        toast.success('Removed from wishlist')
      } else {
        await axiosSecure.post('/api/wishlist', { bookId: id })
        setInWishlist(true)
        toast.success('Added to wishlist')
      }
    } catch { toast.error('Failed') }
    finally { setWishlistLoading(false) }
  }

  const handleRequestDelivery = async () => {
    if (!user) return toast.error('Please login first')
    setPayLoading(true)
    try {
      const res = await axiosSecure.post('/api/stripe/create-checkout-session', { bookId: id })
      window.location.href = res.data.url
    } catch { toast.error('Payment initiation failed') }
    finally { setPayLoading(false) }
  }

  const handleDeleteBook = async () => {
    try {
      await axiosSecure.delete(`/api/books/${id}`)
      toast.success('Book deleted')
      navigate('/browse')
    } catch { toast.error('Delete failed') }
    setDeleteModalOpen(false)
  }

  const handleToggleStatus = async () => {
    const action = book.status === 'Published' ? 'unpublish' : 'publish'
    try {
      await axiosSecure.patch(`/api/books/${id}/${action}`)
      setBook((b) => ({ ...b, status: action === 'publish' ? 'Published' : 'Unpublished' }))
      toast.success(`Book ${action}ed`)
    } catch { toast.error('Failed') }
  }

  const handleSubmitReview = async (data) => {
    if (!reviewRating) return toast.error('Please select a rating')
    try {
      await axiosSecure.post('/api/reviews', { bookId: id, rating: reviewRating, comment: data.comment })
      toast.success('Review submitted!')
      reset(); setReviewRating(0)
      await fetchReviews()
    } catch { toast.error('Failed to submit review') }
  }

  const handleDeleteReview = async (reviewId) => {
    try {
      await axiosSecure.delete(`/api/reviews/${reviewId}`)
      await fetchReviews()
      toast.success('Review deleted')
    } catch { toast.error('Failed') }
  }

  const handleEditReview = async (data) => {
    try {
      await axiosSecure.patch(`/api/reviews/${userReview._id}`, { rating: editRating, comment: data.editComment })
      await fetchReviews()
      setEditingReview(false)
      toast.success('Review updated')
    } catch { toast.error('Failed') }
  }

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length
    : 0

  const requestDisabled = !isAvailable || !user || isOwner || payLoading
  const requestTitle = !isAvailable ? 'Currently unavailable'
    : !user ? 'Login to request delivery'
    : isOwner ? 'You own this book' : ''

  return (
    <div className="container-custom py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
        {/* Left — Image (sticky) */}
        <div className="lg:col-span-5">
          <div className="sticky top-24">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[3/4] bg-base-200">
              {book.imageURL ? (
                <img src={book.imageURL} alt={book.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <BookOpen size={64} className="text-primary/30" />
                </div>
              )}
            </div>
            {/* Status pill */}
            <div className={`flex items-center gap-2 mt-4 px-4 py-2.5 rounded-xl w-fit ${isAvailable ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
              {isAvailable ? <CheckCircle size={16} /> : <XCircle size={16} />}
              <span className="text-sm font-medium">{isAvailable ? 'Available for Delivery' : 'Currently Checked Out'}</span>
            </div>
            {/* Wishlist */}
            <button
              onClick={handleWishlist}
              disabled={wishlistLoading}
              className={`flex items-center justify-center gap-2 w-full mt-3 py-3 rounded-xl border-2 transition-all text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                inWishlist
                  ? 'border-error text-error hover:bg-error/5'
                  : 'border-base-300 text-base-content/70 hover:border-primary hover:text-primary'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Heart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
              {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
          </div>
        </div>

        {/* Right — Details */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <div>
            <span className="inline-block bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full mb-3">
              {book.category}
            </span>
            <h1 className="font-display text-3xl sm:text-4xl text-base-content leading-tight mb-1">
              {book.title}
            </h1>
            <p className="text-base-content/60 italic">by {book.author}</p>
            {book.createdAt && (
              <p className="text-xs text-base-content/40 mt-1">
                Added {new Date(book.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            )}
          </div>

          {reviews.length > 0 && (
            <div className="flex items-center gap-3">
              <StarRating value={Math.round(avgRating)} readOnly size="md" />
              <span className="text-sm text-base-content/60">{avgRating.toFixed(1)} ({reviews.length} reviews)</span>
            </div>
          )}

          <p className="text-base-content/70 leading-relaxed">{book.description}</p>

          <div className="bg-base-200 rounded-2xl p-5">
            <p className="text-xs text-base-content/50 uppercase tracking-wider mb-1">Delivery Fee</p>
            <p className="font-display text-4xl font-bold text-primary">৳{book.deliveryFee}</p>
          </div>

          {/* Request button */}
          <div>
            <button
              onClick={handleRequestDelivery}
              disabled={requestDisabled}
              title={requestTitle}
              className={`w-full py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 ${
                requestDisabled
                  ? 'bg-base-300 text-base-content/40 cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 shadow-xl shadow-primary/25'
              } disabled:opacity-60 disabled:pointer-events-none`}
            >
              {payLoading
                ? <span className="loading loading-spinner loading-sm" />
                : <ShoppingCart size={20} />
              }
              {!user ? 'Login to Request' : requestDisabled ? (requestTitle || 'Request Delivery') : 'Request Delivery'}
            </button>
            {requestTitle && <p className="text-xs text-base-content/40 mt-2 text-center">{requestTitle}</p>}
          </div>

          {/* Delivery info */}
          {!requestDisabled && (
            <div className="flex gap-4 text-sm text-base-content/60">
              <div className="flex items-center gap-1.5"><Truck size={14} className="text-primary" /> 2–3 day delivery</div>
              <div className="flex items-center gap-1.5"><Shield size={14} className="text-success" /> Secure payment via Stripe</div>
            </div>
          )}

          {/* Owner controls */}
          {isOwner && (
            <div className="border border-base-300 rounded-2xl p-5">
              <h4 className="font-semibold text-sm mb-4 text-base-content/70">Manage This Book</h4>
              <div className="flex flex-wrap gap-2">
                <button className="btn btn-sm btn-ghost gap-1.5 border border-base-300 rounded-xl cursor-pointer">
                  <Edit2 size={13} /> Edit
                </button>
                {(book.status === 'Published' || book.status === 'Unpublished') && (
                  <button onClick={handleToggleStatus} className="btn btn-sm btn-ghost gap-1.5 border border-base-300 rounded-xl cursor-pointer">
                    {book.status === 'Published' ? <EyeOff size={13} /> : <Eye size={13} />}
                    {book.status === 'Published' ? 'Unpublish' : 'Publish'}
                  </button>
                )}
                <button onClick={() => setDeleteModalOpen(true)} className="btn btn-sm btn-ghost gap-1.5 text-error border border-error/20 rounded-xl cursor-pointer">
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          )}

          {/* Admin controls */}
          {isAdmin && !isOwner && (
            <div className="border border-warning/20 rounded-2xl p-5 bg-warning/5">
              <h4 className="font-semibold text-sm mb-4 text-warning">Admin Controls</h4>
              <div className="flex gap-2">
                <button onClick={handleToggleStatus} className="btn btn-sm btn-warning gap-1.5 rounded-xl cursor-pointer">
                  <EyeOff size={13} /> Force Unpublish
                </button>
                <button onClick={() => setDeleteModalOpen(true)} className="btn btn-sm btn-error gap-1.5 rounded-xl cursor-pointer">
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="border-t border-base-200 pt-12">
        <div className="flex items-center gap-4 mb-8">
          <h3 className="font-display text-2xl">Reader Reviews</h3>
          {reviews.length > 0 && <span className="badge badge-secondary">{reviews.length}</span>}
        </div>

        {/* Review form */}
        {user?.role === 'user' && canReview && !userReview && (
          <form onSubmit={handleSubmit(handleSubmitReview)} className="bg-base-200 rounded-2xl p-6 mb-8">
            <h4 className="font-semibold mb-3">Write a Review</h4>
            <div className="mb-3"><StarRating value={reviewRating} onChange={setReviewRating} size="lg" /></div>
            <textarea
              {...register('comment', { required: true })}
              placeholder="Share your thoughts..."
              className="w-full border border-base-300 focus:border-primary rounded-xl p-3 text-sm outline-none bg-base-100 resize-none mb-3 transition-colors"
              rows={3}
            />
            <button type="submit" className="btn-primary-custom text-sm cursor-pointer">
              Submit Review
            </button>
          </form>
        )}

        {/* Own review */}
        {userReview && (
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-primary">Your Review</span>
              <div className="flex gap-2">
                <button onClick={() => { setEditingReview(true); setEditRating(userReview.rating); setValue('editComment', userReview.comment) }} className="btn btn-ghost btn-xs cursor-pointer"><Edit2 size={12} /></button>
                <button onClick={() => handleDeleteReview(userReview._id)} className="btn btn-ghost btn-xs text-error cursor-pointer"><Trash2 size={12} /></button>
              </div>
            </div>
            {editingReview ? (
              <form onSubmit={handleSubmit(handleEditReview)} className="space-y-3">
                <StarRating value={editRating} onChange={setEditRating} size="sm" />
                <textarea {...register('editComment', { required: true })} className="w-full border border-base-300 focus:border-primary rounded-xl p-3 text-sm outline-none bg-base-100 transition-colors" rows={2} />
                <div className="flex gap-2">
                  <button type="submit" className="btn btn-primary btn-xs cursor-pointer">Save</button>
                  <button type="button" onClick={() => setEditingReview(false)} className="btn btn-ghost btn-xs cursor-pointer">Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <StarRating value={userReview.rating} readOnly size="sm" />
                <p className="text-sm text-base-content/70 mt-2">{userReview.comment}</p>
              </>
            )}
          </div>
        )}

        {reviews.length === 0 && (
          <div className="text-center py-16 text-base-content/40">
            <p className="text-lg">No reviews yet. Be the first!</p>
          </div>
        )}

        <div className="space-y-4">
          {reviews.filter((r) => r._id !== userReview?._id).map((rev) => (
            <div key={rev._id} className="bg-base-200 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {rev.userName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-1 mb-1">
                    <span className="font-semibold text-sm">{rev.userName || 'Anonymous'}</span>
                    <span className="text-xs text-base-content/40">
                      {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <StarRating value={rev.rating} readOnly size="sm" />
                  <p className="text-sm text-base-content/70 mt-1.5">{rev.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete modal */}
      {deleteModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box rounded-2xl">
            <h3 className="font-bold text-lg mb-2">Delete Book</h3>
            <p className="text-base-content/60 mb-6">Permanently delete <strong>{book.title}</strong>? This cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button className="btn btn-ghost cursor-pointer" onClick={() => setDeleteModalOpen(false)}>Cancel</button>
              <button className="btn btn-error cursor-pointer" onClick={handleDeleteBook}>Delete</button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setDeleteModalOpen(false)} />
        </div>
      )}
    </div>
  )
}

export default BookDetails
