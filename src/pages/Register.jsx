import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, BookOpen, Library, CheckCircle, Upload, Link2, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
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

const getStrength = (pw) => {
  if (!pw) return 0
  let score = 0
  if (pw.length >= 6) score++
  if (pw.length >= 10) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/[0-9!@#$%^&*]/.test(pw)) score++
  return score
}

const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong']
const strengthColor = ['', 'bg-error', 'bg-warning', 'bg-info', 'bg-success']

const Register = () => {
  const { register: registerUser, googleLogin } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [role, setRole] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [photoTab, setPhotoTab] = useState('upload')
  const [photoURL, setPhotoURL] = useState('')
  const [uploading, setUploading] = useState(false)
  const [photoPreview, setPhotoPreview] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState(null)

  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const password = watch('password', '')
  const strength = getStrength(password)

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file)
      setPhotoURL(url)
      setPhotoPreview(url)
      toast.success('Photo uploaded!')
    } catch { toast.error('Upload failed') }
    finally { setUploading(false) }
  }

  const onStep1Submit = (data) => {
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
      <motion.div
        key={step}
        initial={{ opacity: 0, x: step === 2 ? 30 : -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-lg bg-base-100 rounded-3xl shadow-xl p-8 border border-base-200"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <BookOpen className="text-primary" size={24} strokeWidth={2.5} />
          <span className="font-display text-xl font-bold text-primary">BiblioDrop</span>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-7">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 ${step >= s ? 'bg-primary text-primary-content' : 'bg-base-300 text-base-content/40'}`}>{s}</div>
              {s === 1 && <div className={`flex-1 h-1 rounded-full transition-all ${step > 1 ? 'bg-primary' : 'bg-base-300'}`} />}
            </div>
          ))}
        </div>

        {step === 1 ? (
          <>
            <h2 className="font-display text-2xl text-base-content mb-1">Create Account</h2>
            <p className="text-base-content/50 text-sm mb-6">Step 1 of 2 — Account Details</p>

            <form onSubmit={handleSubmit(onStep1Submit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-base-content/70 block mb-1.5">Full Name</label>
                <input
                  className={`w-full border ${errors.name ? 'border-error' : 'border-base-300'} focus:border-primary rounded-xl px-4 py-3 text-sm bg-base-100 outline-none transition-colors focus:ring-2 focus:ring-primary/20`}
                  placeholder="Your full name"
                  {...register('name', { required: 'Name required' })}
                />
                {errors.name && <p className="text-error text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-base-content/70 block mb-1.5">Email</label>
                <input
                  type="email"
                  className={`w-full border ${errors.email ? 'border-error' : 'border-base-300'} focus:border-primary rounded-xl px-4 py-3 text-sm bg-base-100 outline-none transition-colors focus:ring-2 focus:ring-primary/20`}
                  placeholder="you@example.com"
                  {...register('email', { required: 'Email required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                />
                {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-base-content/70 block mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    className={`w-full border ${errors.password ? 'border-error' : 'border-base-300'} focus:border-primary rounded-xl px-4 pr-11 py-3 text-sm bg-base-100 outline-none transition-colors focus:ring-2 focus:ring-primary/20`}
                    placeholder="Min 6 characters"
                    {...register('password', { required: 'Password required', minLength: { value: 6, message: 'Min 6 chars' } })}
                  />
                  <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content cursor-pointer">
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {/* Strength bar */}
                {password && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor[strength] : 'bg-base-300'}`} />
                      ))}
                    </div>
                    <p className={`text-xs mt-1 ${strengthColor[strength].replace('bg-', 'text-')}`}>{strengthLabel[strength]}</p>
                  </div>
                )}
                {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-base-content/70 block mb-1.5">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    className={`w-full border ${errors.confirmPassword ? 'border-error' : 'border-base-300'} focus:border-primary rounded-xl px-4 pr-11 py-3 text-sm bg-base-100 outline-none transition-colors focus:ring-2 focus:ring-primary/20`}
                    placeholder="Repeat password"
                    {...register('confirmPassword', { required: 'Required', validate: (v) => v === password || 'Passwords do not match' })}
                  />
                  <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content cursor-pointer">
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-error text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>

              {/* Photo */}
              <div>
                <label className="text-sm font-medium text-base-content/70 block mb-1.5">Profile Photo</label>
                <div className="tabs tabs-bordered mb-3">
                  <button type="button" onClick={() => setPhotoTab('upload')} className={`tab tab-sm gap-1 ${photoTab === 'upload' ? 'tab-active' : ''}`}>
                    <Upload size={12} /> Upload
                  </button>
                  <button type="button" onClick={() => setPhotoTab('url')} className={`tab tab-sm gap-1 ${photoTab === 'url' ? 'tab-active' : ''}`}>
                    <Link2 size={12} /> URL
                  </button>
                </div>
                {photoTab === 'upload' ? (
                  <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-5 cursor-pointer transition-colors ${uploading ? 'border-primary bg-primary/5' : 'border-base-300 hover:border-primary hover:bg-base-200'}`}>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-primary" />
                    ) : uploading ? (
                      <span className="loading loading-spinner loading-md text-primary" />
                    ) : (
                      <>
                        <Upload size={24} className="text-base-content/30 mb-2" />
                        <span className="text-xs text-base-content/40">Click to upload or drag & drop</span>
                      </>
                    )}
                  </label>
                ) : (
                  <input
                    type="url"
                    placeholder="https://your-photo-url.com/image.jpg"
                    className="w-full border border-base-300 focus:border-primary rounded-xl px-4 py-3 text-sm bg-base-100 outline-none transition-colors focus:ring-2 focus:ring-primary/20"
                    {...register('photoURL')}
                  />
                )}
              </div>

              <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/25 cursor-pointer mt-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2">
                Continue
              </button>
            </form>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-base-300" />
              <span className="text-xs text-base-content/40">or</span>
              <div className="flex-1 h-px bg-base-300" />
            </div>
            <button onClick={() => { googleLogin(); setStep(2) }} className="w-full py-3 rounded-xl border border-base-300 hover:border-primary/40 hover:bg-base-200 transition-all flex items-center justify-center gap-3 text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50">
              <GoogleIcon /> Continue with Google
            </button>

            <p className="text-center text-sm text-base-content/50 mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline cursor-pointer">Sign in</Link>
            </p>
          </>
        ) : (
          <>
            <h2 className="font-display text-2xl text-base-content mb-1">Choose Your Role</h2>
            <p className="text-base-content/50 text-sm mb-6">How will you use BiblioDrop?</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7">
              {[
                { key: 'user', icon: <BookOpen size={28} className="text-primary" />, bg: 'bg-primary/10', title: "I'm a Reader", desc: 'Browse and request books delivered to your door' },
                { key: 'librarian', icon: <Library size={28} className="text-amber-500" />, bg: 'bg-amber-500/10', title: "I'm a Librarian", desc: 'List your books and earn from deliveries' },
              ].map(({ key, icon, bg, title, desc }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setRole(key)}
                  className={`relative p-5 rounded-2xl border-2 text-left transition-all cursor-pointer focus:outline-none ${role === key ? 'border-primary bg-primary/5' : 'border-base-200 hover:border-primary/30 bg-base-200'}`}
                >
                  {role === key && (
                    <span className="absolute top-3 right-3 text-primary">
                      <CheckCircle size={18} fill="currentColor" />
                    </span>
                  )}
                  <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-3`}>{icon}</div>
                  <p className="font-semibold text-sm text-base-content">{title}</p>
                  <p className="text-xs text-base-content/50 mt-1 leading-relaxed">{desc}</p>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 border border-base-300 text-base-content/70 px-5 py-3 rounded-xl text-sm hover:border-primary/40 transition-colors cursor-pointer focus:outline-none"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <button
                onClick={handleCreateAccount}
                disabled={submitting || !role}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/25 cursor-pointer disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
              >
                {submitting ? <span className="loading loading-spinner loading-sm" /> : 'Create Account'}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}

export default Register
