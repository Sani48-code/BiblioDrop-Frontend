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
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-base-content">My Wishlist</h1>
        <span className="text-sm text-base-content/40">{items.length} saved</span>
      </div>

      {items.length === 0 ? (
        <div className="bg-base-100 border border-base-200 rounded-2xl p-16 text-center">
          <Heart size={40} className="text-base-content/20 mx-auto mb-3" />
          <p className="text-base-content/40 text-sm mb-4">Your wishlist is empty</p>
          <Link to="/browse" className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-md shadow-primary/20 cursor-pointer">
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((item) => {
            const book = item.book || item
            const bookId = item.bookId || item._id
            return (
              <div key={bookId} className="group bg-base-100 border border-base-200 rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 transition-all">
                <Link to={`/books/${book._id || bookId}`} className="block relative overflow-hidden aspect-[3/4]">
                  {book.imageURL ? (
                    <img
                      src={book.imageURL}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <BookOpen size={32} className="text-primary/40" />
                    </div>
                  )}
                  <button
                    onClick={(e) => { e.preventDefault(); handleRemove(bookId) }}
                    className="absolute top-2 right-2 w-8 h-8 bg-error text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error/90 cursor-pointer shadow-sm"
                    title="Remove from wishlist"
                  >
                    <Heart size={14} fill="currentColor" />
                  </button>
                </Link>
                <div className="p-4">
                  <p className="font-semibold text-sm line-clamp-2 text-base-content leading-snug">{book.title}</p>
                  <p className="text-xs text-base-content/50 mt-1">{book.author}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-display font-bold text-primary">৳{book.deliveryFee || 0}</span>
                    <Link
                      to={`/books/${book._id || bookId}`}
                      className="text-xs text-base-content/50 hover:text-primary transition-colors cursor-pointer"
                    >
                      View details →
                    </Link>
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
