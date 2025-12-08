import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { email, password } = await req.json()
    
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const { data, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    })

    if (error || !data.session) {
      console.error('[Login API] Auth failed:', error?.message)
      return NextResponse.json(
        { error: error?.message || 'Login failed' }, 
        { status: 401 }
      )
    }

    console.log('[Login API] ✅ Success:', data.user.email)
    
    return NextResponse.json({ 
      success: true,
      user: data.user 
    })

  } catch (err) {
    console.error('[Login API] Error:', err)
    return NextResponse.json({ 
      error: 'Internal Server Error' 
    }, { status: 500 })
  }
}