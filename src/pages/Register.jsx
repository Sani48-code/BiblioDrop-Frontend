import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, BookOpen, Library, CheckCircle, Upload, Link2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { uploadImage } from '../utils/uploadImage'

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
)

const Register = () => {
  const { register: registerUser, googleLogin } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [role, setRole] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [photoTab, setPhotoTab] = useState('url')
  const [photoURL, setPhotoURL] = useState('')
  const [uploading, setUploading] = useState(false)
  const [photoPreview, setPhotoPreview] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const password = watch('password')

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file)
      setPhotoURL(url)
      setPhotoPreview(url)
      toast.success('Image uploaded!')
    } catch {
      toast.error('Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  const onStep1Submit = (data) => {
    if (!role && step === 2) return
    setFormData({ ...data, photoURL: photoTab === 'url' ? data.photoURL : photoURL })
    setStep(2)
  }

  const handleCreateAccount = async () => {
    if (!role) return toast.error('Please select a role')
    setSubmitting(true)
    try {
      await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        photoURL: formData.photoURL || photoURL || '',
        role,
      })
      toast.success('Account created! Welcome to BiblioDrop 🎉')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 py-12">
      <div className="card bg-base-100 shadow-xl w-full max-w-md rounded-3xl p-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <BookOpen className="text-primary" size={26} />
          <span className="font-display text-2xl font-bold text-primary">BiblioDrop</span>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step >= s ? 'bg-primary text-primary-content' : 'bg-base-300 text-base-content/40'
                }`}
              >
                {s}
              </div>
              {s === 1 && <div className={`h-0.5 w-12 ${step > 1 ? 'bg-primary' : 'bg-base-300'} transition-colors`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <>
            <h2 className="text-2xl font-display font-bold text-center mb-1">Create Account</h2>
            <p className="text-center text-base-content/50 text-sm mb-6">Step 1 of 2 — Account Details</p>

            <form onSubmit={handleSubmit(onStep1Submit)} className="flex flex-col gap-4">
              <div>
                <label className="label pb-1"><span className="label-text text-sm font-medium">Full Name</span></label>
                <input
                  type="text"
                  placeholder="Your full name"
                  className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && <p className="text-error text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="label pb-1"><span className="label-text text-sm font-medium">Email</span></label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                  {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                />
                {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="label pb-1"><span className="label-text text-sm font-medium">Password</span></label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="Min 6 characters"
                    className={`input input-bordered w-full pr-10 ${errors.password ? 'input-error' : ''}`}
                    {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                  />
                  <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
              </div>

              <div>
                <label className="label pb-1"><span className="label-text text-sm font-medium">Confirm Password</span></label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Repeat your password"
                    className={`input input-bordered w-full pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (v) => v === password || 'Passwords do not match',
                    })}
                  />
                  <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40">
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-error text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>

              {/* Photo */}
              <div>
                <label className="label pb-1"><span className="label-text text-sm font-medium">Profile Photo</span></label>
                <div className="tabs tabs-bordered mb-3">
                  <button type="button" onClick={() => setPhotoTab('url')} className={`tab tab-sm gap-1 ${photoTab === 'url' ? 'tab-active' : ''}`}>
                    <Link2 size={13} /> URL
                  </button>
                  <button type="button" onClick={() => setPhotoTab('upload')} className={`tab tab-sm gap-1 ${photoTab === 'upload' ? 'tab-active' : ''}`}>
                    <Upload size={13} /> Upload
                  </button>
                </div>
                {photoTab === 'url' ? (
                  <input
                    type="url"
                    placeholder="https://your-photo-url.com/image.jpg"
                    className="input input-bordered w-full"
                    {...register('photoURL')}
                  />
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="file-input file-input-bordered w-full file-input-sm"
                    />
                    {uploading && <p className="text-xs text-primary mt-1 flex items-center gap-1"><span className="loading loading-spinner loading-xs" /> Uploading...</p>}
                    {photoPreview && (
                      <img src={photoPreview} alt="Preview" className="w-16 h-16 rounded-full object-cover mt-2 border-2 border-primary" />
                    )}
                  </div>
                )}
              </div>

              <button type="submit" className="btn btn-primary w-full rounded-xl mt-2">
                Next Step
              </button>
            </form>

            <div className="divider my-4 text-base-content/40 text-sm">or</div>
            <button onClick={() => { googleLogin(); setStep(2) }} className="btn btn-outline w-full rounded-xl gap-2">
              <GoogleIcon /> Continue with Google
            </button>

            <p className="text-center text-sm text-base-content/60 mt-5">
              Already have an account?{' '}
              <Link to="/login" className="link link-primary font-medium">Login</Link>
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-display font-bold text-center mb-1">Choose Your Role</h2>
            <p className="text-center text-base-content/50 text-sm mb-6">How will you use BiblioDrop?</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {[
                {
                  key: 'user',
                  icon: <BookOpen size={32} className="text-primary" />,
                  title: "I'm a Reader",
                  desc: 'Browse and request books delivered to your door',
                },
                {
                  key: 'librarian',
                  icon: <Library size={32} className="text-secondary" />,
                  title: "I'm a Librarian",
                  desc: 'List your books and earn from deliveries',
                },
              ].map(({ key, icon, title, desc }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setRole(key)}
                  className={`card p-5 rounded-2xl border-2 text-left transition-all ${
                    role === key
                      ? 'border-primary bg-primary/5'
                      : 'border-base-300 bg-base-200 hover:border-primary/40'
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    {icon}
                    {role === key && <CheckCircle size={20} className="text-primary" />}
                  </div>
                  <p className="font-semibold text-sm">{title}</p>
                  <p className="text-xs text-base-content/60 mt-1">{desc}</p>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn btn-ghost flex-1 rounded-xl">
                Back
              </button>
              <button
                onClick={handleCreateAccount}
                disabled={submitting || !role}
                className="btn btn-primary flex-1 rounded-xl"
              >
                {submitting ? <span className="loading loading-spinner loading-sm" /> : 'Create Account'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Register
