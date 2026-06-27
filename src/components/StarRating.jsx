import { useState } from 'react'

const sizes = { sm: 16, md: 20, lg: 26 }

const StarIcon = ({ size, filled }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? '#F59E0B' : 'none'} stroke={filled ? '#F59E0B' : '#D1D5DB'} strokeWidth="1.5">
    <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
)

const StarRating = ({ value = 0, onChange, readOnly = false, size = 'md' }) => {
  const [hover, setHover] = useState(0)
  const px = sizes[size] || 20

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && onChange && onChange(star)}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(0)}
          className={`focus:outline-none ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'}`}
          aria-label={`${star} star`}
        >
          <StarIcon size={px} filled={star <= (hover || value)} />
        </button>
      ))}
    </div>
  )
}

export default StarRating
