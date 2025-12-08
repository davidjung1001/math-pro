// pages/auth/callback.js (or /app/auth/callback/page.js in app router)
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleRedirect = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      // Retrieve original page from sessionStorage
      const pendingPage = sessionStorage.getItem('pendingDownloadPage') || '/'
      router.replace(pendingPage)
    }

    handleRedirect()
  }, [router])

  return <p className="p-6 text-center">Signing you in...</p>
}
