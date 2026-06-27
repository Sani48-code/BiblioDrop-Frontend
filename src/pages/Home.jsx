import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BookOpen,
  ShoppingCart,
  Home as HomeIcon,
  BookMarked,
  Atom,
  GraduationCap,
  History,
  User,
  Cpu,
  Baby,
  MoreHorizontal,
} from 'lucide-react'
import axios from 'axios'
import BookCard from '../components/BookCard'
import SkeletonCard from '../components/SkeletonCard'
import toast from 'react-hot-toast'

const PLACEHOLDER_BOOKS = Array.from({ length: 6 }, (_, i) => ({
  _id: `placeholder-${i}`,
  title: `Sample Book ${i + 1}`,
  author: 'Author Name',
  imageURL: `https://placehold.co/400x300/e2e8f0/1e293b?text=Book+${i + 1}`,
  category: 'Fiction',
  deliveryFee: (2 + i).toFixed(2),
  status: 'Published',
}))

const CATEGORIES = [
  { label: 'Fiction', icon: BookOpen },
  { label: 'Sci-Fi', icon: Atom },
  { label: 'Academic', icon: GraduationCap },
  { label: 'History', icon: History },
  { label: 'Biography', icon: User },
  { label: 'Technology', icon: Cpu },
  { label: 'Children', icon: Baby },
  { label: 'Other', icon: MoreHorizontal },
]

const TOP_LIBRARIANS = [
  { name: 'Sarah Ahmed', deliveries: 142, initials: 'SA' },
  { name: 'Rahman Khan', deliveries: 98, initials: 'RK' },
  { name: 'Priya Sharma', deliveries: 87, initials: 'PS' },
]

