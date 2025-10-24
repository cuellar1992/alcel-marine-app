/**
 * Invoice Overview Component
 * Shows invoice status distribution
 */

import { FileText, CheckCircle2, Clock, DollarSign } from 'lucide-react'

export default function InvoiceOverview({ data, loading = false }) {
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-white mb-4">Invoice Overview</h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
              <div className="h-8 bg-gray-700 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Ensure data is an array
  const invoiceData = Array.isArray(data) ? data : []

  // Calculate totals
  const totals = invoiceData.reduce((acc, item) => {
    acc.count += item.count || 0
    acc.amount += item.amount || 0
    return acc
  }, { count: 0, amount: 0 })

  // Get specific status data with normalized keys
  const getStatusData = (status) => {
    const normalizedStatus = status.toLowerCase().trim()
    return invoiceData.find(item => 
      item.status && item.status.toLowerCase().trim() === normalizedStatus
    ) || { count: 0, amount: 0 }
  }

  const notIssued = getStatusData('not issued')
  const issued = getStatusData('issued')
  const paid = getStatusData('paid')

  const getPercentage = (value) => {
    return totals.count > 0 ? ((value / totals.count) * 100).toFixed(1) : 0
  }

  const getAmountPercentage = (value) => {
    return totals.amount > 0 ? ((value / totals.amount) * 100).toFixed(1) : 0
  }

  // Debug log (can be removed in production)
  console.log('Invoice Overview Data:', {
    raw: data,
    normalized: invoiceData,
    notIssued,
    issued,
    paid,
    totals
  })

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Invoice Overview</h3>
        <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded">
          {totals.count} total
        </span>
      </div>
      
      {/* Total Summary */}
      <div className="mb-6 p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/20 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-sm">Total Invoices</span>
          <DollarSign className="w-5 h-5 text-blue-400" />
        </div>
        <p className="text-3xl font-bold text-white mb-1">{totals.count}</p>
        <p className="text-green-400 text-sm font-medium">
          ${totals.amount.toLocaleString()}
        </p>
      </div>

      {/* Status Breakdown */}
      <div className="space-y-4">
        {/* Not Issued */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-gray-300">Not Issued</span>
            </div>
            <div className="text-right">
              <span className="text-white font-semibold">{notIssued.count}</span>
              <span className="text-gray-400 text-xs ml-2">({getPercentage(notIssued.count)}%)</span>
            </div>
          </div>
          <div className="w-full bg-gray-700/30 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${getPercentage(notIssued.count)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            ${notIssued.amount.toLocaleString()}
          </p>
        </div>

        {/* Issued */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">Issued</span>
            </div>
            <div className="text-right">
              <span className="text-white font-semibold">{issued.count}</span>
              <span className="text-gray-400 text-xs ml-2">({getPercentage(issued.count)}%)</span>
            </div>
          </div>
          <div className="w-full bg-gray-700/30 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${getPercentage(issued.count)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            ${issued.amount.toLocaleString()}
          </p>
        </div>

        {/* Paid */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-300">Paid</span>
            </div>
            <div className="text-right">
              <span className="text-white font-semibold">{paid.count}</span>
              <span className="text-gray-400 text-xs ml-2">({getPercentage(paid.count)}%)</span>
            </div>
          </div>
          <div className="w-full bg-gray-700/30 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${getPercentage(paid.count)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            ${paid.amount.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}

