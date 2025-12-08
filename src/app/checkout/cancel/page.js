// app/checkout/cancel/page.js
'use client'

import Link from 'next/link'

export default function CancelPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">⚠️ Payment Cancelled</h1>
      <p className="text-gray-300 mb-6">You did not complete your subscription.</p>
      <Link href="/subscribe" className="px-4 py-2 bg-emerald-500 rounded-lg hover:bg-emerald-600 transition">
        Back to Subscription Options
      </Link>
    </div>
  )
}