const STEPS = [
  { icon: BookOpen, title: 'Browse', desc: 'Explore thousands of books from local libraries' },
  { icon: ShoppingCart, title: 'Request', desc: 'Pay the delivery fee securely with Stripe' },
  { icon: HomeIcon, title: 'Receive', desc: 'Get books delivered right to your door' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
}

const Home = () => {
  const [books, setBooks] = useState([])
  const [loadingBooks, setLoadingBooks] = useState(true)
  const [newsEmail, setNewsEmail] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/books?limit=6&sort=newest`)
      .then((res) => {
        const data = res.data?.books || res.data || []
        setBooks(data.length ? data : PLACEHOLDER_BOOKS)
      })
      .catch(() => setBooks(PLACEHOLDER_BOOKS))
      .finally(() => setLoadingBooks(false))
  }, [])

  const handleNewsletter = (e) => {
    e.preventDefault()
    if (!newsEmail) return
    toast.success('Thanks for subscribing!')
    setNewsEmail('')
  }

  return (
    <div>
      {/* ─── Section 1: Hero ─── */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-primary via-primary/80 to-secondary overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="absolute text-white text-6xl font-display"
              style={{ top: `${Math.random() * 90}%`, left: `${Math.random() * 90}%`, transform: `rotate(${Math.random() * 30 - 15}deg)` }}
            >
              📚
            </span>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
            {/* Left: text */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center lg:text-left"
            >
              <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                Book Delivery Platform
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight">
                Your Local Library,<br />
                <span className="text-accent">Delivered</span>
              </h1>
              <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Browse thousands of books from local libraries and independent owners. Pay a small delivery fee and get your next great read delivered to your door.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link to="/browse" className="btn btn-accent btn-lg rounded-xl shadow-lg">
                  Browse Books
                </Link>
                <Link to="/register" className="btn btn-outline btn-lg rounded-xl border-white/60 text-white hover:bg-white hover:text-primary">
                  List Your Books
                </Link>
              </div>
              <div className="flex gap-6 mt-10 justify-center lg:justify-start">
                {[['10K+', 'Books'], ['500+', 'Librarians'], ['25K+', 'Readers']].map(([num, label]) => (
                  <div key={label} className="text-center">
                    <p className="text-white font-bold text-2xl">{num}</p>
                    <p className="text-white/70 text-xs">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: book stack illustration */}
            <div className="hidden lg:flex justify-center items-center">
              <div className="relative w-80 h-80">
                {[
                  { color: '#6366F1', rotate: '-12deg', top: '10%', left: '5%' },
                  { color: '#06B6D4', rotate: '-4deg', top: '20%', left: '15%' },
                  { color: '#F59E0B', rotate: '5deg', top: '12%', left: '10%' },
                  { color: '#10B981', rotate: '12deg', top: '5%', left: '20%' },
                ].map(({ color, rotate, top, left }, i) => (
                  <div
                    key={i}
                    className="absolute rounded-lg shadow-2xl"
                    style={{
                      backgroundColor: color,
                      width: '130px',
                      height: '180px',
                      transform: `rotate(${rotate})`,
                      top,
                      left: `${parseInt(left) + i * 18}%`,
                      opacity: 0.85,
                    }}
                  />
                ))}
                <div
                  className="absolute rounded-lg shadow-xl bg-white flex items-center justify-center"
                  style={{ width: '120px', height: '165px', top: '30%', left: '30%', transform: 'rotate(-2deg)' }}
                >
                  <BookOpen size={48} className="text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 2: Featured Books ─── */}
      <section className="py-20 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-base-content mb-3">
              Featured Books
            </h2>
            <p className="text-base-content/60">Handpicked selections just for you</p>
          </div>

          {loadingBooks ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {books.map((book, i) => (
                <motion.div key={book._id} variants={fadeUp} custom={i}>
                  <BookCard book={book} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="text-center mt-10">
            <Link to="/browse" className="btn btn-primary btn-wide rounded-xl">
              View All Books
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Section 3: How It Works ─── */}
      <section className="py-20 bg-base-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-base-content mb-3">
              How It Works
            </h2>
            <p className="text-base-content/60">Three simple steps to your next read</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="card bg-base-100 shadow-md p-8 text-center rounded-2xl hover:shadow-lg transition"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <Icon className="text-primary" size={28} />
                </div>
                <div className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                  {i + 1}
                </div>
                <h3 className="font-display font-semibold text-xl mb-2">{title}</h3>
                <p className="text-base-content/60 text-sm">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Section 4: Top Librarians ─── */}
      <section className="py-20 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-base-content mb-3">
              Top Librarians
            </h2>
            <p className="text-base-content/60">Our most trusted book owners</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TOP_LIBRARIANS.map(({ name, deliveries, initials }, i) => (
              <motion.div
                key={name}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="card bg-base-200 rounded-2xl p-6 text-center hover:shadow-md transition"
              >
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary">
                  {initials}
                </div>
                <h3 className="font-semibold text-lg">{name}</h3>
                <span className="badge badge-success mt-2">
                  {deliveries} Completed Deliveries
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Section 5: Popular Categories ─── */}
      <section className="py-20 bg-base-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-base-content mb-3">
              Browse by Category
            </h2>
            <p className="text-base-content/60">Find exactly what you're looking for</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.map(({ label, icon: Icon }, i) => (
              <motion.button
                key={label}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                onClick={() => navigate(`/browse?category=${label}`)}
                className="card bg-base-100 p-5 rounded-2xl flex flex-col items-center gap-3 cursor-pointer hover:border-primary hover:border-2 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md group"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition">
                  <Icon className="text-primary" size={22} />
                </div>
                <span className="text-sm font-medium text-base-content">{label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Section 6: Newsletter ─── */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-3">
              Stay Updated with New Arrivals
            </h2>
            <p className="text-white/70 mb-8">
              Get notified when new books are added to BiblioDrop
            </p>
            <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={newsEmail}
                onChange={(e) => setNewsEmail(e.target.value)}
                placeholder="Enter your email"
                className="input flex-1 rounded-xl text-base-content"
              />
              <button type="submit" className="btn btn-accent rounded-xl">
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
