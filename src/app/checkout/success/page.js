// app/checkout/success/page.js
'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function SuccessContent() {
  const searchParams = useSearchParams()
  const session_id = searchParams.get('session_id')

  useEffect(() => {
    if (session_id) {
      console.log('Checkout session ID:', session_id)
    }
  }, [session_id])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">🎉 Thank you for subscribing!</h1>
      <p className="text-gray-300 text-center max-w-md">
        Your subscription is active. You now have premium access.
      </p>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <div className="animate-pulse">Loading...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}