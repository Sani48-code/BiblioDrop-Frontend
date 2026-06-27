import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Home } from 'lucide-react'

const NotFound = () => (
  <div className="min-h-[80vh] flex items-center justify-center px-4">
    <div className="text-center">
      <p className="text-8xl font-display font-bold text-primary mb-4">404</p>

      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        className="flex justify-center mb-6"
      >
        <BookOpen size={64} className="text-primary/40" />
      </motion.div>

      <h2 className="text-2xl font-display font-semibold text-base-content mb-2">
        Oops! Page not found
      </h2>
      <p className="text-base-content/60 mb-8 max-w-sm mx-auto">
        The page you&apos;re looking for seems to have been misplaced on the shelf.
      </p>

      <Link to="/" className="btn btn-primary rounded-xl gap-2">
        <Home size={18} /> Go Back Home
      </Link>
    </div>
  </div>
)

export default NotFound
