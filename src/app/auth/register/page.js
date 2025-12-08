'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [userRole, setUserRole] = useState('Student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [plan, setPlan] = useState('free')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const inputClass =
    "border border-gray-600 bg-gray-700 text-white p-3 mb-4 w-full rounded-lg focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    if (loading) return

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      // ================================
      // 1️⃣ SIGN UP USER
      // ================================
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: null,   // 🔥 prevents redirect and prevents auto-login
          data: {
            first_name: firstName,
            last_name: lastName,
            role: userRole,
          },
        },
      })

      if (authError) throw authError

      const userId = authData.user?.id
      if (!userId) {
        throw new Error("Could not retrieve user ID.")
      }

      // 🔥 Prevent auto-login behavior
      await supabase.auth.signOut()

      // ================================
      // 2️⃣ INSERT PROFILE
      // ================================
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            id: userId,
            display_name: `${firstName} ${lastName}`,
            email,
            plan,
          },
        ])

      if (profileError) throw profileError

      // ================================
      // 3️⃣ SHOW SUCCESS SCREEN
      // ================================
      setSuccess(true)
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ================================
  // SUCCESS UI
  // ================================
  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <div className="bg-gray-800 p-10 rounded-2xl shadow-xl text-center border border-green-500/40">
          <div className="text-green-400 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold mb-2">Registration Successful!</h2>
          <p className="text-gray-300 mb-6">Your account has been created. You may now log in.</p>

        </div>
      </div>
    )
  }

  // ================================
  // REGISTER FORM UI
  // ================================
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <form
        onSubmit={handleRegister}
        className="p-8 bg-gray-800 rounded-xl shadow-2xl w-full max-w-md flex flex-col border border-purple-500/50"
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-purple-400">
          Create Account
        </h1>

        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={inputClass + ' mb-0'}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={inputClass + ' mb-0'}
            required
          />
        </div>

        <select
          value={userRole}
          onChange={(e) => setUserRole(e.target.value)}
          className={inputClass + ' appearance-none cursor-pointer'}
          required
        >
          <option value="Student">Student</option>
          <option value="Teacher">Teacher</option>
          <option value="Parent">Parent</option>
        </select>

        <select
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          className={inputClass + ' appearance-none cursor-pointer'}
          required
        >
          <option value="free">Free</option>
          <option value="premium">Premium</option>
        </select>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          required
        />
        <input
          type="password"
          placeholder="Password (6+ chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={inputClass + ' mb-6'}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold transition-all shadow-lg ${
            loading
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-cyan-600 text-gray-900 hover:bg-cyan-700 shadow-[0_0_15px_rgba(56,189,248,0.4)]'
          }`}
        >
          {loading ? 'Creating account...' : 'Register'}
        </button>

        {error && <p className="mt-4 text-center text-sm text-red-400">{error}</p>}
      </form>
    </div>
  )
}
