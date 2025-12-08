import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function POST(req) {
  try {
    const body = await req.json()
    const { access_token, refresh_token } = body

    const res = new Response(null, { status: 200 })
    const supabase = createMiddlewareClient({ req, res })

    await supabase.auth.setSession({ access_token, refresh_token })

    return res
  } catch (err) {
    console.error('set-session POST error', err)
    return new Response(JSON.stringify({ error: 'server error' }), { status: 500 })
  }
}