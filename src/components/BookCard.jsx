import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80'

const BookCard = ({ book }) => {
  const { _id, title, author, imageURL, category, deliveryFee, status } = book
  const isAvailable = status === 'Published' || status === 'available'
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="group bg-base-100 rounded-2xl overflow-hidden border border-base-200 hover:border-primary/30 hover:-translate-y-2 hover:shadow-xl hover:shadow-black/10 transition-all duration-300">
      {/* Image */}
      <Link to={`/books/${_id}`} className="relative block h-56 overflow-hidden bg-base-200">
        <img
          src={imageURL || FALLBACK_IMG}
          alt={title}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={(e) => { e.currentTarget.src = FALLBACK_IMG }}
          className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${loaded ? 'blur-0 opacity-100' : 'blur-sm opacity-60'}`}
        />

        {/* Bottom gradient + author name */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
        <p className="absolute bottom-2 left-3 text-white/90 text-xs font-medium truncate max-w-[75%]">{author}</p>

        {/* Hover view details overlay */}
        <div className="absolute inset-0 bg-primary/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-white font-semibold text-sm tracking-wide">View Details →</span>
        </div>

        {/* Category badge — top left */}
        <span className="absolute top-3 left-3 bg-white/85 backdrop-blur-sm text-primary text-xs rounded-full px-2.5 py-1 font-medium">
          {category}
        </span>

        {/* Availability badge — top right */}
        <span className={`absolute top-3 right-3 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm font-medium ${isAvailable ? 'bg-success/90' : 'bg-error/90'}`}>
          {isAvailable ? 'Available' : 'Checked Out'}
        </span>
      </Link>

      {/* Body */}
      <div className="p-4">
        <h3 className="font-display font-semibold text-base-content text-base leading-snug line-clamp-2 mb-3">
          {title}
        </h3>

        <div className="flex items-end justify-between">
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
