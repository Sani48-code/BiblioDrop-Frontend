import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'

const BookCard = ({ book }) => {
  const { _id, title, author, imageURL, category, deliveryFee, status } = book
  const isAvailable = status === 'Published' || status === 'available'

  return (
    <div className="group bg-base-100 rounded-2xl overflow-hidden border border-base-200 hover:border-primary/30 hover:-translate-y-2 hover:shadow-xl hover:shadow-black/10 transition-all duration-300">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        {imageURL ? (
          <img
            src={imageURL}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <BookOpen size={48} className="text-primary/40" />
          </div>
        )}
        <span
          className={`absolute top-3 right-3 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm font-medium ${
            isAvailable ? 'bg-success/90' : 'bg-error/90'
          }`}
        >
          {isAvailable ? 'Available' : 'Checked Out'}
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        <span className="inline-block bg-primary/10 text-primary text-xs rounded-full px-2.5 py-0.5 mb-2 font-medium">
          {category}
        </span>
        <h3 className="font-display font-semibold text-base-content text-base leading-snug line-clamp-2 mb-1">
          {title}
        </h3>
        <p className="text-sm text-base-content/60 mb-3">{author}</p>

        <div className="flex items-end justify-between mt-auto">
          <div>
            <p className="text-primary font-semibold text-lg leading-none">৳{deliveryFee}</p>
            <p className="text-xs text-base-content/40 mt-0.5">delivery fee</p>
          </div>
          <Link
            to={`/books/${_id}`}
            className="bg-primary text-primary-content text-sm px-4 py-2 rounded-xl hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BookCard
