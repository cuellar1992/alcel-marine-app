/**
 * Table Component
 * Premium table with glassmorphism and Lucide icons
 */

import { Eye, Pencil, Trash2 } from 'lucide-react'

export default function Table({ columns, data, onView, onEdit, onDelete, className = '' }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4 opacity-20">📋</div>
        <p className="text-gray-400 text-lg">No data available</p>
        <p className="text-gray-500 text-sm mt-2">Create your first entry using the form above</p>
      </div>
    )
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider ${column.className || ''}`}
              >
                {column.label}
              </th>
            ))}
            {(onView || onEdit || onDelete) && (
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.map((row, index) => (
            <tr
              key={row._id || index}
              className="group hover:bg-white/5 transition-all duration-300"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`px-6 py-4 text-sm text-gray-300 ${column.className || ''}`}
                >
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
              {(onView || onEdit || onDelete) && (
                <td className="px-6 py-4">
                  <div className="flex gap-2 justify-center">
                    {onView && (
                      <button
                        onClick={() => onView(row)}
                        className="group/btn relative p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl hover:bg-cyan-500/20 transition-all duration-300 border border-cyan-500/20 hover:border-cyan-400/40"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="group/btn relative p-2.5 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500/20 transition-all duration-300 border border-blue-500/20 hover:border-blue-400/40"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row._id)}
                        className="group/btn relative p-2.5 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-all duration-300 border border-red-500/20 hover:border-red-400/40"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

