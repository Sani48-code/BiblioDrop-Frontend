import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { useAxiosSecure } from '../../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'

const ReadingList = () => {
  const axiosSecure = useAxiosSecure()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosSecure.get('/api/orders/my-orders')
      .then((res) => {
        const orders = res.data?.orders || res.data || []
        setBooks(orders.filter((o) => o.status === 'Delivered'))
      })
      .catch(() => toast.error('Failed to load reading list'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-64 bg-base-200 rounded-2xl animate-pulse" />
      ))}
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-base-content">Reading List</h1>
        <span className="text-sm text-base-content/40">{books.length} books read</span>
      </div>

      {books.length === 0 ? (
        <div className="bg-base-100 border border-base-200 rounded-2xl p-16 text-center">
          <BookOpen size={40} className="text-base-content/20 mx-auto mb-3" />
          <p className="text-base-content/40 text-sm">Books you receive will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {books.map((order) => (
            <Link
              key={order._id}
              to={`/books/${order.bookId || order.book?._id}`}
              className="group bg-base-100 border border-base-200 rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className="aspect-[2/3] overflow-hidden bg-base-200">
                {order.bookImageURL || order.book?.coverImage ? (
                  <img
                    src={order.bookImageURL || order.book?.coverImage}
                    alt={order.bookTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <BookOpen size={32} className="text-primary/40" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="font-semibold text-sm line-clamp-2 text-base-content leading-snug">
                  {order.bookTitle || order.book?.title}
                </p>
                <p className="text-xs text-base-content/40 mt-1">
                  {order.updatedAt ? new Date(order.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default ReadingList
