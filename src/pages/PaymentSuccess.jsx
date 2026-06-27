import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Package, BookOpen } from 'lucide-react'

const PaymentSuccess = () => (
  <div className="min-h-[80vh] flex items-center justify-center px-4">
    <div className="text-center max-w-md">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="flex justify-center mb-6"
      >
        <CheckCircle size={80} className="text-success" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h1 className="text-3xl font-display font-bold text-base-content mb-3">
          Payment Successful!
        </h1>
        <p className="text-base-content/60 mb-8 leading-relaxed">
          Your delivery request has been placed. The librarian will review your request and dispatch your book soon. You&apos;ll receive updates in your dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/dashboard/user/history" className="btn btn-primary rounded-xl gap-2">
            <Package size={18} /> View My Orders
          </Link>
          <Link to="/browse" className="btn btn-ghost rounded-xl gap-2">
            <BookOpen size={18} /> Browse More Books
          </Link>
        </div>
      </motion.div>
    </div>
  </div>
)

export default PaymentSuccess
