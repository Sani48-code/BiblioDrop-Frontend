import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, BookOpen } from 'lucide-react'

const NotFound = () => (
  <div className="min-h-[85vh] flex items-center justify-center px-4">
    <div className="text-center">
      <p className="font-display text-9xl font-bold gradient-text mb-4 leading-none">404</p>

      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        className="flex justify-center mb-6"
      >
        <BookOpen size={64} className="text-primary/30" strokeWidth={1.5} />
      </motion.div>

      <h2 className="font-display text-2xl text-base-content mb-2">Oops! Page not found</h2>
      <p className="text-base-content/50 mb-8 max-w-sm mx-auto">
        The page you&apos;re looking for seems to have been misplaced on the shelf.
      </p>

      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-7 py-3 rounded-xl font-medium hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/25 cursor-pointer"
      >
        <Home size={17} /> Go Back Home
      </Link>
    </div>
  </div>
)

export default NotFound
