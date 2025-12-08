import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Zap, Target, TrendingUp, Clock, Award, Users } from 'lucide-react';

export default function BehavioralInsights({ timeRange = 7 }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInsights();
  }, [timeRange]);

  const loadInsights = async () => {
    setLoading(true);
    const startDate = new Date(Date.now() - timeRange * 24 * 60 * 60 * 1000).toISOString();

    try {
      const { data: sessions } = await supabase
        .from('user_sessions')
        .select('*')
        .gte('created_at', startDate);

      const { data: pageViews } = await supabase
        .from('page_views')
        .select('*')
        .gte('viewed_at', startDate);

      // 1. Most Engaged Visitor (most time spent)
      const visitorTimeSpent = {};
      pageViews?.forEach(pv => {
        if (pv.time_spent_seconds) {
          visitorTimeSpent[pv.visitor_id] = (visitorTimeSpent[pv.visitor_id] || 0) + pv.time_spent_seconds;
        }
      });
      const mostEngagedVisitor = Object.entries(visitorTimeSpent)
        .sort((a, b) => b[1] - a[1])[0];

      // 2. Power Users (visitors with 3+ sessions)
      const sessionCounts = {};
      sessions?.forEach(s => {
        sessionCounts[s.visitor_id] = (sessionCounts[s.visitor_id] || 0) + 1;
      });
      const powerUsers = Object.entries(sessionCounts)
        .filter(([_, count]) => count >= 3)
        .length;

      // 3. Average Session Duration
      const sessionDurations = {};
      pageViews?.forEach(pv => {
        if (!sessionDurations[pv.session_id]) {
          sessionDurations[pv.session_id] = { start: pv.viewed_at, end: pv.viewed_at };
        }
        if (new Date(pv.viewed_at) < new Date(sessionDurations[pv.session_id].start)) {
          sessionDurations[pv.session_id].start = pv.viewed_at;
        }
        if (new Date(pv.viewed_at) > new Date(sessionDurations[pv.session_id].end)) {
          sessionDurations[pv.session_id].end = pv.viewed_at;
        }
      });
      const durations = Object.values(sessionDurations).map(d => 
        (new Date(d.end) - new Date(d.start)) / 1000
      );
      const avgSessionDuration = durations.reduce((a, b) => a + b, 0) / durations.length;

      // 4. Most Active Hour
      const hourCounts = {};
      pageViews?.forEach(pv => {
        const hour = new Date(pv.viewed_at).getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      });
      const mostActiveHour = Object.entries(hourCounts)
        .sort((a, b) => b[1] - a[1])[0];

      // 5. Bounce Rate (single page sessions)
      const sessionPageCounts = {};
      pageViews?.forEach(pv => {
        sessionPageCounts[pv.session_id] = (sessionPageCounts[pv.session_id] || 0) + 1;
      });
      const bounces = Object.values(sessionPageCounts).filter(count => count === 1).length;
      const bounceRate = (bounces / Object.keys(sessionPageCounts).length) * 100;

      // 6. Most Common Entry Page
      const entryPages = {};
      const sessionFirstPages = {};
      pageViews?.forEach(pv => {
        if (!sessionFirstPages[pv.session_id]) {
          sessionFirstPages[pv.session_id] = pv.page_path;
          entryPages[pv.page_path] = (entryPages[pv.page_path] || 0) + 1;
        }
      });
      const topEntryPage = Object.entries(entryPages)
        .sort((a, b) => b[1] - a[1])[0];

      // 7. Weekend vs Weekday Traffic
      let weekdayViews = 0;
      let weekendViews = 0;
      pageViews?.forEach(pv => {
        const day = new Date(pv.viewed_at).getDay();
        if (day === 0 || day === 6) {
          weekendViews++;
        } else {
          weekdayViews++;
        }
      });

      // 8. New vs Returning Split
      const newVisitors = Object.values(sessionCounts).filter(count => count === 1).length;
      const returningVisitors = Object.values(sessionCounts).filter(count => count > 1).length;

      setInsights({
        mostEngagedVisitor: {
          id: mostEngagedVisitor?.[0]?.substring(0, 20) || 'N/A',
          time: Math.round(mostEngagedVisitor?.[1] / 60) || 0
        },
        powerUsers,
        avgSessionDuration: Math.round(avgSessionDuration / 60),
        mostActiveHour: mostActiveHour ? `${mostActiveHour[0]}:00` : 'N/A',
        bounceRate: bounceRate.toFixed(1),
        topEntryPage: topEntryPage?.[0] || 'N/A',
        weekdayVsWeekend: {
          weekday: weekdayViews,
          weekend: weekendViews,
          preference: weekdayViews > weekendViews ? 'Weekday' : 'Weekend'
        },
        visitorSplit: {
          new: newVisitors,
          returning: returningVisitors,
          percentReturning: ((returningVisitors / (newVisitors + returningVisitors)) * 100).toFixed(0)
        }
      });
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Analyzing behavior...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <Zap className="w-7 h-7 text-yellow-500" />
        Behavioral Insights
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Most Engaged Visitor */}
        <InsightCard
          icon={Award}
          color="yellow"
          title="Most Engaged Visitor"
          metric={`${insights.mostEngagedVisitor.time} mins`}
          subtitle={`ID: ${insights.mostEngagedVisitor.id}...`}
        />

        {/* Power Users */}
        <InsightCard
          icon={Target}
          color="purple"
          title="Power Users"
          metric={insights.powerUsers}
          subtitle="3+ sessions"
        />

        {/* Avg Session Duration */}
        <InsightCard
          icon={Clock}
          color="blue"
          title="Avg Session Duration"
          metric={`${insights.avgSessionDuration} mins`}
          subtitle="per session"
        />

        {/* Most Active Hour */}
        <InsightCard
          icon={TrendingUp}
          color="green"
          title="Peak Activity Time"
          metric={insights.mostActiveHour}
          subtitle="Most page views"
        />

        {/* Bounce Rate */}
        <InsightCard
          icon={Users}
          color="red"
          title="Bounce Rate"
          metric={`${insights.bounceRate}%`}
          subtitle="Single-page sessions"
        />

        {/* Visitor Split */}
        <InsightCard
          icon={Users}
          color="indigo"
          title="Returning Visitors"
          metric={`${insights.visitorSplit.percentReturning}%`}
          subtitle={`${insights.visitorSplit.returning} of ${insights.visitorSplit.new + insights.visitorSplit.returning} total`}
        />
      </div>

      {/* Additional Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Entry Page */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-indigo-500">
          <h3 className="font-bold text-gray-900 mb-2">Most Common Entry Page</h3>
          <p className="text-2xl font-bold text-indigo-600 break-all">{insights.topEntryPage}</p>
          <p className="text-sm text-gray-600 mt-2">Where visitors start their journey</p>
        </div>

        {/* Weekend vs Weekday */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
          <h3 className="font-bold text-gray-900 mb-2">Traffic Pattern</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-sm text-gray-600">Weekday</div>
              <div className="text-xl font-bold text-gray-900">{insights.weekdayVsWeekend.weekday}</div>
            </div>
            <div className="text-2xl font-bold text-gray-400">vs</div>
            <div className="flex-1 text-right">
              <div className="text-sm text-gray-600">Weekend</div>
              <div className="text-xl font-bold text-gray-900">{insights.weekdayVsWeekend.weekend}</div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            <span className="font-semibold text-green-600">{insights.weekdayVsWeekend.preference}</span> preferred
          </p>
        </div>
      </div>

      {/* Fun Facts */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Zap className="w-6 h-6" />
          Fun Facts
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="font-semibold">🎯 Engagement Score</div>
            <div className="text-lg font-bold mt-1">
              {(insights.avgSessionDuration * (1 - insights.bounceRate / 100)).toFixed(0)} mins
            </div>
            <div className="text-xs opacity-80">Duration × (1 - Bounce Rate)</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="font-semibold">🔥 Loyalty Rate</div>
            <div className="text-lg font-bold mt-1">
              {((insights.powerUsers / (insights.visitorSplit.new + insights.visitorSplit.returning)) * 100).toFixed(0)}%
            </div>
            <div className="text-xs opacity-80">Power users / Total visitors</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightCard({ icon: Icon, color, title, metric, subtitle }) {
  const colors = {
    yellow: 'from-yellow-400 to-yellow-500',
    purple: 'from-purple-400 to-purple-500',
    blue: 'from-blue-400 to-blue-500',
    green: 'from-green-400 to-green-500',
    red: 'from-red-400 to-red-500',
    indigo: 'from-indigo-400 to-indigo-500',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-lg shadow-lg p-6 text-white`}>
      <Icon className="w-8 h-8 mb-3 opacity-90" />
      <div className="text-3xl font-bold mb-1">{metric}</div>
      <div className="font-semibold text-sm opacity-90">{title}</div>
      <div className="text-xs opacity-75 mt-1">{subtitle}</div>
    </div>
  );
}