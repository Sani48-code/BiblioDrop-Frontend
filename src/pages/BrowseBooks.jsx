import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { BookX, ChevronLeft, ChevronRight } from 'lucide-react'
import BookCard from '../components/BookCard'
import SkeletonCard from '../components/SkeletonCard'

const CATEGORIES = ['', 'Fiction', 'Sci-Fi', 'Academic', 'History', 'Biography', 'Technology', 'Children', 'Other']

const BrowseBooks = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [totalBooks, setTotalBooks] = useState(0)

  const [filters, setFilters] = useState({
    search: '',
    category: searchParams.get('category') || '',
    minFee: '',
    maxFee: '',
    availability: '',
    sort: 'newest',
    page: 1,
  })

  const debounceRef = useRef(null)

  const fetchBooks = useCallback((f) => {
    setLoading(true)
    const params = {}
    if (f.search) params.search = f.search
    if (f.category) params.category = f.category
    if (f.minFee) params.minFee = f.minFee
    if (f.maxFee) params.maxFee = f.maxFee
    if (f.availability) params.availability = f.availability
    if (f.sort) params.sort = f.sort
    params.page = f.page
    params.limit = 8

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/books`, { params })
      .then((res) => {
        const data = res.data
        setBooks(data.books || data || [])
        setTotalPages(data.totalPages || 1)
        setTotalBooks(data.total || (data.books || data || []).length)
      })
      .catch(() => {
        setBooks([])
        setTotalPages(1)
        setTotalBooks(0)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchBooks(filters)
  }, [filters.category, filters.minFee, filters.maxFee, filters.availability, filters.sort, filters.page, fetchBooks])

  const handleSearchChange = (e) => {
    const val = e.target.value
    setFilters((f) => ({ ...f, search: val, page: 1 }))
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      fetchBooks({ ...filters, search: val, page: 1 })
    }, 500)
  }

  const update = (key, val) => setFilters((f) => ({ ...f, [key]: val, page: 1 }))

  const pageFrom = (filters.page - 1) * 8 + 1
  const pageTo = Math.min(filters.page * 8, totalBooks)

  const pageNumbers = () => {
    const pages = []
    const start = Math.max(1, filters.page - 2)
    const end = Math.min(totalPages, start + 4)
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-base-content mb-1">Browse Books</h1>
        <p className="text-base-content/60 text-sm">Find your next great read</p>
      </div>

      {/* Filters */}
      <div className="card bg-base-200 rounded-2xl p-5 mb-8 shadow-sm">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Search by title, author, category..."
            value={filters.search}
            onChange={handleSearchChange}
            className="input input-bordered w-full"
          />
          <div className="flex flex-wrap gap-3">
            <select
              value={filters.category}
              onChange={(e) => update('category', e.target.value)}
              className="select select-bordered flex-1 min-w-[140px]"
            >
              <option value="">All Categories</option>
              {CATEGORIES.filter(Boolean).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Min fee ($)"
              value={filters.minFee}
              onChange={(e) => update('minFee', e.target.value)}
              className="input input-bordered w-28"
              min={0}
            />
            <input
              type="number"
              placeholder="Max fee ($)"
              value={filters.maxFee}
              onChange={(e) => update('maxFee', e.target.value)}
              className="input input-bordered w-28"
              min={0}
            />

            <select
              value={filters.availability}
              onChange={(e) => update('availability', e.target.value)}
              className="select select-bordered flex-1 min-w-[150px]"
            >
              <option value="">All Availability</option>
              <option value="available">Available</option>
              <option value="checked-out">Checked Out</option>
            </select>

            <select
              value={filters.sort}
              onChange={(e) => update('sort', e.target.value)}
              className="select select-bordered flex-1 min-w-[130px]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="fee-asc">Fee: Low to High</option>
              <option value="fee-desc">Fee: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Book Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : books.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-base-content/40 gap-4">
          <BookX size={56} />
          <p className="text-xl font-semibold">No books found matching your search</p>
          <p className="text-sm">Try adjusting your filters or search term</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4 text-sm text-base-content/60">
            <span>
              Showing {pageFrom}–{pageTo} of {totalBooks} books
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            className="btn btn-ghost btn-sm"
            disabled={filters.page === 1}
            onClick={() => update('page', filters.page - 1)}
          >
            <ChevronLeft size={16} />
          </button>
          {pageNumbers().map((p) => (
            <button
              key={p}
              onClick={() => update('page', p)}
              className={`btn btn-sm ${p === filters.page ? 'btn-primary' : 'btn-ghost'}`}
            >
              {p}
            </button>
          ))}
          <button
            className="btn btn-ghost btn-sm"
            disabled={filters.page === totalPages}
            onClick={() => update('page', filters.page + 1)}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}

export default BrowseBooks
