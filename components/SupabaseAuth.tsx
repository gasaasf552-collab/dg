import React, { useState } from 'react'
import { useAuth } from '../hooks/useSupabase'
import { GoogleIcon } from '../constants'

const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
)

const LockIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
)

const MailIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
)

const BuildingIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
    <line x1="9" y1="9" x2="9" y2="9.01"></line>
    <line x1="15" y1="9" x2="15" y2="9.01"></line>
    <line x1="9" y1="15" x2="9" y2="15.01"></line>
    <line x1="15" y1="15" x2="15" y2="15.01"></line>
  </svg>
)

interface SupabaseAuthProps {
  onAuthSuccess: () => void
}

const SupabaseAuth: React.FC<SupabaseAuthProps> = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        await signUp(email, password, { fullName, companyName })
        setError('Akun berhasil dibuat! Silakan cek email untuk verifikasi.')
      } else {
        await signIn(email, password)
        onAuthSuccess()
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="w-full max-w-sm mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold" style={{color: '#4f46e5'}}>
              {isSignUp ? 'Daftar Akun' : 'Login'}
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              {isSignUp 
                ? 'Buat akun untuk mulai mengelola bisnis fotografi Anda'
                : 'Masuk ke akun Anda untuk melanjutkan'
              }
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className={`p-3 border rounded-lg text-sm ${
                error.includes('berhasil') 
                  ? 'bg-green-100 border-green-200 text-green-700'
                  : 'bg-red-100 border-red-200 text-red-700'
              }`}>
                {error}
              </div>
            )}

            {isSignUp && (
              <>
                <div className="input-with-icon">
                  <UserIcon className="input-icon w-5 h-5" />
                  <input
                    type="text"
                    required
                    className="w-full h-12 px-4 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                    placeholder="Nama Lengkap"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="input-with-icon">
                  <BuildingIcon className="input-icon w-5 h-5" />
                  <input
                    type="text"
                    required
                    className="w-full h-12 px-4 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                    placeholder="Nama Perusahaan"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="input-with-icon">
              <MailIcon className="input-icon w-5 h-5" />
              <input
                type="email"
                required
                className="w-full h-12 px-4 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-with-icon">
              <LockIcon className="input-icon w-5 h-5" />
              <input
                type="password"
                required
                className="w-full h-12 px-4 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="button-primary w-full"
            >
              {loading ? 'Loading...' : (isSignUp ? 'Daftar' : 'Masuk')}
            </button>
          </form>

          <div className="flex items-center my-6">
            <hr className="flex-grow border-t border-slate-200"/>
            <span className="mx-4 text-xs font-semibold text-slate-400">ATAU</span>
            <hr className="flex-grow border-t border-slate-200"/>
          </div>

          <button className="w-full h-12 px-4 bg-white border border-slate-300 rounded-lg flex items-center justify-center gap-2 text-slate-700 font-semibold hover:bg-slate-50 transition-colors">
            <GoogleIcon className="w-5 h-5" />
            {isSignUp ? 'Daftar' : 'Masuk'} dengan Google
          </button>

          <div className="text-center mt-6 text-sm text-slate-500">
            <p>
              {isSignUp ? 'Sudah punya akun?' : 'Belum punya akun?'}{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-semibold text-blue-600 hover:underline"
              >
                {isSignUp ? 'Masuk di sini' : 'Daftar di sini'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SupabaseAuth