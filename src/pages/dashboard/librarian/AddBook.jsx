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

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-display font-bold mb-2">Add a New Book</h1>
      <p className="text-base-content/60 text-sm mb-7">
        Your book will be reviewed by admin before appearing publicly.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label pb-1"><span className="label-text text-sm font-medium">Title *</span></label>
            <input
              className={`input input-bordered w-full ${errors.title ? 'input-error' : ''}`}
              placeholder="Book title"
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && <p className="text-error text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="label pb-1"><span className="label-text text-sm font-medium">Author *</span></label>
            <input
              className={`input input-bordered w-full ${errors.author ? 'input-error' : ''}`}
              placeholder="Author name"
              {...register('author', { required: 'Author is required' })}
            />
            {errors.author && <p className="text-error text-xs mt-1">{errors.author.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label pb-1"><span className="label-text text-sm font-medium">Category *</span></label>
            <select
              className={`select select-bordered w-full ${errors.category ? 'select-error' : ''}`}
              {...register('category', { required: 'Category is required' })}
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <p className="text-error text-xs mt-1">{errors.category.message}</p>}
          </div>
          <div>
            <label className="label pb-1"><span className="label-text text-sm font-medium">Delivery Fee ($) *</span></label>
            <input
              type="number"
              min={1}
              step="0.01"
              className={`input input-bordered w-full ${errors.deliveryFee ? 'input-error' : ''}`}
              placeholder="e.g. 3.50"
              {...register('deliveryFee', { required: 'Fee is required', min: { value: 1, message: 'Min $1' } })}
            />
            {errors.deliveryFee && <p className="text-error text-xs mt-1">{errors.deliveryFee.message}</p>}
          </div>
        </div>

        <div>
          <label className="label pb-1"><span className="label-text text-sm font-medium">Description *</span></label>
          <textarea
            className={`textarea textarea-bordered w-full ${errors.description ? 'textarea-error' : ''}`}
            rows={4}
            placeholder="Describe the book (min 50 characters)..."
            {...register('description', { required: 'Description is required', minLength: { value: 50, message: 'Min 50 characters' } })}
          />
          {errors.description && <p className="text-error text-xs mt-1">{errors.description.message}</p>}
        </div>

        {/* Cover image */}
        <div>
          <label className="label pb-1"><span className="label-text text-sm font-medium">Book Cover *</span></label>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="flex-1">
              <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer transition ${
                uploading ? 'border-primary bg-primary/5' : 'border-base-300 hover:border-primary hover:bg-base-200'
              }`}>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                {uploading ? (
                  <span className="loading loading-spinner loading-md text-primary" />
                ) : (
                  <>
                    <Upload size={24} className="text-base-content/40 mb-2" />
                    <span className="text-sm text-base-content/60">Click to upload cover image</span>
                  </>
                )}
              </label>
            </div>
            {preview && (
              <div className="shrink-0">
                <img src={preview} alt="Cover preview" className="w-24 h-32 object-cover rounded-xl border-2 border-primary shadow-md" />
              </div>
            )}
            {!preview && !uploading && (
              <div className="w-24 h-32 rounded-xl bg-base-300 flex items-center justify-center shrink-0">
                <Image size={28} className="text-base-content/30" />
              </div>
            )}
          </div>
        </div>

        <button type="submit" disabled={submitting || uploading} className="btn btn-primary w-full rounded-xl">
          {submitting ? <span className="loading loading-spinner loading-sm" /> : 'Submit for Approval'}
        </button>
      </form>
    </div>
  )
}

export default AddBook
