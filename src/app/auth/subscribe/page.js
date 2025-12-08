'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import SubscribeButton from '@/components/buttons/SubscribeButton'
import { Crown, CheckCircle, FileText, Sparkles, Zap, Lock } from 'lucide-react'
import Link from 'next/link'

export default function SubscribePage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const priceId = 'price_1STEaKC0NdgmZvso5RjiqeRf' // your Stripe price ID

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-indigo-600 font-semibold">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center border border-gray-200">
          <Lock className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h2>
          <p className="text-gray-600 mb-6">Please log in to access premium features</p>
          <Link
            href="/auth/login"
            className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-md"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-amber-200 text-amber-700 rounded-full text-sm font-semibold mb-4 shadow-sm">
            <Crown className="w-4 h-4" />
            Premium Membership
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            Unlock Your Full Learning Potential
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get unlimited access to all worksheets, answer keys, and premium features
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-lg mx-auto mb-12">
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-indigo-200 overflow-hidden transform hover:scale-105 transition-transform duration-300">
            {/* Premium Badge */}
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-center py-3 font-semibold">
              ⭐ Most Popular Choice
            </div>
            
            <div className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Premium Plan</h2>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-extrabold text-indigo-600">$14.99</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Cancel anytime</p>
              </div>

              <SubscribeButton userId={user.id} priceId={priceId} />
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            What's Included in Premium
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Benefit 1 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-100 rounded-xl">
                  <FileText className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Unlimited Worksheets</h4>
                  <p className="text-gray-600 text-sm">
                    Access all worksheets across every course and difficulty level, including exclusive mastery-level content
                  </p>
                </div>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Complete Answer Keys</h4>
                  <p className="text-gray-600 text-sm">
                    Download detailed answer keys with step-by-step explanations for every worksheet
                  </p>
                </div>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-100 rounded-xl">
                  <Sparkles className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Mastery-Level Content</h4>
                  <p className="text-gray-600 text-sm">
                    Challenge yourself with advanced mastery worksheets designed for top performers
                  </p>
                </div>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Priority Updates</h4>
                  <p className="text-gray-600 text-sm">
                    Get early access to new worksheets and features before anyone else
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial or guarantee */}
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200">
            <p className="text-gray-700 italic mb-4">
              "Premium membership has been a game-changer for my classroom. The mastery worksheets really challenge my students!"
            </p>
            <p className="text-sm text-gray-600 font-semibold">— Sarah M., Math Teacher</p>
          </div>
        </div>

        {/* FAQ or note */}
        <div className="max-w-2xl mx-auto mt-8 text-center">
          <p className="text-sm text-gray-600">
            Have questions? <Link href="/contact" className="text-indigo-600 hover:text-indigo-700 font-medium">Contact us</Link>
          </p>
        </div>
      </div>
    </div>
  )
}