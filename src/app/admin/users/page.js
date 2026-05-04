import UsersAnalytics from '@/components/admin/UsersAnalytics'
import Link from 'next/link'

export default function UsersAnalyticsPage() {
  return (
    <div>
      <div className="bg-white border-b px-4 py-3 flex flex-wrap gap-3">
        <Link href="/admin" className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Main Dashboard</Link>
        <Link href="/admin/users" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium">Users</Link>
        <Link href="/admin/returning" className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Returning Visitors</Link>
        <Link href="/admin/worksheet-analytics" className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Worksheet Analytics</Link>
      </div>
      <UsersAnalytics />
    </div>
  )
}
