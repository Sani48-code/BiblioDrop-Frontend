import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, BookOpen } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAxiosSecure } from '../../../hooks/useAxiosSecure'

const Wishlist = () => {
  const axiosSecure = useAxiosSecure()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosSecure.get('/api/wishlist')
      .then((res) => setItems(res.data?.wishlist || res.data || []))
      .catch(() => toast.error('Failed to load wishlist'))
      .finally(() => setLoading(false))
  }, [])

  const handleRemove = async (bookId) => {
    try {
      await axiosSecure.delete(`/api/wishlist/${bookId}`)
      setItems((w) => w.filter((item) => (item.bookId || item._id) !== bookId))
      toast.success('Removed from wishlist')
    } catch {
      toast.error('Failed to remove')
    }
  }

  if (loading) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-64 bg-base-200 rounded-2xl animate-pulse" />)}
    </div>
  )

  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-6">My Wishlist</h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-base-content/40 gap-4">
          <Heart size={48} />
          <p className="text-lg font-semibold">Your wishlist is empty</p>
          <Link to="/browse" className="btn btn-primary btn-sm mt-2">Browse Books</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((item) => {
            const book = item.book || item
            const bookId = item.bookId || item._id
            return (
              <div key={bookId} className="card bg-base-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
                <Link to={`/books/${book._id || bookId}`}>
                  <img
                    src={book.imageURL || 'https://placehold.co/400x240/e2e8f0/1e293b?text=📚'}
                    alt={book.title}
                    className="w-full h-44 object-cover"
                  />
                </Link>
                <div className="p-4">
                  <p className="font-semibold text-sm truncate">{book.title}</p>
                  <p className="text-xs text-base-content/60 mb-3">{book.author}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-semibold text-sm">${book.deliveryFee}</span>
                    <button
                      onClick={() => handleRemove(bookId)}
                      className="btn btn-ghost btn-xs text-error gap-1"
                    >
                      <Heart size={12} fill="currentColor" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Wishlist
