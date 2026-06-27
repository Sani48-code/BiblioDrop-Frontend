import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, BookOpen } from 'lucide-react'

const PaymentSuccess = () => (
  <div className="min-h-[85vh] flex items-center justify-center px-4">
    <div className="text-center max-w-md">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
        className="flex justify-center mb-6"
      >
        <div className="w-28 h-28 rounded-full bg-success/10 flex items-center justify-center">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="11" stroke="#34D399" strokeWidth="2" />
            <motion.path
              d="M7 12.5l3.5 3.5 6.5-7"
              stroke="#34D399"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5, duration: 0.5, ease: 'easeOut' }}
            />
          </svg>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h1 className="font-display text-3xl text-base-content mb-3">Payment Successful!</h1>
        <p className="text-base-content/60 mb-8 leading-relaxed">
          Your delivery request has been placed. The librarian will review your request and dispatch your book soon.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/dashboard/user/history"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/25 cursor-pointer"
          >
            <Package size={17} /> View My Orders
          </Link>
          <Link
            to="/browse"
            className="inline-flex items-center justify-center gap-2 border border-base-300 text-base-content px-6 py-3 rounded-xl font-medium hover:border-primary/40 transition-colors cursor-pointer"
          >
            <BookOpen size={17} /> Browse More Books
          </Link>
        </div>
      </motion.div>
    </div>
  </div>
)

export default PaymentSuccess
