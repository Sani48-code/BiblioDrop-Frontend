import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import {
  BookOpen, CreditCard, PackageCheck, ArrowRight,
  Rocket, GraduationCap, Landmark, User, Cpu, Baby, Layers, CheckCircle,
} from 'lucide-react'
import axios from 'axios'
import BookCard from '../components/BookCard'
import SkeletonCard from '../components/SkeletonCard'
import StarRating from '../components/StarRating'
import toast from 'react-hot-toast'

const PLACEHOLDER_BOOKS = [
  { _id: '1', title: 'The Midnight Library', author: 'Matt Haig', category: 'Fiction', deliveryFee: 50, status: 'Published', imageURL: 'https://covers.openlibrary.org/b/id/10909258-L.jpg' },
  { _id: '2', title: 'Atomic Habits', author: 'James Clear', category: 'Technology', deliveryFee: 60, status: 'Published', imageURL: 'https://covers.openlibrary.org/b/id/10364917-L.jpg' },
  { _id: '3', title: 'Sapiens', author: 'Yuval Noah Harari', category: 'History', deliveryFee: 70, status: 'Published', imageURL: 'https://covers.openlibrary.org/b/id/8739161-L.jpg' },
  { _id: '4', title: 'Dune', author: 'Frank Herbert', category: 'Sci-Fi', deliveryFee: 45, status: 'Checked Out', imageURL: 'https://covers.openlibrary.org/b/id/6979861-L.jpg' },
  { _id: '5', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', deliveryFee: 40, status: 'Published', imageURL: 'https://covers.openlibrary.org/b/id/7222246-L.jpg' },
  { _id: '6', title: 'Clean Code', author: 'Robert C. Martin', category: 'Technology', deliveryFee: 80, status: 'Published', imageURL: 'https://covers.openlibrary.org/b/id/8621409-L.jpg' },
]

const CATEGORIES = [
  { label: 'Fiction', icon: BookOpen, count: '~180 books', image: 'https://images.unsplash.com/photo-1476275466078-4cdc8d0a7ef3?w=400&q=80' },
  { label: 'Sci-Fi', icon: Rocket, count: '~92 books', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80' },
  { label: 'Academic', icon: GraduationCap, count: '~145 books', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80' },
  { label: 'History', icon: Landmark, count: '~78 books', image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&q=80' },
  { label: 'Biography', icon: User, count: '~63 books', image: 'https://images.unsplash.com/photo-1529590003495-c39735c7e2f7?w=400&q=80' },
  { label: 'Technology', icon: Cpu, count: '~110 books', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80' },
  { label: 'Children', icon: Baby, count: '~95 books', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80' },
  { label: 'Other', icon: Layers, count: '~40 books', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&q=80' },
]

const TOP_LIBRARIANS = [
  { name: 'Sarah Ahmed', deliveries: 142, avatar: 'https://randomuser.me/api/portraits/women/44.jpg', specialties: ['Fiction', 'Biography'] },
  { name: 'Rahman Khan', deliveries: 98, avatar: 'https://randomuser.me/api/portraits/men/32.jpg', specialties: ['Academic', 'Sci-Fi'] },
  { name: 'Priya Sharma', deliveries: 87, avatar: 'https://randomuser.me/api/portraits/women/68.jpg', specialties: ['Children', 'History'] },
]

const TESTIMONIALS = [
  { text: 'BiblioDrop changed how I read. I got 4 books delivered in a single month without leaving my desk.', name: 'Tanvir H.', avatar: 'https://randomuser.me/api/portraits/men/52.jpg' },
  { text: 'As a student, this is a lifesaver. Academic books delivered for under 100 taka!', name: 'Nadia R.', avatar: 'https://randomuser.me/api/portraits/women/26.jpg' },
  { text: 'The librarians here are amazing. Quick delivery and the books were in perfect condition.', name: 'Sabbir K.', avatar: 'https://randomuser.me/api/portraits/men/71.jpg' },
]

const STEPS = [
  { icon: BookOpen, title: 'Browse & Discover', desc: 'Search through thousands of books from local libraries and independent owners', color: 'from-primary to-indigo-600' },
  { icon: CreditCard, title: 'Pay Securely', desc: 'Pay a small delivery fee via Stripe. Fast and completely safe.', color: 'from-secondary to-cyan-500' },
  { icon: PackageCheck, title: 'Receive at Door', desc: 'Your books arrive within 2–3 days, no library visit needed', color: 'from-success to-emerald-500' },
]

const STATS = [
  { end: 500, suffix: '+', label: 'Books Available' },
  { end: 120, suffix: '+', label: 'Expert Librarians' },
  { end: 10000, suffix: '+', label: 'Happy Readers' },
  { end: 4.9, suffix: '★', label: 'Average Rating', decimals: 1 },
]

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: 'easeOut' } },
})

const SectionHeading = ({ label, title, centered = true }) => (
  <div className={centered ? 'text-center' : ''}>
    <p className="section-label mb-2">{label}</p>
    <h2 className="font-display text-3xl sm:text-4xl text-base-content">{title}</h2>
    <div className={`mt-3 h-1 w-12 bg-gradient-to-r from-primary to-secondary rounded-full ${centered ? 'mx-auto' : ''}`} />
  </div>
)

const CountUp = ({ end, suffix = '', decimals = 0 }) => {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const duration = 1600
    const startTime = Date.now()
    const frame = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - (1 - progress) ** 3
      setVal(+(eased * end).toFixed(decimals))
      if (progress < 1) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }, [inView, end, decimals])

  return <span ref={ref}>{decimals ? val.toFixed(decimals) : val.toLocaleString()}{suffix}</span>
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
    toast.success('You\'re on the list!')
    setNewsEmail('')
  }

  return (
    <div className="bg-base-100">

      {/* ─── Hero ─── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle, oklch(var(--b3)) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container-custom relative z-10 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-base-content leading-tight mb-6">
                Your Local Library,{' '}
                <span className="italic gradient-text">Delivered.</span>
              </h1>
              <p className="text-base-content/60 text-lg leading-relaxed max-w-md mb-8">
                Browse thousands of books from local libraries and independent owners. Pay a small delivery fee and get your next great read at your door.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Link
                  to="/browse"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-7 py-3.5 rounded-xl font-semibold hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-xl shadow-primary/25 cursor-pointer"
                >
                  Browse Books <ArrowRight size={18} />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 border border-base-300 text-base-content px-7 py-3.5 rounded-xl font-medium hover:border-primary/40 hover:bg-base-200 transition-all cursor-pointer"
                >
                  Become a Librarian
                </Link>
              </div>
              <div className="flex items-center gap-6">
                {[['500+', 'Books'], ['120+', 'Librarians'], ['2,000+', 'Readers']].map(([num, label], i) => (
                  <div key={label} className="flex items-center gap-4">
                    {i > 0 && <div className="w-px h-8 bg-base-300" />}
                    <div>
                      <p className="font-display font-bold text-xl text-base-content">{num}</p>
                      <p className="text-xs text-base-content/50">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — Real library photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="hidden lg:block relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/20"
            >
              <img
                src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80"
                alt="Library interior with bookshelves"
                loading="lazy"
                className="w-full h-[500px] object-cover"
              />
              {/* Soft gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />

              {/* Floating badge — bottom left */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="absolute bottom-4 left-4 bg-white/85 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg flex items-center gap-3"
              >
                <span className="text-2xl">📚</span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm leading-none">500+ Books</p>
                  <p className="text-gray-500 text-xs mt-0.5">Available now</p>
                </div>
              </motion.div>

              {/* Floating badge — top right */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.5 }}
                className="absolute top-4 right-4 bg-white/85 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg flex items-center gap-3"
              >
                <span className="text-2xl">⭐</span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm leading-none">4.9 Rating</p>
                  <p className="text-gray-500 text-xs mt-0.5">From readers</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-base-300 to-transparent" />

      {/* ─── Featured Books ─── */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-10">
            <SectionHeading label="Featured Books" title="Hand-picked for you" centered={false} />
            <Link to="/browse" className="hidden md:flex items-center gap-1 text-primary text-sm font-medium hover:gap-2 transition-all">
              View all <ArrowRight size={15} />
            </Link>
          </div>

          {loadingBooks ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <>
              {/* Desktop grid */}
              <motion.div
                className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-6"
                variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {books.map((book, i) => (
                  <motion.div key={book._id} variants={fadeUp(i * 0.06)}>
                    <BookCard book={book} />
                  </motion.div>
                ))}
              </motion.div>

              {/* Mobile horizontal scroll */}
              <div className="flex sm:hidden gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4 scrollbar-hide">
                {books.map((book) => (
                  <div key={book._id} className="snap-start shrink-0 w-[280px]">
                    <BookCard book={book} />
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="text-center mt-10">
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 border border-base-300 text-base-content px-8 py-3 rounded-xl font-medium hover:border-primary hover:text-primary transition-all cursor-pointer"
            >
              View All Books <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-base-300 to-transparent" />

      {/* ─── How It Works ─── */}
      <section className="section-padding bg-base-200">
        <div className="container-custom">
          <div className="text-center mb-16">
            <SectionHeading label="Simple Process" title="How It Works" />
          </div>
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Dashed connector (desktop) */}
            <div className="hidden md:block absolute top-10 left-[22%] right-[22%] h-0 border-t-2 border-dashed border-primary/25 z-0" />
            {STEPS.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={title}
                variants={fadeUp(i * 0.15)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                className="relative z-10 text-center bg-base-100 rounded-2xl p-7 border border-base-200 hover:border-primary/20 hover:shadow-lg transition-shadow cursor-default"
              >
                <div className="inline-flex flex-col items-center">
                  <div className="relative mb-5">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                      <Icon size={32} className="text-white" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-base-100 border-2 border-primary text-primary text-xs font-bold flex items-center justify-center shadow-sm">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="font-semibold text-base-content text-lg mb-2">{title}</h3>
                  <p className="text-base-content/60 text-sm max-w-xs leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats Banner ─── */}
      <section className="relative py-16 bg-gradient-to-r from-primary to-secondary overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map(({ end, suffix, label, decimals = 0 }) => (
              <div key={label} className="text-center">
                <p className="font-display text-4xl font-bold text-white mb-1">
                  <CountUp end={end} suffix={suffix} decimals={decimals} />
                </p>
                <p className="text-white/70 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Top Librarians ─── */}
      <section className="section-padding bg-base-100">
        <div className="container-custom">
          <div className="text-center mb-12">
            <SectionHeading label="Community" title="Meet Our Top Librarians" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TOP_LIBRARIANS.map(({ name, deliveries, avatar, specialties }, i) => (
              <motion.div
                key={name}
                variants={fadeUp(i * 0.1)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group bg-base-100 border border-base-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300 relative"
              >
                <div className="h-1 bg-gradient-to-r from-primary to-secondary" />
                <div className="p-6">
                  {/* Avatar with ring + verified badge */}
                  <div className="relative w-16 h-16 mb-4">
                    <img
                      src={avatar}
                      alt={name}
                      loading="lazy"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary ring-offset-2"
                    />
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-base-100 flex items-center justify-center">
                      <CheckCircle size={11} className="text-white" fill="white" />
                    </span>
                  </div>

                  <h3 className="font-semibold text-base-content text-lg">{name}</h3>
                  <span className="inline-block text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-medium mt-1">Master Librarian</span>

                  <div className="flex items-center gap-1.5 mt-3 text-sm text-base-content/60">
                    <PackageCheck size={14} className="text-success" />
                    {deliveries} books delivered
                  </div>
                  <div className="flex gap-1.5 mt-3 flex-wrap">
                    {specialties.map((s) => (
                      <span key={s} className="text-xs bg-base-200 text-base-content/60 px-2 py-0.5 rounded-full">{s}</span>
                    ))}
                  </div>

                  {/* Hover — View Profile slides up */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/90 to-primary/70 py-4 flex items-center justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-b-2xl">
                    <Link to="/browse" className="text-white text-sm font-semibold tracking-wide">
                      View Profile →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-base-300 to-transparent" />

      {/* ─── Popular Categories ─── */}
      <section className="section-padding bg-base-200">
        <div className="container-custom">
          <div className="text-center mb-12">
            <SectionHeading label="Explore" title="Browse by Category" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.map(({ label, icon: Icon, count, image }, i) => (
              <motion.button
                key={label}
                variants={fadeUp(i * 0.06)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                onClick={() => navigate(`/browse?category=${label}`)}
                className="group relative rounded-2xl overflow-hidden h-32 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {/* Background image */}
                <img
                  src={image}
                  alt={label}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                  className="absolute inset-0 w-full h-full object-cover brightness-75 group-hover:brightness-90 group-hover:scale-105 transition-all duration-400"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20 group-hover:from-black/50 transition-all" />
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center gap-1.5 p-3">
                  <Icon size={22} className="text-white" />
                  <p className="font-bold text-white text-sm leading-tight">{label}</p>
                  <p className="text-white/70 text-xs">{count}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="section-padding bg-base-100">
        <div className="container-custom">
          <div className="text-center mb-12">
            <SectionHeading label="Testimonials" title="What Readers Say" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ text, name, avatar }, i) => (
              <motion.div
                key={name}
                variants={fadeUp(i * 0.1)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative bg-base-100 border border-base-200 border-l-4 border-l-primary rounded-2xl p-6 hover:shadow-md transition-all"
              >
                <span className="absolute top-4 left-5 text-6xl font-display text-primary/15 leading-none select-none pointer-events-none">"</span>
                <p className="text-base-content/70 text-sm italic leading-relaxed mt-5 mb-5">{text}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={avatar}
                      alt={name}
                      loading="lazy"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/30"
                    />
                    <div>
                      <p className="font-semibold text-sm text-base-content">{name}</p>
                      <span className="text-xs text-success font-medium">Verified Reader</span>
                    </div>
                  </div>
                  <StarRating value={5} readOnly size="sm" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Newsletter ─── */}
      <section className="section-padding bg-base-200">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <SectionHeading label="Stay in the loop" title="New arrivals every week" />
              <p className="text-base-content/60 mb-8 mt-4">
                Get the latest book drops and exclusive deals delivered to your inbox.
              </p>
              <form onSubmit={handleNewsletter} className="flex gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={newsEmail}
                  onChange={(e) => setNewsEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 border border-base-300 focus:border-primary bg-base-100 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-primary to-secondary text-white text-sm px-6 py-3 rounded-xl hover:opacity-90 transition-opacity cursor-pointer font-medium shrink-0"
                >
                  Subscribe
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
