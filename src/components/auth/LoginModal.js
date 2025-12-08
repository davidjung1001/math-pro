'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Loader2, X, CheckCircle } from 'lucide-react'

export default function LoginModal({ onClose, onLoginSuccess }) {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loginSuccessful, setLoginSuccessful] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
      
      // Sync to server cookies
      await fetch('/api/auth/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        }),
      })
      
      setLoginSuccessful(true)
      
      if (onLoginSuccess) {
        onLoginSuccess(data.user)
      }

    } catch (err) {
      console.error('❌ Login error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
    } catch (err) {
      console.error('Google login error:', err)
      setError(err.message)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleLogin()
    }
  }

  // Success state
  if (loginSuccessful) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-8 relative text-center">
          <button 
            onClick={onClose} 
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
          >
            <X className="w-5 h-5"/>
          </button>

          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Successful!</h2>
          <p className="text-gray-600 mb-6">Welcome back! You're all set to continue learning.</p>

          <div className="space-y-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
            >
              Go to Dashboard →
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Login form state
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 relative">
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
        >
          <X className="w-5 h-5"/>
        </button>

        <h2 className="text-xl font-semibold mb-2 text-gray-800 text-center">Sign In</h2>

        <p className="text-center text-sm text-green-600 mb-4">
          Log in to bookmark worksheets to view later, track progress, and access to digital quizzes!
        </p>

        <div className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-100"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-100"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md text-white font-medium transition ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin"/>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </div>

        <div className="flex items-center my-4">
          <hr className="flex-1 border-gray-300"/>
          <span className="mx-2 text-gray-400 text-sm">or</span>
          <hr className="flex-1 border-gray-300"/>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full mb-4 flex items-center justify-center gap-2 py-2 px-3 border border-gray-300 rounded-md hover:bg-gray-100 transition text-gray-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sign in with Google
        </button>

        

        <p className="text-center text-xs text-gray-500 mt-2">
          Don't have an account?{' '}
          <button
            onClick={() => {
              onClose()
              router.push('/auth/register')
            }}
            className="text-indigo-600 hover:underline"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  )
}
