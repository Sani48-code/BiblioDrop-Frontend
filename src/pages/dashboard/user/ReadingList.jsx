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
        const delivered = orders.filter((o) => o.status === 'Delivered')
        setBooks(delivered)
      })
      .catch(() => toast.error('Failed to load reading list'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-56 bg-base-200 rounded-2xl animate-pulse" />
      ))}
    </div>
  )

  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-6">Reading List</h1>

      {books.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-base-content/40 gap-4">
          <BookOpen size={48} />
          <p className="text-lg font-semibold">Your reading list is empty</p>
          <p className="text-sm">Books you receive will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {books.map((order) => (
            <Link
              key={order._id}
              to={`/books/${order.bookId}`}
              className="card bg-base-200 rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all"
            >
              <img
                src={order.bookImageURL || 'https://placehold.co/200x260/e2e8f0/1e293b?text=📚'}
                alt={order.bookTitle}
                className="w-full h-44 object-cover"
              />
              <div className="p-3">
                <p className="font-medium text-sm truncate">{order.bookTitle}</p>
                <p className="text-xs text-base-content/50 mt-1">
                  Delivered {order.updatedAt ? new Date(order.updatedAt).toLocaleDateString() : ''}
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
