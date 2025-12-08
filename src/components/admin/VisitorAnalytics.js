import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Navigation, ChevronDown, ChevronRight, RefreshCw, ExternalLink } from 'lucide-react';

export default function SimpleVisitorAnalytics() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedVisitor, setExpandedVisitor] = useState(null);
  const [timeRange, setTimeRange] = useState(7);

  useEffect(() => {
    loadVisitors();
  }, [timeRange]);

  const loadVisitors = async () => {
    setLoading(true);
    const startDate = new Date(Date.now() - timeRange * 24 * 60 * 60 * 1000).toISOString();

    try {
      // Get all sessions
      const { data: sessions } = await supabase
        .from('user_sessions')
        .select('*')
        .gte('created_at', startDate)
        .order('created_at', { ascending: false });

      // Get all page views
      const { data: pageViews } = await supabase
        .from('page_views')
        .select('*')
        .gte('viewed_at', startDate)
        .order('viewed_at', { ascending: false });

      // Group by visitor
      const visitorMap = {};
      
      sessions?.forEach(session => {
        if (!visitorMap[session.visitor_id]) {
          visitorMap[session.visitor_id] = {
            visitorId: session.visitor_id,
            referrer: session.referrer || 'Direct',
            lastSeen: session.created_at,
            sessions: [],
            allPageViews: []
          };
        }
        
        visitorMap[session.visitor_id].sessions.push(session);
        
        // Update last seen if this session is more recent
        if (new Date(session.created_at) > new Date(visitorMap[session.visitor_id].lastSeen)) {
          visitorMap[session.visitor_id].lastSeen = session.created_at;
        }
      });

      // Add page views to visitors
      pageViews?.forEach(pv => {
        if (visitorMap[pv.visitor_id]) {
          visitorMap[pv.visitor_id].allPageViews.push(pv);
        }
      });

      // Convert to array and sort by most recent
      const visitorList = Object.values(visitorMap)
        .sort((a, b) => new Date(b.lastSeen) - new Date(a.lastSeen));

      setVisitors(visitorList);
    } catch (error) {
      console.error('Error loading visitors:', error);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading visitors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Simple Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Visitors ({visitors.length})
          </h1>
          
          <div className="flex gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm"
            >
              <option value={1}>Last 24 hours</option>
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
            </select>

            <button
              onClick={loadVisitors}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Visitor List */}
        <div className="bg-white rounded-lg shadow">
          {visitors.map((visitor, idx) => (
            <div
              key={visitor.visitorId}
              className="border-b last:border-b-0 hover:bg-gray-50"
            >
              {/* Visitor Header */}
              <div
                className="p-4 cursor-pointer flex items-center justify-between"
                onClick={() => setExpandedVisitor(
                  expandedVisitor === visitor.visitorId ? null : visitor.visitorId
                )}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {expandedVisitor === visitor.visitorId ? (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-sm text-gray-900 truncate">
                      {visitor.visitorId}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Navigation className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {cleanReferrer(visitor.referrer)}
                      </span>
                      {visitor.referrer !== 'Direct' && (
                        <a
                          href={visitor.referrer}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {visitor.allPageViews.length} pages
                    </div>
                    <div className="text-gray-500 text-xs">
                      {visitor.sessions.length} sessions
                    </div>
                  </div>
                  <div className="text-right text-gray-500">
                    {new Date(visitor.lastSeen).toLocaleDateString()}
                    <div className="text-xs">
                      {new Date(visitor.lastSeen).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded: Show Path */}
              {expandedVisitor === visitor.visitorId && (
                <div className="px-4 pb-4 bg-gray-50">
                  <div className="pl-9 space-y-3">
                    {visitor.allPageViews.length > 0 ? (
                      visitor.allPageViews.map((pv, pvIdx) => (
                        <div key={pvIdx} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold mt-1">
                            {pvIdx + 1}
                          </div>
                          <div className="flex-1 bg-white rounded p-3 border border-gray-200">
                            <div className="font-medium text-gray-900">
                              {pv.page_title || pv.page_path}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {pv.page_path}
                            </div>
                            <div className="text-xs text-gray-400 mt-2">
                              {new Date(pv.viewed_at).toLocaleString()}
                              {pv.time_spent_seconds > 0 && 
                                ` • Spent ${pv.time_spent_seconds}s`
                              }
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500 italic py-2">
                        No page views recorded
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {visitors.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No visitors in this time range
            </div>
          )}
        </div>
      </div>
    </div>
  );
}