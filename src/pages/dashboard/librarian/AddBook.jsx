import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Upload, Image } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAxiosSecure } from '../../../hooks/useAxiosSecure'
import { uploadImage } from '../../../utils/uploadImage'

const CATEGORIES = ['Fiction', 'Sci-Fi', 'Academic', 'History', 'Biography', 'Technology', 'Children', 'Other']

const AddBook = () => {
  const axiosSecure = useAxiosSecure()
  const [uploading, setUploading] = useState(false)
  const [imageURL, setImageURL] = useState('')
  const [preview, setPreview] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file)
      setImageURL(url)
      setPreview(url)
      toast.success('Cover image uploaded!')
    } catch {
      toast.error('Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  const onSubmit = async (data) => {
    if (!imageURL) return toast.error('Please upload a book cover image')
    setSubmitting(true)
    try {
      await axiosSecure.post('/api/books', { ...data, imageURL, deliveryFee: Number(data.deliveryFee) })
      toast.success('Book submitted for approval!')
      reset()
      setImageURL('')
      setPreview('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit book')
    } finally {
      setSubmitting(false)
    }
  }

  const Field = ({ label, error, children }) => (
    <div>
      <label className="text-sm font-medium text-base-content/70 block mb-1.5">{label}</label>
      {children}
      {error && <p className="text-error text-xs mt-1">{error}</p>}
    </div>
  )

  const inputClass = (err) =>
    `w-full border ${err ? 'border-error' : 'border-base-300'} focus:border-primary rounded-xl px-4 py-3 text-sm bg-base-100 outline-none transition-colors focus:ring-2 focus:ring-primary/20`

  return (
    <div>
      <h1 className="font-display text-2xl text-base-content mb-1">Add a New Book</h1>
      <p className="text-base-content/50 text-sm mb-7">Your book will be reviewed by an admin before appearing publicly.</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column — form fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Title *" error={errors.title?.message}>
                <input className={inputClass(errors.title)} placeholder="Book title" {...register('title', { required: 'Title is required' })} />
              </Field>
              <Field label="Author *" error={errors.author?.message}>
                <input className={inputClass(errors.author)} placeholder="Author name" {...register('author', { required: 'Author is required' })} />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Category *" error={errors.category?.message}>
                <select className={inputClass(errors.category)} {...register('category', { required: 'Category is required' })}>
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Delivery Fee (৳) *" error={errors.deliveryFee?.message}>
                <input
                  type="number" min={1} step="0.01"
                  className={inputClass(errors.deliveryFee)}
                  placeholder="e.g. 80"
                  {...register('deliveryFee', { required: 'Fee is required', min: { value: 1, message: 'Min ৳1' } })}
                />
              </Field>
            </div>

            <Field label="Description *" error={errors.description?.message}>
              <textarea
                className={`${inputClass(errors.description)} resize-none`}
                rows={5}
                placeholder="Describe the book (min 50 characters)..."
                {...register('description', { required: 'Description is required', minLength: { value: 50, message: 'Min 50 characters' } })}
              />
            </Field>

            <button
              type="submit"
              disabled={submitting || uploading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/25 cursor-pointer disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
            >
              {submitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Submit for Approval'}
            </button>
          </div>

          {/* Right column — image upload */}
          <div>
            <p className="text-sm font-medium text-base-content/70 mb-1.5">Book Cover *</p>
            <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-colors aspect-[3/4] ${uploading ? 'border-primary bg-primary/5' : 'border-base-300 hover:border-primary hover:bg-base-200/50'}`}>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              {preview ? (
                <img src={preview} alt="Cover preview" className="w-full h-full object-cover rounded-xl" />
              ) : uploading ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
                  <span className="text-sm text-base-content/50">Uploading...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-base-200 flex items-center justify-center">
                    <Upload size={28} className="text-base-content/30" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-base-content/60">Click to upload cover</p>
                    <p className="text-xs text-base-content/40 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              )}
            </label>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddBook
