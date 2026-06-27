import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { BookOpen, ChevronLeft, ChevronRight, Search, SlidersHorizontal, X } from 'lucide-react'
import BookCard from '../components/BookCard'
import SkeletonCard from '../components/SkeletonCard'

const CATEGORIES = ['Fiction', 'Sci-Fi', 'Academic', 'History', 'Biography', 'Technology', 'Children', 'Other']
const EMPTY_IMG = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80'

const FilterSidebar = ({ filters, onChange, onClear }) => (
  <div className="bg-base-100 rounded-2xl border border-base-200 p-6 space-y-6">
    {/* Header with book icon */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
          <BookOpen size={14} className="text-primary" />
        </div>
        <h3 className="font-semibold text-base-content">Filters</h3>
      </div>
      <button onClick={onClear} className="text-xs text-primary hover:underline cursor-pointer">Clear all</button>
    </div>

    {/* Search */}
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-2 block">Search</label>
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onChange('search', e.target.value)}
          placeholder="Title, author..."
          className="w-full border border-base-300 focus:border-primary rounded-xl py-2 pl-9 pr-3 text-sm outline-none bg-base-100 transition-colors"
        />
      </div>
    </div>

    {/* Category */}
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-3 block">Category</label>
      <div className="flex flex-wrap gap-2">
        {['', ...CATEGORIES].map((cat) => (
          <button
            key={cat || 'all'}
            onClick={() => onChange('category', cat)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer focus:outline-none ${
              filters.category === cat
                ? 'bg-primary text-primary-content border-primary'
                : 'border-base-300 text-base-content/70 hover:border-primary hover:text-primary'
            }`}
          >
            {cat || 'All'}
          </button>
        ))}
      </div>
    </div>

    {/* Fee Range */}
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-3 block">Delivery Fee (৳)</label>
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Min"
          value={filters.minFee}
          onChange={(e) => onChange('minFee', e.target.value)}
          className="w-full border border-base-300 focus:border-primary rounded-xl py-2 px-3 text-sm outline-none bg-base-100 transition-colors"
          min={0}
        />
        <input
          type="number"
          placeholder="Max"
          value={filters.maxFee}
          onChange={(e) => onChange('maxFee', e.target.value)}
          className="w-full border border-base-300 focus:border-primary rounded-xl py-2 px-3 text-sm outline-none bg-base-100 transition-colors"
          min={0}
        />
      </div>
    </div>

    {/* Availability */}
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-3 block">Availability</label>
      <div className="flex flex-wrap gap-2">
        {[['', 'All'], ['available', 'Available'], ['checked-out', 'Checked Out']].map(([val, label]) => (
          <button
            key={val || 'all-avail'}
            onClick={() => onChange('availability', val)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer focus:outline-none ${
              filters.availability === val
                ? 'bg-primary text-primary-content border-primary'
                : 'border-base-300 text-base-content/70 hover:border-primary hover:text-primary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>

    {/* Sort */}
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-2 block">Sort by</label>
      <select
        value={filters.sort}
        onChange={(e) => onChange('sort', e.target.value)}
        className="w-full border border-base-300 focus:border-primary rounded-xl py-2 px-3 text-sm outline-none bg-base-100 transition-colors cursor-pointer"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="fee-asc">Fee: Low to High</option>
        <option value="fee-desc">Fee: High to Low</option>
      </select>
    </div>
  </div>
)

const BrowseBooks = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [totalBooks, setTotalBooks] = useState(0)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minFee: searchParams.get('minFee') || '',
    maxFee: searchParams.get('maxFee') || '',
    availability: searchParams.get('availability') || '',
    sort: searchParams.get('sort') || 'newest',
    page: Number(searchParams.get('page')) || 1,
  })

  const debounceRef = useRef(null)

  const fetchBooks = useCallback((f) => {
    setLoading(true)
    const params = { page: f.page, limit: 9 }
    if (f.search) params.search = f.search
    if (f.category) params.category = f.category
    if (f.minFee) params.minFee = f.minFee
    if (f.maxFee) params.maxFee = f.maxFee
    if (f.availability) params.availability = f.availability
    if (f.sort) params.sort = f.sort

    const urlParams = {}
    Object.entries(params).forEach(([k, v]) => { if (v) urlParams[k] = v })
    setSearchParams(urlParams, { replace: true })

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/books`, { params })
      .then((res) => {
        setBooks(res.data?.books || res.data || [])
        setTotalPages(res.data?.totalPages || 1)
        setTotalBooks(res.data?.total || 0)
      })
      .catch(() => { setBooks([]); setTotalPages(1); setTotalBooks(0) })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchBooks(filters), 400)
    return () => clearTimeout(debounceRef.current)
  }, [filters, fetchBooks])

  const update = (key, val) => setFilters((f) => ({ ...f, [key]: val, page: 1 }))
  const clearAll = () => setFilters({ search: '', category: '', minFee: '', maxFee: '', availability: '', sort: 'newest', page: 1 })

  const pageFrom = (filters.page - 1) * 9 + 1
  const pageTo = Math.min(filters.page * 9, totalBooks)
  const pageNumbers = () => {
    const pages = []
    const start = Math.max(1, filters.page - 2)
    const end = Math.min(totalPages, start + 4)
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

  // Active filter pills
  const activeFilters = [
    filters.search && { key: 'search', label: `"${filters.search}"` },
    filters.category && { key: 'category', label: filters.category },
    filters.minFee && { key: 'minFee', label: `Min ৳${filters.minFee}` },
    filters.maxFee && { key: 'maxFee', label: `Max ৳${filters.maxFee}` },
    filters.availability && { key: 'availability', label: filters.availability === 'available' ? 'Available' : 'Checked Out' },
  ].filter(Boolean)

  return (
    <div className="container-custom py-10">
      {/* Page Header */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="section-label mb-1">Library</p>
          <h1 className="font-display text-3xl sm:text-4xl text-base-content">Browse Books</h1>
          {!loading && totalBooks > 0 && (
            <p className="text-base-content/50 text-sm mt-1">
              Showing {pageFrom}–{pageTo} of {totalBooks} books
            </p>
          )}
        </div>
        {/* Mobile filter button */}
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="lg:hidden flex items-center gap-1.5 border border-base-300 rounded-xl px-3.5 py-2 text-sm text-base-content/70 hover:border-primary hover:text-primary transition-colors cursor-pointer"
        >
          <SlidersHorizontal size={15} /> Filters
          {activeFilters.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-primary text-primary-content text-[10px] flex items-center justify-center font-bold">
              {activeFilters.length}
            </span>
          )}
        </button>
      </div>

      {/* Active filter pills */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {activeFilters.map(({ key, label }) => (
            <span
              key={key}
              className="inline-flex items-center gap-1.5 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium"
            >
              {label}
              <button
                onClick={() => update(key, '')}
                className="hover:text-primary/60 cursor-pointer focus:outline-none"
                aria-label={`Remove ${label} filter`}
              >
                <X size={11} />
              </button>
            </span>
          ))}
          <button
            onClick={clearAll}
            className="text-xs text-base-content/50 hover:text-base-content px-2 py-1.5 transition-colors cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-72 shrink-0 sticky top-24 self-start">
          <FilterSidebar filters={filters} onChange={update} onClear={clearAll} />
        </aside>

        {/* Book grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : books.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-5">
              <div className="relative w-52 h-40 rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={EMPTY_IMG}
                  alt="Empty library"
                  className="w-full h-full object-cover brightness-75"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
                <div className="absolute inset-0 bg-primary/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen size={40} className="text-white opacity-70" strokeWidth={1.5} />
                </div>
              </div>
              <div>
                <p className="font-display text-xl text-base-content mb-1">No books found</p>
                <p className="text-base-content/50 text-sm max-w-xs">
                  We couldn&apos;t find any books matching your filters. Try adjusting your search.
                </p>
              </div>
              <button
                onClick={clearAll}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white text-sm px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity cursor-pointer font-medium"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
              {books.map((book) => <BookCard key={book._id} book={book} />)}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                className="w-10 h-10 rounded-lg border border-base-300 flex items-center justify-center hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                disabled={filters.page === 1}
                onClick={() => update('page', filters.page - 1)}
              >
                <ChevronLeft size={16} />
              </button>
              {pageNumbers().map((p) => (
                <button
                  key={p}
                  onClick={() => update('page', p)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    p === filters.page
                      ? 'bg-primary text-primary-content shadow-md shadow-primary/25'
                      : 'border border-base-300 hover:border-primary hover:text-primary'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                className="w-10 h-10 rounded-lg border border-base-300 flex items-center justify-center hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                disabled={filters.page === totalPages}
                onClick={() => update('page', filters.page + 1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end lg:hidden">
          <div className="flex-1 h-full bg-black/50" onClick={() => setMobileFilterOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-base-100 rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Filters</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="w-8 h-8 rounded-full hover:bg-base-200 flex items-center justify-center transition-colors cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <FilterSidebar filters={filters} onChange={(k, v) => { update(k, v) }} onClear={() => { clearAll(); setMobileFilterOpen(false) }} />
          </div>
        </div>
      )}
    </div>
  )
}

export default BrowseBooks
