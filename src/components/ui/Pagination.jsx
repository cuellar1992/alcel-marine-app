/**
 * Pagination Component
 * Premium pagination with Lucide icons
 */

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

export default function Pagination({ 
  currentPage, 
  totalPages, 
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange 
}) {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  const pageNumbers = []
  const maxVisible = 5

  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
  let endPage = Math.min(totalPages, startPage + maxVisible - 1)

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i)
  }

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
      {/* Info */}
      <div className="flex items-center gap-4">
        <p className="text-sm text-gray-400">
          Showing <span className="font-semibold text-white">{startItem}</span> to{' '}
          <span className="font-semibold text-white">{endItem}</span> of{' '}
          <span className="font-semibold text-white">{totalItems}</span> results
        </p>

        {/* Items per page selector */}
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(parseInt(e.target.value))}
          className="px-3 py-1.5 bg-slate-800/50 border border-white/10 rounded-lg text-white text-sm
            focus:outline-none focus:border-cyan-400/50 transition-all duration-300 cursor-pointer"
        >
          <option value="5">5 per page</option>
          <option value="10">10 per page</option>
          <option value="25">25 per page</option>
          <option value="50">50 per page</option>
        </select>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={!canGoPrevious}
          className="p-2 rounded-lg bg-slate-800/50 border border-white/10 text-gray-400 
            hover:bg-slate-700/50 hover:text-white hover:border-cyan-400/30 
            disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-slate-800/50 disabled:hover:border-white/10
            transition-all duration-300"
          title="First Page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous Page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
          className="p-2 rounded-lg bg-slate-800/50 border border-white/10 text-gray-400 
            hover:bg-slate-700/50 hover:text-white hover:border-cyan-400/30 
            disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-slate-800/50 disabled:hover:border-white/10
            transition-all duration-300"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        <div className="flex gap-1">
          {startPage > 1 && (
            <span className="px-3 py-1.5 text-gray-500">...</span>
          )}
          
          {pageNumbers.map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`min-w-[40px] px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                pageNum === currentPage
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-slate-800/50 border border-white/10 text-gray-400 hover:bg-slate-700/50 hover:text-white hover:border-cyan-400/30'
              }`}
            >
              {pageNum}
            </button>
          ))}
          
          {endPage < totalPages && (
            <span className="px-3 py-1.5 text-gray-500">...</span>
          )}
        </div>

        {/* Next Page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          className="p-2 rounded-lg bg-slate-800/50 border border-white/10 text-gray-400 
            hover:bg-slate-700/50 hover:text-white hover:border-cyan-400/30 
            disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-slate-800/50 disabled:hover:border-white/10
            transition-all duration-300"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last Page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={!canGoNext}
          className="p-2 rounded-lg bg-slate-800/50 border border-white/10 text-gray-400 
            hover:bg-slate-700/50 hover:text-white hover:border-cyan-400/30 
            disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-slate-800/50 disabled:hover:border-white/10
            transition-all duration-300"
          title="Last Page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

