import { Star } from 'lucide-react'

const sizeMap = { sm: 14, md: 18, lg: 24 }

const StarRating = ({ value = 0, onChange, readOnly = false, size = 'md' }) => {
  const px = sizeMap[size] || 18

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={px}
          className={
            star <= value
              ? 'text-accent fill-accent cursor-pointer'
              : readOnly
              ? 'text-base-300'
              : 'text-base-300 cursor-pointer hover:text-accent hover:fill-accent'
          }
          onClick={() => !readOnly && onChange && onChange(star)}
        />
      ))}
    </div>
  )
}

export default StarRating
