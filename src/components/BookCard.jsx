import { Link } from 'react-router-dom'

const BookCard = ({ book }) => {
  const { _id, title, author, imageURL, category, deliveryFee, status } = book

  const isAvailable = status === 'Published' || status === 'available'

  return (
    <div className="card bg-base-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden">
      <figure className="relative h-52">
        <img
          src={imageURL || 'https://placehold.co/400x300/e2e8f0/1e293b?text=No+Cover'}
          alt={title}
          className="w-full h-full object-cover"
        />
        <span
          className={`absolute top-2 right-2 badge text-xs font-semibold ${
            isAvailable ? 'badge-success' : 'badge-error'
          }`}
        >
          {isAvailable ? 'Available' : 'Unavailable'}
        </span>
      </figure>
      <div className="card-body p-4 gap-2">
        <h3 className="font-semibold text-base-content truncate text-sm leading-tight">{title}</h3>
        <p className="text-xs text-base-content/60">{author}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="badge badge-secondary badge-sm">{category}</span>
          <span className="text-primary font-semibold text-sm">${deliveryFee}</span>
        </div>
        <Link
          to={`/books/${_id}`}
          className="btn btn-primary btn-sm mt-2 rounded-lg"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

export default BookCard
