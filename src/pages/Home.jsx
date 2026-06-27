import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BookOpen, CreditCard, PackageCheck, ArrowRight,
  Rocket, GraduationCap, Landmark, User, Cpu, Baby, Layers,
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
  { label: 'Fiction', icon: BookOpen, count: '~180 books' },
  { label: 'Sci-Fi', icon: Rocket, count: '~92 books' },
  { label: 'Academic', icon: GraduationCap, count: '~145 books' },
  { label: 'History', icon: Landmark, count: '~78 books' },
  { label: 'Biography', icon: User, count: '~63 books' },
  { label: 'Technology', icon: Cpu, count: '~110 books' },
  { label: 'Children', icon: Baby, count: '~95 books' },
  { label: 'Other', icon: Layers, count: '~40 books' },
]

const TOP_LIBRARIANS = [
  { name: 'Sarah Ahmed', deliveries: 142, initials: 'SA', bg: 'from-indigo-500 to-primary', specialties: ['Fiction', 'Biography'] },
  { name: 'Rahman Khan', deliveries: 98, initials: 'RK', bg: 'from-cyan-500 to-secondary', specialties: ['Academic', 'Sci-Fi'] },
  { name: 'Priya Sharma', deliveries: 87, initials: 'PS', bg: 'from-amber-500 to-accent', specialties: ['Children', 'History'] },
]

const TESTIMONIALS = [
  { text: 'BiblioDrop changed how I read. I got 4 books delivered in a single month without leaving my desk.', name: 'Tanvir H.' },
  { text: 'As a student, this is a lifesaver. Academic books delivered for under 100 taka!', name: 'Nadia R.' },
  { text: 'The librarians here are amazing. Quick delivery and the books were in perfect condition.', name: 'Sabbir K.' },
]

