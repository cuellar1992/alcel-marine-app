/**
 * AdvancedFilters Component
 * Expandable advanced filters panel (controlled by parent)
 */

import { useState } from 'react'
import { Filter, X, RotateCcw } from 'lucide-react'
import Button from './Button'
import Select from './Select'
import DatePicker from './DatePicker'

export default function AdvancedFilters({ 
  isOpen = false,
  onApply,
  onClear,
  jobTypes = [],
  ports = [],
  clients = [],
  hasActiveFilters = false
}) {
  const [filters, setFilters] = useState({
    searchField: 'all',
    jobType: '',
    port: '',
    client: '',
    status: '',
    invoiceIssue: '',
    dateFrom: null,
    dateTo: null
  })

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleApply = () => {
    onApply(filters)
  }

  const handleClear = () => {
    setFilters({
      searchField: 'all',
      jobType: '',
      port: '',
      client: '',
      status: '',
      invoiceIssue: '',
      dateFrom: null,
      dateTo: null
    })
    onClear()
  }

  const searchFieldOptions = [
    { value: 'all', label: 'All Fields' },
    { value: 'vesselName', label: 'Vessel Name Only' },
    { value: 'jobNumber', label: 'Job Number Only' },
    { value: 'port', label: 'Port Only' },
    { value: 'clientName', label: 'Client Name Only' }
  ]

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  const invoiceOptions = [
    { value: '', label: 'All Invoice Status' },
    { value: 'not-issued', label: 'Not Issued' },
    { value: 'issued', label: 'Issued' },
    { value: 'paid', label: 'Paid' }
  ]

  return (
    <div
      className={`overflow-hidden transition-all duration-500 ease-in-out ${
        isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
        <div className="bg-gradient-to-br from-slate-800/60 via-gray-800/60 to-slate-900/60 backdrop-blur-2xl rounded-2xl border border-white/10 p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">
          {/* Header */}
          <div className="mb-6 pb-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-semibold text-white">Advanced Filters</h3>
              </div>
              <p className="text-sm text-gray-400">Refine your search with detailed filters</p>
            </div>
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search Field Selector */}
            <Select
              label="Search In"
              name="searchField"
              value={filters.searchField}
              onChange={(e) => handleFilterChange('searchField', e.target.value)}
              options={searchFieldOptions}
              placeholder="Select field"
            />

            {/* Job Type */}
            <Select
              label="Job Type"
              name="jobType"
              value={filters.jobType}
              onChange={(e) => handleFilterChange('jobType', e.target.value)}
              options={[
                { value: '', label: 'All Job Types' },
                ...jobTypes.map(type => ({ value: type.value, label: type.label }))
              ]}
              placeholder="Select job type"
            />

            {/* Port */}
            <Select
              label="Port"
              name="port"
              value={filters.port}
              onChange={(e) => handleFilterChange('port', e.target.value)}
              options={[
                { value: '', label: 'All Ports' },
                ...ports.map(port => ({ value: port.name, label: port.name }))
              ]}
              placeholder="Select port"
            />

            {/* Client */}
            <Select
              label="Client"
              name="client"
              value={filters.client}
              onChange={(e) => handleFilterChange('client', e.target.value)}
              options={[
                { value: '', label: 'All Clients' },
                ...clients.map(client => ({ value: client.name, label: client.name }))
              ]}
              placeholder="Select client"
            />

            {/* Status */}
            <Select
              label="Status"
              name="status"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              options={statusOptions}
              placeholder="Select status"
            />

            {/* Invoice Issue */}
            <Select
              label="Invoice Status"
              name="invoiceIssue"
              value={filters.invoiceIssue}
              onChange={(e) => handleFilterChange('invoiceIssue', e.target.value)}
              options={invoiceOptions}
              placeholder="Select invoice status"
            />

            {/* Date From */}
            <DatePicker
              label="Date From"
              selected={filters.dateFrom}
              onChange={(date) => handleFilterChange('dateFrom', date)}
              placeholder="Select start date"
              maxDate={filters.dateTo || null}
            />

            {/* Date To */}
            <DatePicker
              label="Date To"
              selected={filters.dateTo}
              onChange={(date) => handleFilterChange('dateTo', date)}
              placeholder="Select end date"
              minDate={filters.dateFrom || null}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-between mt-6 pt-4 border-t border-white/10">
            {hasActiveFilters && (
              <button
                onClick={handleClear}
                className="group relative flex items-center gap-2 px-4 py-2.5 rounded-xl
                  bg-gradient-to-r from-red-500/10 to-rose-500/10 
                  border border-red-500/20 hover:border-red-400/40
                  text-red-400 hover:text-red-300
                  transition-all duration-300 
                  hover:shadow-lg hover:shadow-red-500/20
                  active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-400/10 to-red-500/0 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                <RotateCcw className="w-4 h-4 relative z-10 group-hover:rotate-180 transition-transform duration-500" />
                <span className="relative z-10 font-semibold">Clear All Filters</span>
              </button>
            )}
            <div className={`flex gap-3 ${!hasActiveFilters ? 'ml-auto' : ''}`}>
              <Button
                variant="primary"
                size="md"
                onClick={handleApply}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </div>
  )
}

