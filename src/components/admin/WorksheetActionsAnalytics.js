'use client'

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Download, Eye, Clock, TrendingUp, Filter, RefreshCw, ArrowUpDown } from 'lucide-react';

export default function WorksheetActionsAnalytics() {
  const [actions, setActions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(7);
  const [filterType, setFilterType] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'oldest', 'fastest', 'slowest'

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    const startDate = new Date(Date.now() - timeRange * 24 * 60 * 60 * 1000).toISOString();

    try {
      // Get worksheet actions
      const { data: actionsData } = await supabase
        .from('worksheet_interactions')
        .select('*')
        .gte('created_at', startDate)
        .order('created_at', { ascending: false })
        .limit(1000);

      // Get unique user IDs that aren't null
      const userIds = [...new Set(actionsData?.map(a => a.user_id).filter(Boolean))];
      
      // Get user data from user_profiles
      let usersData = [];
      if (userIds.length > 0) {
        const { data } = await supabase
          .from('user_profiles')
          .select('id, email')
          .in('id', userIds);
        usersData = data || [];
      }

      // Create user lookup map
      const userMap = {};
      usersData.forEach(u => {
        userMap[u.id] = u.email;
      });

      // Get session data for each action
      const sessionIds = [...new Set(actionsData?.map(a => a.session_id).filter(Boolean))];
      
      const { data: sessionsData } = await supabase
        .from('user_sessions')
        .select('session_id, device_type, browser, referrer')
        .in('session_id', sessionIds);

      // Create session lookup map
      const sessionMap = {};
      sessionsData?.forEach(s => {
        sessionMap[s.session_id] = s;
      });

      // Merge action data with session data and user data
      const enrichedActions = actionsData?.map(action => ({
        ...action,
        device_type: sessionMap[action.session_id]?.device_type || 'Unknown',
        browser: sessionMap[action.session_id]?.browser || 'Unknown',
        referrer: sessionMap[action.session_id]?.referrer || 'Direct',
        user_email: action.user_id ? (userMap[action.user_id] || 'Unknown User') : null
      }));

      console.log('Loaded actions:', enrichedActions?.length);

      // Calculate stats
      const totalActions = enrichedActions?.length || 0;
      const previews = enrichedActions?.filter(a => a.action_type === 'preview').length || 0;
      const downloads = enrichedActions?.filter(a => a.action_type === 'download').length || 0;
      const uniqueVisitors = new Set(enrichedActions?.map(a => a.visitor_id)).size;
      const avgTimeToAction = enrichedActions?.reduce((sum, a) => sum + (a.time_to_action_seconds || 0), 0) / totalActions || 0;

      // Top courses
      const courseCounts = {};
      enrichedActions?.forEach(a => {
        if (a.course_name) {
          courseCounts[a.course_name] = (courseCounts[a.course_name] || 0) + 1;
        }
      });

      // Top quizzes
      const quizCounts = {};
      enrichedActions?.forEach(a => {
        const key = `${a.subsection_name} (${a.course_name})`;
        if (!quizCounts[key]) {
          quizCounts[key] = {
            name: a.subsection_name,
            course: a.course_name,
            section: a.section_name,
            quiz_id: a.quiz_id,
            previews: 0,
            downloads: 0
          };
        }
        if (a.action_type === 'preview') quizCounts[key].previews++;
        if (a.action_type === 'download') quizCounts[key].downloads++;
      });

      // Top referrers
      const referrerCounts = {};
      enrichedActions?.forEach(a => {
        const ref = cleanReferrer(a.referrer);
        referrerCounts[ref] = (referrerCounts[ref] || 0) + 1;
      });

      setStats({
        totalActions,
        previews,
        downloads,
        uniqueVisitors,
        avgTimeToAction: avgTimeToAction.toFixed(1),
        topCourses: Object.entries(courseCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10),
        topQuizzes: Object.values(quizCounts)
          .sort((a, b) => (b.previews + b.downloads) - (a.previews + a.downloads))
          .slice(0, 20),
        topReferrers: Object.entries(referrerCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10)
      });

      setActions(enrichedActions || []);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const cleanReferrer = (url) => {
    if (!url || url === 'Direct') return 'Direct';
    try {
      const hostname = new URL(url).hostname.replace('www.', '');
      if (hostname.includes('reddit.com')) return 'Reddit';
      if (hostname.includes('google.com')) return 'Google';
      if (hostname.includes('facebook.com')) return 'Facebook';
      if (hostname.includes('twitter.com') || hostname.includes('t.co')) return 'Twitter';
      if (hostname.includes('linkedin.com')) return 'LinkedIn';
      return hostname;
    } catch {
      return url;
    }
  };

  const filteredActions = actions.filter(a => {
    if (filterType !== 'all' && a.action_type !== filterType) return false;
    if (selectedCourse !== 'all' && a.course_name !== selectedCourse) return false;
    return true;
  });

  const sortedActions = [...filteredActions].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.created_at) - new Date(a.created_at);
      case 'oldest':
        return new Date(a.created_at) - new Date(b.created_at);
      case 'fastest':
        return (a.time_to_action_seconds || 0) - (b.time_to_action_seconds || 0);
      case 'slowest':
        return (b.time_to_action_seconds || 0) - (a.time_to_action_seconds || 0);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading worksheet analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Worksheet Actions</h1>
          
          <div className="flex flex-wrap gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm"
            >
              <option value={1}>Last 24 hours</option>
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>

            <button
              onClick={loadAnalytics}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={TrendingUp}
            title="Total Actions"
            value={stats.totalActions}
            color="blue"
          />
          <StatCard
            icon={Eye}
            title="Previews"
            value={stats.previews}
            subtitle={`${((stats.previews / stats.totalActions) * 100).toFixed(0)}% of total`}
            color="purple"
          />
          <StatCard
            icon={Download}
            title="Downloads"
            value={stats.downloads}
            subtitle={`${((stats.downloads / stats.totalActions) * 100).toFixed(0)}% of total`}
            color="green"
          />
          <StatCard
            icon={Clock}
            title="Avg Time to Action"
            value={`${stats.avgTimeToAction}s`}
            color="orange"
          />
        </div>

        {/* Top Courses, Quizzes & Referrers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Top Courses */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Top Courses</h2>
            <div className="space-y-2">
              {stats.topCourses.map((course, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-gray-700 text-sm">{course.name}</span>
                  <span className="font-bold text-blue-600">{course.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Worksheets */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Top Worksheets</h2>
            <div className="space-y-3">
              {stats.topQuizzes.slice(0, 8).map((quiz, idx) => (
                <div key={idx} className="border-b pb-2 last:border-b-0">
                  <div className="font-semibold text-gray-900 text-sm">{quiz.name}</div>
                  <div className="text-xs text-gray-500">{quiz.course}</div>
                  <div className="flex gap-4 mt-1 text-xs">
                    <span className="text-purple-600">{quiz.previews} previews</span>
                    <span className="text-green-600">{quiz.downloads} downloads</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Referrers */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Top Referrers</h2>
            <div className="space-y-2">
              {stats.topReferrers.map((ref, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-gray-700 text-sm">{ref.name}</span>
                  <span className="font-bold text-blue-600">{ref.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters & Sort */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-3 items-center">
            <Filter className="w-5 h-5 text-gray-400" />
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Actions</option>
              <option value="preview">Previews Only</option>
              <option value="download">Downloads Only</option>
            </select>

            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Courses</option>
              {stats.topCourses.map((course, idx) => (
                <option key={idx} value={course.name}>{course.name}</option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
                <option value="fastest">Fastest Action</option>
                <option value="slowest">Slowest Action</option>
              </select>
            </div>

            {(filterType !== 'all' || selectedCourse !== 'all') && (
              <button
                onClick={() => {
                  setFilterType('all');
                  setSelectedCourse('all');
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Actions List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-xl font-bold text-gray-900">
              Recent Actions ({sortedActions.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Worksheet</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Visitor ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Device</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Referrer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Options</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedActions.slice(0, 100).map((action, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                        action.action_type === 'preview'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {action.action_type === 'preview' ? (
                          <Eye className="w-3 h-3" />
                        ) : (
                          <Download className="w-3 h-3" />
                        )}
                        {action.action_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="font-medium text-gray-900">{action.subsection_name}</div>
                      <div className="text-xs text-gray-500">{action.section_name}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{action.course_name}</td>
                    <td className="px-6 py-4 text-xs font-mono text-gray-600">
                      {action.visitor_id?.substring(0, 20)}...
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {action.user_email ? (
                        <span className="text-blue-600 font-medium">{action.user_email}</span>
                      ) : (
                        <span className="text-gray-400 italic">Guest</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="text-gray-900">{action.device_type}</div>
                      <div className="text-xs text-gray-500">{action.browser}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {cleanReferrer(action.referrer)}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600">
                      {action.include_choices && <div>✓ With choices</div>}
                      {action.include_answers && <div>✓ With answers</div>}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {action.time_to_action_seconds}s
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(action.created_at).toLocaleDateString()}
                      <div className="text-xs text-gray-400">
                        {new Date(action.created_at).toLocaleTimeString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, subtitle, color }) {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-lg shadow-lg p-6 text-white`}>
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-8 h-8 opacity-80" />
        <div className="text-3xl font-bold">{value}</div>
      </div>
      <div className="text-sm font-semibold opacity-90">{title}</div>
      {subtitle && <div className="text-xs opacity-75 mt-1">{subtitle}</div>}
    </div>
  );
}