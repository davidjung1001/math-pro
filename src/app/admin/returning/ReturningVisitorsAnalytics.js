'use client'

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Users, RefreshCw, TrendingUp, ArrowUpDown, Filter, ChevronDown, ChevronRight } from 'lucide-react';

export default function ReturningVisitorsAnalytics() {
  const [visitors, setVisitors] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);
  const [filterType, setFilterType] = useState('all'); // 'all', 'new', 'returning'
  const [sortBy, setSortBy] = useState('sessions'); // 'sessions', 'pages', 'recent'
  const [expandedVisitor, setExpandedVisitor] = useState(null);
  const [visitorPageViews, setVisitorPageViews] = useState({});

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    const startDate = new Date(Date.now() - timeRange * 24 * 60 * 60 * 1000).toISOString();

    try {
      // Get all page views
      const { data: pageViews } = await supabase
        .from('page_views')
        .select('*')
        .gte('viewed_at', startDate)
        .order('viewed_at', { ascending: false });

      // Get all sessions
      const { data: sessions } = await supabase
        .from('user_sessions')
        .select('*')
        .gte('created_at', startDate)
        .order('created_at', { ascending: false });

      console.log('Loaded:', pageViews?.length, 'page views,', sessions?.length, 'sessions');

      // Build visitor data
      const visitorMap = {};

      // Group sessions by visitor
      sessions?.forEach(session => {
        if (!visitorMap[session.visitor_id]) {
          visitorMap[session.visitor_id] = {
            visitor_id: session.visitor_id,
            sessions: [],
            pageViews: 0,
            firstSeen: session.created_at,
            lastSeen: session.created_at,
            device_type: session.device_type,
            browser: session.browser,
            referrer: null
          };
        }

        visitorMap[session.visitor_id].sessions.push(session);
        
        // Update last seen
        if (new Date(session.created_at) > new Date(visitorMap[session.visitor_id].lastSeen)) {
          visitorMap[session.visitor_id].lastSeen = session.created_at;
        }

        // Update first seen
        if (new Date(session.created_at) < new Date(visitorMap[session.visitor_id].firstSeen)) {
          visitorMap[session.visitor_id].firstSeen = session.created_at;
        }
      });

      // Add page view counts and referrer
      pageViews?.forEach(pv => {
        if (visitorMap[pv.visitor_id]) {
          visitorMap[pv.visitor_id].pageViews++;
          
          // Set referrer from first page view if not set
          if (!visitorMap[pv.visitor_id].referrer && pv.referrer) {
            visitorMap[pv.visitor_id].referrer = pv.referrer;
          }
        }
      });

      const visitorList = Object.values(visitorMap);

      // Calculate stats
      const totalVisitors = visitorList.length;
      const newVisitors = visitorList.filter(v => v.sessions.length === 1).length;
      const returningVisitors = visitorList.filter(v => v.sessions.length > 1).length;
      const totalSessions = sessions?.length || 0;
      const totalPageViews = pageViews?.length || 0;
      const avgSessionsPerVisitor = (totalSessions / totalVisitors).toFixed(1);
      const returningRate = ((returningVisitors / totalVisitors) * 100).toFixed(1);

      setStats({
        totalVisitors,
        newVisitors,
        returningVisitors,
        totalSessions,
        totalPageViews,
        avgSessionsPerVisitor,
        returningRate
      });

      setVisitors(visitorList);
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

  const loadVisitorSessions = async (visitorId) => {
    if (visitorPageViews[visitorId]) {
      // Already loaded
      setExpandedVisitor(expandedVisitor === visitorId ? null : visitorId);
      return;
    }

    // Load page views for this visitor
    const { data: pageViews } = await supabase
      .from('page_views')
      .select('*')
      .eq('visitor_id', visitorId)
      .order('viewed_at', { ascending: true });

    setVisitorPageViews(prev => ({
      ...prev,
      [visitorId]: pageViews || []
    }));

    setExpandedVisitor(visitorId);
  };

  const filteredVisitors = visitors.filter(v => {
    if (filterType === 'new' && v.sessions.length > 1) return false;
    if (filterType === 'returning' && v.sessions.length === 1) return false;
    return true;
  });

  const sortedVisitors = [...filteredVisitors].sort((a, b) => {
    switch (sortBy) {
      case 'sessions':
        return b.sessions.length - a.sessions.length;
      case 'pages':
        return b.pageViews - a.pageViews;
      case 'recent':
        return new Date(b.lastSeen) - new Date(a.lastSeen);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading visitor analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Returning Visitors</h1>
          
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
            icon={Users}
            title="Total Visitors"
            value={stats.totalVisitors}
            color="blue"
          />
          <StatCard
            icon={Users}
            title="New Visitors"
            value={stats.newVisitors}
            subtitle={`${((stats.newVisitors / stats.totalVisitors) * 100).toFixed(0)}% of total`}
            color="green"
          />
          <StatCard
            icon={Users}
            title="Returning Visitors"
            value={stats.returningVisitors}
            subtitle={`${stats.returningRate}% return rate`}
            color="purple"
          />
          <StatCard
            icon={TrendingUp}
            title="Avg Sessions/Visitor"
            value={stats.avgSessionsPerVisitor}
            color="orange"
          />
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
              <option value="all">All Visitors</option>
              <option value="new">New Visitors Only</option>
              <option value="returning">Returning Visitors Only</option>
            </select>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="sessions">Most Sessions</option>
                <option value="pages">Most Page Views</option>
                <option value="recent">Most Recent</option>
              </select>
            </div>

            {filterType !== 'all' && (
              <button
                onClick={() => setFilterType('all')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {/* Visitors Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-xl font-bold text-gray-900">
              Visitors ({sortedVisitors.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Visitor ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Sessions</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Page Views</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Device</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Referrer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">First Seen</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Last Seen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedVisitors.map((visitor, idx) => {
                  const isReturning = visitor.sessions.length > 1;
                  const isExpanded = expandedVisitor === visitor.visitor_id;
                  const pageViewsForVisitor = visitorPageViews[visitor.visitor_id] || [];
                  
                  return (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => loadVisitorSessions(visitor.visitor_id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>
                          <span className="text-xs font-mono text-gray-600">
                            {visitor.visitor_id.substring(0, 20)}...
                          </span>
                        </div>

                        {/* Expanded Sessions */}
                        {isExpanded && (
                          <div className="mt-4 ml-6 space-y-3">
                            {visitor.sessions.map((session, sessionIdx) => {
                              const sessionPageViews = pageViewsForVisitor.filter(
                                pv => pv.session_id === session.session_id
                              );

                              return (
                                <div key={sessionIdx} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="font-semibold text-sm text-gray-900">
                                      Session {sessionIdx + 1}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {new Date(session.created_at).toLocaleString()}
                                    </div>
                                  </div>

                                  {sessionPageViews.length > 0 ? (
                                    <div className="space-y-2">
                                      {sessionPageViews.map((pv, pvIdx) => (
                                        <div key={pvIdx} className="flex items-start gap-2 text-xs">
                                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                                            {pvIdx + 1}
                                          </span>
                                          <div className="flex-1">
                                            <div className="font-medium text-gray-900">
                                              {pv.page_title || pv.page_path}
                                            </div>
                                            <div className="text-gray-500">{pv.page_path}</div>
                                            <div className="text-gray-400 mt-1">
                                              {new Date(pv.viewed_at).toLocaleTimeString()}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="text-xs text-gray-500 italic">
                                      No page views recorded
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                          isReturning
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {isReturning ? 'Returning' : 'New'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="font-bold text-blue-600">{visitor.sessions.length}</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {visitor.pageViews}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="text-gray-900">{visitor.device_type}</div>
                        <div className="text-xs text-gray-500">{visitor.browser}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {cleanReferrer(visitor.referrer)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(visitor.firstSeen).toLocaleDateString()}
                        <div className="text-xs text-gray-400">
                          {new Date(visitor.firstSeen).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(visitor.lastSeen).toLocaleDateString()}
                        <div className="text-xs text-gray-400">
                          {new Date(visitor.lastSeen).toLocaleTimeString()}
                        </div>
                      </td>
                    </tr>
                  );
                })}
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