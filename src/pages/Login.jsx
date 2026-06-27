import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, BookOpen, Mail, Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
)

const Login = () => {
  const { login, googleLogin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm()
  const from = location.state?.from?.pathname || '/'

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await login(data.email, data.password)
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    try { await googleLogin() }
    catch { toast.error('Google login failed'); setGoogleLoading(false) }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — Real library photo */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80"
          alt="Library interior"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-primary/60" />

        {/* Animated dot grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />

        {/* Center branding */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 h-full flex flex-col items-center justify-center p-12 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <BookOpen size={32} className="text-white" strokeWidth={2.5} />
            <span className="font-display text-3xl font-bold text-white">BiblioDrop</span>
          </div>
          <p className="font-display text-3xl text-white/90 italic leading-relaxed max-w-sm">
            "Every book is a new journey. Start yours today."
          </p>
          <div className="mt-8 flex justify-center">
            <motion.div animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}>
              <BookOpen size={72} className="text-white/20" />
            </motion.div>
          </div>
        </motion.div>

        {/* Floating testimonial card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="absolute bottom-8 left-8 right-8 z-20 bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-xl"
        >
          <div className="flex items-start gap-3">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="Reader"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-white/40 shrink-0"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
            <div>
              <p className="text-white/90 text-sm italic leading-relaxed">
                "I got 4 books delivered this month without leaving my room. BiblioDrop is incredible!"
              </p>
              <p className="text-white/60 text-xs mt-2 font-medium">Sarah Ahmed, Dhaka</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-base-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden justify-center">
            <BookOpen className="text-primary" size={24} strokeWidth={2.5} />
            <span className="font-display text-xl font-bold text-primary">BiblioDrop</span>
          </div>

          <h2 className="font-display text-3xl text-base-content mb-1">Welcome back</h2>
          <p className="text-base-content/50 text-sm mb-8">Sign in to continue your reading journey</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-base-content/70 block mb-1.5">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full border ${errors.email ? 'border-error' : 'border-base-300'} focus:border-primary rounded-xl pl-10 pr-4 py-3 text-sm bg-base-100 outline-none transition-colors focus:ring-2 focus:ring-primary/20`}
                  {...register('email', { required: 'Email required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                />
              </div>
              {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-base-content/70">Password</label>
                <button type="button" className="text-xs text-primary hover:underline cursor-pointer">Forgot password?</button>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`w-full border ${errors.password ? 'border-error' : 'border-base-300'} focus:border-primary rounded-xl pl-10 pr-11 py-3 text-sm bg-base-100 outline-none transition-colors focus:ring-2 focus:ring-primary/20`}
                  {...register('password', { required: 'Password required' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content cursor-pointer"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-lg shadow-primary/25 cursor-pointer disabled:opacity-60 disabled:pointer-events-none flex items-center justify-center gap-2 mt-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
            >
              {loading ? <span className="loading loading-spinner loading-sm" /> : 'Sign In'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-base-300" />
            <span className="text-xs text-base-content/40">or</span>
            <div className="flex-1 h-px bg-base-300" />
          </div>

          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full py-3 rounded-xl border border-base-300 bg-base-100 hover:border-primary/40 hover:bg-base-200 transition-all flex items-center justify-center gap-3 text-sm font-medium cursor-pointer disabled:opacity-60 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {googleLoading ? <span className="loading loading-spinner loading-xs" /> : <GoogleIcon />}
            Continue with Google
          </button>

          <p className="text-center text-sm text-base-content/50 mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline cursor-pointer">Sign up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
