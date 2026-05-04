'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import {
  Users, ChevronDown, ChevronRight, RefreshCw, Crown,
  Eye, Download, BookOpen, Clock, Activity, Search
} from 'lucide-react'

export default function UsersAnalytics() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedUser, setExpandedUser] = useState(null)
  const [userActivity, setUserActivity] = useState({})
  const [loadingActivity, setLoadingActivity] = useState(null)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('newest') // newest, oldest, name, plan

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    try {
      // Fetch auth users from server-side admin route
      const res = await fetch('/api/admin/users')
      if (!res.ok) throw new Error(await res.text())
      const { users: authUsers } = await res.json()

      // Fetch plan + is_admin from user_profiles to merge
      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('id, plan, is_admin, display_name')

      const profileMap = {}
      profiles?.forEach(p => { profileMap[p.id] = p })

      const merged = authUsers.map(u => ({
        ...u,
        display_name: profileMap[u.id]?.display_name || u.display_name,
        plan: profileMap[u.id]?.plan || 'free',
        is_admin: profileMap[u.id]?.is_admin || false,
      }))

      setUsers(merged)
    } catch (err) {
      console.error('Error loading users:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadUserActivity = async (userId) => {
    if (userActivity[userId]) {
      setExpandedUser(expandedUser === userId ? null : userId)
      return
    }

    setLoadingActivity(userId)
    try {
      const [
        { data: pageViews },
        { data: worksheetActions },
        { data: enrollments }
      ] = await Promise.all([
        supabase
          .from('page_views')
          .select('page_path, page_title, viewed_at, time_spent_seconds')
          .eq('user_id', userId)
          .order('viewed_at', { ascending: false })
          .limit(50),
        supabase
          .from('worksheet_interactions')
          .select('action_type, course_name, section_name, subsection_name, created_at, include_answers, include_choices')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(50),
        supabase
          .from('user_enrollments')
          .select('course_id, progress_percentage, last_accessed')
          .eq('user_id', userId)
      ])

      setUserActivity(prev => ({
        ...prev,
        [userId]: {
          pageViews: pageViews || [],
          worksheetActions: worksheetActions || [],
          enrollments: enrollments || [],
        }
      }))
      setExpandedUser(userId)
    } catch (err) {
      console.error('Error loading user activity:', err)
    } finally {
      setLoadingActivity(null)
    }
  }

  const filteredUsers = users
    .filter(u => {
      if (!search) return true
      const q = search.toLowerCase()
      return (
        u.email?.toLowerCase().includes(q) ||
        u.display_name?.toLowerCase().includes(q)
      )
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.created_at) - new Date(a.created_at)
        case 'oldest': return new Date(a.created_at) - new Date(b.created_at)
        case 'name': return (a.display_name || a.email || '').localeCompare(b.display_name || b.email || '')
        case 'plan': return (b.plan || '').localeCompare(a.plan || '')
        default: return 0
      }
    })

  const premiumCount = users.filter(u => u.plan === 'premium').length

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Registered Users</h1>
            <p className="text-sm text-gray-500 mt-1">
              {users.length} total · {premiumCount} premium
            </p>
          </div>
          <button
            onClick={loadUsers}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-gray-900">{users.length}</div>
            <div className="text-sm text-gray-500">Total Users</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-amber-600">{premiumCount}</div>
            <div className="text-sm text-gray-500">Premium</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 col-span-2 sm:col-span-1">
            <div className="text-2xl font-bold text-gray-900">{users.length - premiumCount}</div>
            <div className="text-sm text-gray-500">Free Plan</div>
          </div>
        </div>

        {/* Search & Sort */}
        <div className="bg-white rounded-lg shadow p-4 mb-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by email or name…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name A–Z</option>
            <option value="plan">Plan</option>
          </select>
        </div>

        {/* User List */}
        <div className="bg-white rounded-lg shadow divide-y divide-gray-100">
          {filteredUsers.length === 0 && (
            <div className="p-8 text-center text-gray-500">No users found</div>
          )}

          {filteredUsers.map(user => {
            const isExpanded = expandedUser === user.id
            const isLoadingThis = loadingActivity === user.id
            const activity = userActivity[user.id]

            return (
              <div key={user.id}>
                {/* User row */}
                <div
                  className="p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => loadUserActivity(user.id)}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm uppercase">
                    {(user.display_name || user.email || '?')[0]}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-gray-900 truncate">
                        {user.display_name || user.email}
                      </span>
                      {user.plan === 'premium' && (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
                          <Crown className="w-3 h-3" /> Premium
                        </span>
                      )}
                      {user.is_admin && (
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                          Admin
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 truncate">{user.email}</div>
                    <div className="text-xs text-gray-400">
                      Joined {new Date(user.created_at).toLocaleDateString()}
                      {user.last_sign_in_at && (
                        <span className="ml-2">· Last login {new Date(user.last_sign_in_at).toLocaleDateString()}</span>
                      )}
                      {user.provider && user.provider !== 'email' && (
                        <span className="ml-2 capitalize">· via {user.provider}</span>
                      )}
                    </div>
                  </div>

                  {/* Expand icon */}
                  <div className="flex-shrink-0 text-gray-400">
                    {isLoadingThis ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : isExpanded ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </div>
                </div>

                {/* Expanded activity */}
                {isExpanded && activity && (
                  <div className="bg-gray-50 px-4 pb-5 pt-2 space-y-5 border-t border-gray-100">

                    {/* Summary bar */}
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="flex items-center gap-1.5 text-gray-700">
                        <Eye className="w-4 h-4 text-purple-500" />
                        <strong>{activity.pageViews.length}</strong> page views
                      </span>
                      <span className="flex items-center gap-1.5 text-gray-700">
                        <Download className="w-4 h-4 text-green-500" />
                        <strong>{activity.worksheetActions.filter(a => a.action_type === 'download').length}</strong> downloads
                      </span>
                      <span className="flex items-center gap-1.5 text-gray-700">
                        <Eye className="w-4 h-4 text-blue-500" />
                        <strong>{activity.worksheetActions.filter(a => a.action_type === 'preview').length}</strong> previews
                      </span>
                      <span className="flex items-center gap-1.5 text-gray-700">
                        <BookOpen className="w-4 h-4 text-indigo-500" />
                        <strong>{activity.enrollments.length}</strong> courses enrolled
                      </span>
                    </div>

                    {/* Course enrollments */}
                    {activity.enrollments.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Course Enrollments
                        </h4>
                        <div className="space-y-2">
                          {activity.enrollments.map((e, i) => (
                            <div key={i} className="flex items-center gap-3 bg-white rounded p-3 border border-gray-200">
                              <BookOpen className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm text-gray-700">Course ID: {e.course_id}</div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                                  <div
                                    className="bg-indigo-500 h-1.5 rounded-full"
                                    style={{ width: `${e.progress_percentage || 0}%` }}
                                  />
                                </div>
                              </div>
                              <span className="text-xs font-semibold text-indigo-600 flex-shrink-0">
                                {Math.round(e.progress_percentage || 0)}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Worksheet activity */}
                    {activity.worksheetActions.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Worksheet Activity
                        </h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {activity.worksheetActions.map((a, i) => (
                            <div key={i} className="flex items-start gap-3 bg-white rounded p-3 border border-gray-200">
                              <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-1 rounded-full ${
                                a.action_type === 'download'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-purple-100 text-purple-700'
                              }`}>
                                {a.action_type}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate">
                                  {a.subsection_name || a.section_name || '—'}
                                </div>
                                <div className="text-xs text-gray-500">{a.course_name}</div>
                                {(a.include_answers || a.include_choices) && (
                                  <div className="text-xs text-gray-400">
                                    {a.include_answers && '✓ answers '}
                                    {a.include_choices && '✓ choices'}
                                  </div>
                                )}
                              </div>
                              <div className="text-xs text-gray-400 flex-shrink-0 text-right">
                                {new Date(a.created_at).toLocaleDateString()}
                                <div>{new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recent page views */}
                    {activity.pageViews.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Recent Page Views
                        </h4>
                        <div className="space-y-1.5 max-h-48 overflow-y-auto">
                          {activity.pageViews.map((pv, i) => (
                            <div key={i} className="flex items-center gap-3 bg-white rounded p-2.5 border border-gray-200">
                              <Activity className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm text-gray-800 truncate">
                                  {pv.page_title || pv.page_path}
                                </div>
                                <div className="text-xs text-gray-500">{pv.page_path}</div>
                              </div>
                              <div className="text-xs text-gray-400 flex-shrink-0 text-right">
                                {pv.time_spent_seconds > 0 && (
                                  <div className="flex items-center gap-1 mb-0.5">
                                    <Clock className="w-3 h-3" />
                                    {pv.time_spent_seconds}s
                                  </div>
                                )}
                                {new Date(pv.viewed_at).toLocaleDateString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activity.pageViews.length === 0 && activity.worksheetActions.length === 0 && activity.enrollments.length === 0 && (
                      <p className="text-sm text-gray-500 italic">No tracked activity yet for this user.</p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