const STEPS = [
  { icon: BookOpen, title: 'Browse & Discover', desc: 'Search through thousands of books from local libraries and independent owners' },
  { icon: CreditCard, title: 'Pay Securely', desc: 'Pay a small delivery fee via Stripe — fast and completely safe' },
  { icon: PackageCheck, title: 'Receive at Door', desc: 'Your books arrive within 2–3 days, no library visit needed' },
]

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: 'easeOut' } },
})

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
    toast.success('🎉 You\'re on the list!')
    setNewsEmail('')
  }

  return (
    <div className="bg-base-100">

      {/* ─── Hero ─── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Dot grid background */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'radial-gradient(circle, oklch(var(--b3)) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        {/* Radial glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container-custom relative z-10 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <span className="inline-flex items-center gap-1.5 border border-primary/30 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-6 bg-primary/5">
                ✦ Discover. Borrow. Read.
              </span>
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
              {/* Stats */}
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

            {/* Right — 3D Book Stack */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
              className="hidden lg:flex justify-center items-center"
            >
              <div className="relative w-72 h-80">
                {/* Back card */}
                <div
                  className="absolute w-52 h-72 rounded-2xl bg-base-300 shadow-lg"
                  style={{ transform: 'rotate(-6deg) scale(0.92)', top: '10%', left: '5%' }}
                />
                {/* Mid card */}
                <div
                  className="absolute w-52 h-72 rounded-2xl bg-gradient-to-br from-secondary/60 to-secondary shadow-xl"
                  style={{ transform: 'rotate(-2deg) scale(0.96)', top: '5%', left: '10%' }}
                />
                {/* Front card */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  className="absolute w-52 h-72 rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-2xl shadow-primary/40 p-5 flex flex-col justify-between"
                  style={{ transform: 'rotate(2deg)', top: '0%', left: '15%' }}
                >
                  <div>
                    <div className="w-8 h-1 bg-white/40 rounded mb-2" />
                    <div className="w-14 h-1 bg-white/30 rounded mb-1" />
                  </div>
                  <div className="w-full h-28 bg-white/10 rounded-xl flex items-center justify-center">
                    <BookOpen size={40} className="text-white/60" />
                  </div>
                  <div>
                    <p className="text-white font-display font-semibold text-sm">The Midnight Library</p>
                    <p className="text-white/60 text-xs mt-0.5">Matt Haig</p>
                    <div className="flex gap-0.5 mt-1">
                      {[1,2,3,4,5].map((s) => (
                        <svg key={s} width="10" height="10" viewBox="0 0 24 24" fill="#FBBF24"><path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-base-300 to-transparent" />

      {/* ─── Featured Books ─── */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="section-label mb-2">Featured Books</p>
              <h2 className="font-display text-3xl sm:text-4xl text-base-content">Hand-picked for you</h2>
            </div>
            <Link to="/browse" className="hidden md:flex items-center gap-1 text-primary text-sm font-medium hover:gap-2 transition-all">
              View all <ArrowRight size={15} />
            </Link>
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
                <motion.div key={book._id} variants={fadeUp(i * 0.08)}>
                  <BookCard book={book} />
                </motion.div>
              ))}
            </motion.div>
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
            <p className="section-label mb-2">Simple Process</p>
            <h2 className="font-display text-3xl sm:text-4xl text-base-content">How It Works</h2>
          </div>
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-0 border-t-2 border-dashed border-primary/30 z-0" />
            {STEPS.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                variants={fadeUp(i * 0.15)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative z-10 text-center"
              >
                <div className="inline-flex flex-col items-center">
                  <div className="w-20 h-20 rounded-2xl bg-base-100 border-2 border-primary/20 flex items-center justify-center mb-5 shadow-lg shadow-primary/10 relative">
                    <span className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-primary text-primary-content text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <Icon size={32} className="text-primary" />
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
            {[
              ['500+', 'Books Available'],
              ['120+', 'Expert Librarians'],
              ['10,000+', 'Happy Readers'],
              ['4.9★', 'Average Rating'],
            ].map(([num, label]) => (
              <div key={label} className="text-center">
                <p className="font-display text-4xl font-bold text-white mb-1">{num}</p>
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
            <p className="section-label mb-2">Community</p>
            <h2 className="font-display text-3xl sm:text-4xl text-base-content">Meet Our Top Librarians</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TOP_LIBRARIANS.map(({ name, deliveries, initials, bg, specialties }, i) => (
              <motion.div
                key={name}
                variants={fadeUp(i * 0.1)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-base-100 border border-base-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all"
              >
                <div className="h-1 bg-gradient-to-r from-primary to-secondary" />
                <div className="p-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${bg} flex items-center justify-center text-white text-xl font-bold mb-4 shadow-md`}>
                    {initials}
                  </div>
                  <h3 className="font-semibold text-base-content text-lg">{name}</h3>
                  <span className="inline-block badge badge-primary badge-sm mt-1">Master Librarian</span>
                  <div className="flex items-center gap-1.5 mt-3 text-sm text-base-content/60">
                    <PackageCheck size={14} className="text-success" />
                    {deliveries} books delivered
                  </div>
                  <div className="flex gap-1.5 mt-3 flex-wrap">
                    {specialties.map((s) => (
                      <span key={s} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{s}</span>
                    ))}
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
            <p className="section-label mb-2">Explore</p>
            <h2 className="font-display text-3xl sm:text-4xl text-base-content">Browse by Category</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.map(({ label, icon: Icon, count }, i) => (
              <motion.button
                key={label}
                variants={fadeUp(i * 0.06)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                onClick={() => navigate(`/browse?category=${label}`)}
                className="group bg-base-100 border-2 border-transparent hover:border-primary rounded-2xl p-5 flex flex-col items-center gap-3 cursor-pointer hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                  <Icon size={26} className="text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-base-content text-sm">{label}</p>
                  <p className="text-xs text-base-content/40 mt-0.5">{count}</p>
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
            <p className="section-label mb-2">Testimonials</p>
            <h2 className="font-display text-3xl sm:text-4xl text-base-content">What Readers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ text, name }, i) => (
              <motion.div
                key={name}
                variants={fadeUp(i * 0.1)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative bg-base-200 border border-base-300 rounded-2xl p-6 hover:border-primary/20 hover:shadow-md transition-all"
              >
                <span className="absolute top-4 left-5 text-5xl font-display text-primary/15 leading-none select-none">"</span>
                <p className="text-base-content/70 text-sm italic leading-relaxed mt-4 mb-5">{text}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
                      {name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{name}</p>
                      <span className="text-xs badge badge-success badge-sm">Verified Reader</span>
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
              <p className="section-label mb-3">Stay in the loop</p>
              <h2 className="font-display text-3xl sm:text-4xl text-base-content mb-3">
                New arrivals every week
              </h2>
              <p className="text-base-content/60 mb-8">
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
