import { Suspense } from 'react'
import LoginPageClient from './LoginPageClient'

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p className="text-xl text-cyan-400 animate-pulse">Loading login form...</p>
      </div>
    }>
      <LoginPageClient />
    </Suspense>
  )
}