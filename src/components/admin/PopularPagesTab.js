export default function PopularPagesTab({ popularPages }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* The `overflow-x-auto` wrapper is already correctly placed here. */}
      <div className="overflow-x-auto">
        {/* FIX 1: Set a minimum width on the table to force the wrapper to scroll */}
        <table className="w-full min-w-[750px]">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Rank</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Page</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Total Views</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Unique Visitors</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Avg Views/Visitor</th>
            </tr>
          </thead>
          <tbody>
            {popularPages.map((page, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-lg font-bold text-gray-400">
                  #{idx + 1}
                </td>
                
                {/* FIX 2 & 3: 
                  - break-words allows long URLs/paths to wrap within the cell.
                  - max-w-xs (max-width: 20rem) constrains the cell's size.
                */}
                <td className="px-4 py-3 max-w-xs"> 
                  <p className="text-sm font-medium break-words">{page.path}</p>
                  {page.title !== page.path && (
                    <p className="text-xs text-gray-500 break-words">{page.title}</p>
                  )}
                </td>
                
                <td className="px-4 py-3 text-center text-sm font-semibold">
                  {page.views}
                </td>
                <td className="px-4 py-3 text-center text-sm">
                  {page.uniqueVisitors}
                </td>
                <td className="px-4 py-3 text-center text-sm">
                  {page.avgViewsPerVisitor}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}