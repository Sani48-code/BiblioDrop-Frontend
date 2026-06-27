import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home } from 'lucide-react'

const NotFound = () => (
  <div className="min-h-[85vh] flex items-center justify-center px-4">
    <div className="flex flex-col lg:flex-row items-center gap-12 max-w-4xl w-full">
      {/* Illustration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-72 h-72 rounded-3xl overflow-hidden shadow-2xl shrink-0"
      >
        <img
          src="https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&q=80"
          alt="Library bookshelf"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-primary/20" />
        <p className="absolute inset-0 flex items-center justify-center font-display text-8xl font-bold text-white/30 select-none">
          404
        </p>
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        <p className="section-label mb-3">Page Not Found</p>
        <h1 className="font-display text-4xl sm:text-5xl text-base-content mb-4">
          Oops! This shelf is empty.
        </h1>
        <p className="text-base-content/50 text-base leading-relaxed mb-8 max-w-sm">
          The page you&apos;re looking for seems to have been misplaced on the shelf. Let&apos;s get you back to the reading room.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-7 py-3.5 rounded-xl font-medium hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/25 cursor-pointer"
        >
          <Home size={17} /> Go Back Home
        </Link>
      </motion.div>
    </div>
  </div>
)

export default NotFound
