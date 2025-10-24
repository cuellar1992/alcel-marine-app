/**
 * Marine Claims Page
 * Marine cargo claims and inspections
 */

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Container, Card, Input, Select, Button, Modal, DatePicker, DateTimePicker, Table, ConfirmDialog, Pagination, SearchBar, TimeSheet } from '../components/ui'
import { claimsAPI } from '../services'
import { useConfirm } from '../hooks'
import { exportClaimsToExcel } from '../utils'
import { Pencil, Trash2, RotateCw, Clock, Edit3, Trash, FileText, FileSpreadsheet, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

export default function MarineClaims() {
  const confirmDialog = useConfirm()
  
  const [formData, setFormData] = useState({
    jobNumber: '',
    registrationDate: null,
    clientRef: '',
    claimName: '',
    location: '',
    siteInspectionDateTime: null,
    invoiceIssue: '',
    invoiceAmount: 0,
    subcontractAmount: 0,
    netProfit: 0
  })

  // Claims list
  const [claims, setClaims] = useState([])
  const [editingClaim, setEditingClaim] = useState(null)
  const [viewingClaim, setViewingClaim] = useState(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [claimHistory, setClaimHistory] = useState([])
  
  // Sorting
  const [sortOrder, setSortOrder] = useState(null) // null, 'asc', 'desc'
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false
  })

  // Search
  const [searchTerm, setSearchTerm] = useState('')
  const [searchDebounce, setSearchDebounce] = useState('')

  // Advanced Filters
  const [advancedFilters, setAdvancedFilters] = useState({})
  const [hasActiveFilters, setHasActiveFilters] = useState(false)

  const [loading, setLoading] = useState(false)

  // Load claims on mount
  useEffect(() => {
    loadClaims()
  }, [])

  // Load claims from API with pagination and search
  const loadClaims = async () => {
    try {
      const response = await claimsAPI.getAll(currentPage, itemsPerPage, searchDebounce, advancedFilters)
      if (response.success) {
        setClaims(response.data)
        setPagination(response.pagination)
      }
    } catch (error) {
      console.error('Error loading claims:', error)
    }
  }

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounce(searchTerm)
      setCurrentPage(1) // Reset to first page on search
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Reload claims when pagination or search changes
  useEffect(() => {
    loadClaims()
  }, [currentPage, itemsPerPage, searchDebounce, advancedFilters])

  // Calculate net profit automatically
  useEffect(() => {
    const invoice = parseFloat(formData.invoiceAmount) || 0
    const subcontract = parseFloat(formData.subcontractAmount) || 0
    const calculatedProfit = invoice - subcontract
    
    if (formData.netProfit !== calculatedProfit) {
      setFormData(prev => ({
        ...prev,
        netProfit: calculatedProfit
      }))
    }
  }, [formData.invoiceAmount, formData.subcontractAmount])

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleItemsPerPageChange = (items) => {
    setItemsPerPage(items)
    setCurrentPage(1) // Reset to first page
  }

  // Sorting Handler
  const handleSortByJobNumber = () => {
    if (sortOrder === null || sortOrder === 'desc') {
      setSortOrder('asc')
    } else {
      setSortOrder('desc')
    }
  }

  // Sort claims by job number
  const sortedClaims = [...claims].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.jobNumber.localeCompare(b.jobNumber)
    }
    if (sortOrder === 'desc') {
      return b.jobNumber.localeCompare(a.jobNumber)
    }
    return 0 // No sorting if sortOrder is null
  })

  // Excel Export Handler
  const handleExportToExcel = async () => {
    if (claims.length === 0) {
      toast.error('No claims to export')
      return
    }

    try {
      const loadingToast = toast.loading('Generating Excel file...')
      
      await exportClaimsToExcel(claims, 'Alcel_Marine_Claims')
      
      toast.dismiss(loadingToast)
      
      const filterMessage = hasActiveFilters || searchTerm 
        ? ' (filtered results)'
        : ''
      
      toast.success(`Successfully exported ${claims.length} claim${claims.length === 1 ? '' : 's'} to Excel!${filterMessage}`)
    } catch (error) {
      toast.error('Failed to export to Excel')
      console.error('Export error:', error)
    }
  }

  const handleChange = async (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Auto-generate job number when claim name is entered
    if (name === 'claimName' && value.trim() && !editingClaim && !formData.jobNumber) {
      await generateJobNumber()
    }
  }

  // Generate next job number (shared with jobs)
  const generateJobNumber = async () => {
    try {
      const response = await claimsAPI.generateNumber()
      if (response.success) {
        setFormData(prev => ({
          ...prev,
          jobNumber: response.data.jobNumber
        }))
      }
    } catch (error) {
      console.error('Error generating job number:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    setLoading(true)
    
    try {
      if (editingClaim) {
        const response = await claimsAPI.update(editingClaim._id, formData)
        if (response.success) {
          toast.success('Claim updated successfully!')
          setEditingClaim(null)
        }
      } else {
        const response = await claimsAPI.create(formData)
        if (response.success) {
          toast.success('Claim created successfully!')
        }
      }
      
      // Clear form and reload claims
      setFormData({
        jobNumber: '',
        registrationDate: null,
        clientRef: '',
        claimName: '',
        location: '',
        siteInspectionDateTime: null,
        invoiceIssue: '',
        invoiceAmount: 0,
        subcontractAmount: 0,
        netProfit: 0
      })
      await loadClaims()
      
    } catch (error) {
      toast.error(error.message || 'Failed to save claim')
    } finally {
      setLoading(false)
    }
  }

  const handleViewClaim = async (claim) => {
    setViewingClaim(claim)
    setIsViewModalOpen(true)
    
    // Load claim history
    try {
      const response = await claimsAPI.getHistory(claim._id)
      if (response.success) {
        setClaimHistory(response.data)
      }
    } catch (error) {
      console.error('Error loading claim history:', error)
      setClaimHistory([])
    }
  }

  const handleEditFromView = () => {
    if (viewingClaim) {
      setIsViewModalOpen(false)
      handleEditClaim(viewingClaim)
    }
  }

  const handleEditClaim = (claim) => {
    setEditingClaim(claim)
    setFormData({
      jobNumber: claim.jobNumber,
      registrationDate: new Date(claim.registrationDate),
      clientRef: claim.clientRef,
      claimName: claim.claimName,
      location: claim.location,
      siteInspectionDateTime: claim.siteInspectionDateTime ? new Date(claim.siteInspectionDateTime) : null,
      invoiceIssue: claim.invoiceIssue,
      invoiceAmount: claim.invoiceAmount || 0,
      subcontractAmount: claim.subcontractAmount || 0,
      netProfit: claim.netProfit || 0
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
    toast('Editing claim - modify the form above')
  }

  const handleDeleteClaim = (id) => {
    confirmDialog.confirm({
      title: 'Delete Claim',
      message: 'Are you sure you want to delete this claim? This action cannot be undone.',
      type: 'danger',
      onConfirm: async () => {
        setLoading(true)
        try {
          const response = await claimsAPI.delete(id)
          if (response.success) {
            toast.success('Claim deleted successfully!')
            await loadClaims()
          }
        } catch (error) {
          toast.error(error.message || 'Failed to delete claim')
        } finally {
          setLoading(false)
        }
      }
    })
  }

  const handleCancelEdit = () => {
    setEditingClaim(null)
    setFormData({
      jobNumber: '',
      registrationDate: null,
      clientRef: '',
      claimName: '',
      location: '',
      siteInspectionDateTime: null,
      invoiceIssue: '',
      invoiceAmount: 0,
      subcontractAmount: 0,
      netProfit: 0
    })
    toast.info('Edit cancelled')
  }

  const invoiceOptions = [
    { value: 'not-issued', label: 'Not Issued' },
    { value: 'issued', label: 'Issued' },
    { value: 'paid', label: 'Paid' },
  ]

  return (
    <Container className="py-12">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="text-5xl">📋</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
              Marine Claims & Inspections
            </h1>
        </div>
        <p className="text-gray-400 text-lg">Create and manage marine cargo claims and inspections</p>
          </div>
          
      {/* Form Card */}
      <Card variant="gradient" className="p-8 mb-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {editingClaim ? 'Edit Claim' : 'New Claim Entry'}
            </h2>
            <p className="text-gray-400 text-sm">
              {editingClaim ? 'Update the claim details below' : 'Fill in the details below to create a new claim'}
            </p>
          </div>
          {editingClaim && (
            <Button variant="outline" size="sm" onClick={handleCancelEdit}>
              Cancel Edit
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Job Number - Auto-generated */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-300">
                  Job Number
                  <span className="text-cyan-400 ml-1">*</span>
                </label>
                {!editingClaim && (
                  <button
                    type="button"
                    onClick={generateJobNumber}
                    className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors duration-200 flex items-center gap-1"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    Generate
                  </button>
                )}
              </div>
              <input
                type="text"
                name="jobNumber"
                value={formData.jobNumber}
                onChange={handleChange}
                placeholder="Auto-generated (e.g., ALCEL-25-001)"
                readOnly={!editingClaim}
                required
                className={`w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 
                  focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 
                  transition-all duration-300 backdrop-blur-xl hover:border-white/20 font-mono font-semibold text-cyan-400
                  ${!editingClaim ? 'cursor-not-allowed opacity-80' : ''}`}
              />
              {!editingClaim && (
                <p className="text-xs text-gray-500 italic">Auto-generated when you enter claim name</p>
              )}
            </div>

            {/* Registration Date - with Today button */}
            <DatePicker
              label="Registration Date"
              selected={formData.registrationDate}
              onChange={(date) => setFormData({ ...formData, registrationDate: date })}
              showTodayButton={true}
              required
            />

            {/* Client Ref */}
            <Input
              label="Client Ref"
              name="clientRef"
              value={formData.clientRef}
              onChange={handleChange}
              placeholder="Enter client reference"
              required
            />

            {/* Claim Name */}
            <Input
              label="Claim Name"
              name="claimName"
              value={formData.claimName}
              onChange={handleChange}
              placeholder="Enter claim name"
              required
            />

            {/* Location */}
            <Input
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter location"
              required
            />

            {/* Site Inspection date/time - Optional */}
            <DateTimePicker
              label="Site Inspection date/time"
              selected={formData.siteInspectionDateTime}
              onChange={(date) => setFormData({ ...formData, siteInspectionDateTime: date })}
              required={false}
            />

            {/* Invoice Issue */}
            <Select
              label="Invoice Issue"
              name="invoiceIssue"
              value={formData.invoiceIssue}
              onChange={handleChange}
              options={invoiceOptions}
              placeholder="Select invoice status"
              required
            />

            {/* Conditional Financial Fields - Only visible when Invoice is 'issued' or 'paid' */}
            {(formData.invoiceIssue === 'issued' || formData.invoiceIssue === 'paid') && (
              <>
                {/* Invoice Amount */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Invoice Amount (AUD)
                    <span className="text-cyan-400 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
                    <input
                      type="number"
                      name="invoiceAmount"
                      value={formData.invoiceAmount}
                      onChange={handleChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required
                      className="w-full pl-8 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 
                        focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 
                        transition-all duration-300 backdrop-blur-xl hover:border-white/20"
                    />
                  </div>
                </div>

                {/* Subcontract Amount */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Subcontract Amount (AUD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
                    <input
                      type="number"
                      name="subcontractAmount"
                      value={formData.subcontractAmount}
                      onChange={handleChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="w-full pl-8 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 
                        focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 
                        transition-all duration-300 backdrop-blur-xl hover:border-white/20"
                    />
                  </div>
                </div>

                {/* Net Profit - Read Only (Calculated) */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Net Profit (AUD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
                    <input
                      type="text"
                      name="netProfit"
                      value={formData.netProfit.toFixed(2)}
                      readOnly
                      className="w-full pl-8 pr-4 py-3 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 font-bold
                        cursor-not-allowed backdrop-blur-xl"
                    />
                  </div>
                  <p className="text-xs text-gray-500 italic">Calculated automatically: Invoice Amount - Subcontract Amount</p>
                </div>
              </>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 justify-end mt-8">
            <Button 
              type="button" 
              variant="secondary"
              onClick={() => {
                setFormData({
                  jobNumber: '',
                  registrationDate: null,
                  clientRef: '',
                  claimName: '',
                  location: '',
                  siteInspectionDateTime: null,
                  invoiceIssue: '',
                  invoiceAmount: 0,
                  subcontractAmount: 0,
                  netProfit: 0
                })
              }}
            >
              Clear Form
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Saving...' : (editingClaim ? 'Update Claim' : 'Create Claim')}
            </Button>
          </div>
        </form>
      </Card>

      {/* Search Bar */}
      <div className="space-y-4 mb-8">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm('')}
          placeholder="Search by claim name, job number, location, or client ref..."
          showAdvancedToggle={false}
        />
      </div>

      {/* Claims Table */}
      <Card variant="gradient" className="p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">All Claims</h2>
            <p className="text-gray-400 text-sm">
              {searchTerm ? `Searching for "${searchTerm}"` : 'View and manage all marine claims'}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Results badge */}
            {searchTerm && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">Found:</span>
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full font-semibold border border-cyan-500/30">
                  {pagination.totalItems} {pagination.totalItems === 1 ? 'result' : 'results'}
                </span>
              </div>
            )}
            
            {/* Export to Excel Button */}
            {claims.length > 0 && (
              <button
                onClick={handleExportToExcel}
                className="group relative flex items-center gap-2 px-4 py-2.5 rounded-xl
                  bg-gradient-to-r from-emerald-500/10 to-green-500/10 
                  border border-emerald-500/20 hover:border-emerald-400/40
                  text-emerald-400 hover:text-emerald-300
                  transition-all duration-300 
                  hover:shadow-lg hover:shadow-emerald-500/20
                  active:scale-95 font-semibold"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-400/10 to-emerald-500/0 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                <FileSpreadsheet className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                <span className="relative z-10">Export to Excel</span>
              </button>
            )}
          </div>
        </div>

        <Table
          columns={[
            { 
              key: 'jobNumber', 
              label: (
                <button
                  onClick={handleSortByJobNumber}
                  className="flex items-center gap-2 hover:text-cyan-400 transition-colors duration-200 group"
                >
                  <span>Job Number</span>
                  {sortOrder === null && (
                    <ArrowUpDown className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                  )}
                  {sortOrder === 'asc' && (
                    <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
                  )}
                  {sortOrder === 'desc' && (
                    <ArrowDown className="w-3.5 h-3.5 text-cyan-400" />
                  )}
                </button>
              ),
              render: (value) => (
                <span className="font-mono font-semibold text-cyan-400">{value}</span>
              )
            },
            { 
              key: 'claimName', 
              label: 'Claim Name',
              render: (value) => (
                <span className="font-semibold text-white">{value}</span>
              )
            },
            { 
              key: 'registrationDate', 
              label: 'Registration Date',
              render: (value) => (
                <div className="text-sm">
                  <div className="text-gray-300 font-medium">
                    {new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              )
            },
            { 
              key: 'location', 
              label: 'Location',
              render: (value) => (
                <span className="text-gray-300">{value}</span>
              )
            },
            { 
              key: 'clientRef', 
              label: 'Client Ref',
              render: (value) => (
                <span className="text-cyan-400 text-sm font-medium">{value}</span>
              )
            },
            { 
              key: 'invoiceIssue', 
              label: 'Invoice Status',
              render: (value) => {
                const colors = {
                  'not-issued': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
                  'issued': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
                  'paid': 'bg-green-500/20 text-green-400 border-green-500/30'
                }
                return (
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colors[value] || ''}`}>
                    {value?.replace('-', ' ').toUpperCase()}
                  </span>
                )
              }
            },
          ]}
          data={sortedClaims}
          onView={handleViewClaim}
          onEdit={handleEditClaim}
          onDelete={handleDeleteClaim}
        />

        {/* Pagination */}
        {pagination.totalItems > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}
      </Card>

      {/* Claim Details View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Claim Details"
        size="default"
      >
        {viewingClaim && (
          <div className="space-y-6">
            {/* Job Number - Highlighted */}
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl p-6 border border-cyan-500/20">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Job Number</p>
              <p className="text-3xl font-bold font-mono text-cyan-400">{viewingClaim.jobNumber}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Claim Name</p>
                <p className="text-lg font-semibold text-white">{viewingClaim.claimName}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Registration Date</p>
                <p className="text-base text-gray-300">
                  {new Date(viewingClaim.registrationDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Client Ref</p>
                <p className="text-base text-gray-300">{viewingClaim.clientRef}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Location</p>
                <p className="text-base text-gray-300">{viewingClaim.location}</p>
              </div>

              {viewingClaim.siteInspectionDateTime && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Site Inspection</p>
                  <p className="text-base text-gray-300">
                    {new Date(viewingClaim.siteInspectionDateTime).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(viewingClaim.siteInspectionDateTime).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Invoice Issue</p>
                <div className="inline-block">
                  {(() => {
                    const colors = {
                      'not-issued': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
                      'issued': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
                      'paid': 'bg-green-500/20 text-green-400 border-green-500/30'
                    }
                    return (
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${colors[viewingClaim.invoiceIssue] || ''}`}>
                        {viewingClaim.invoiceIssue?.replace('-', ' ').toUpperCase()}
                      </span>
                    )
                  })()}
                </div>
              </div>
            </div>

            {/* Time Sheet Section */}
            <div className="border-t border-white/10 pt-6 mt-6">
              <TimeSheet 
                claimId={viewingClaim._id} 
                isVisible={true}
              />
            </div>

            {/* Financial Details - Only show if invoice is issued or paid */}
            {(viewingClaim.invoiceIssue === 'issued' || viewingClaim.invoiceIssue === 'paid') && (
              <div className="border-t border-white/10 pt-6 mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-white">Financial Details</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-800/30 rounded-xl p-4 border border-white/5">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Invoice Amount</p>
                    <p className="text-2xl font-bold text-white">
                      ${(viewingClaim.invoiceAmount || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      <span className="text-sm text-gray-400 ml-2">AUD</span>
                    </p>
                  </div>

                  <div className="bg-slate-800/30 rounded-xl p-4 border border-white/5">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Subcontract Amount</p>
                    <p className="text-2xl font-bold text-white">
                      ${(viewingClaim.subcontractAmount || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      <span className="text-sm text-gray-400 ml-2">AUD</span>
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-xl p-4 border border-emerald-500/30">
                    <p className="text-xs text-emerald-400 uppercase tracking-wider mb-2">Net Profit</p>
                    <p className="text-2xl font-bold text-emerald-400">
                      ${(viewingClaim.netProfit || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      <span className="text-sm text-emerald-300 ml-2">AUD</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Change History */}
            {claimHistory.length > 0 && (
              <div className="border-t border-white/10 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-semibold text-white">Change History</h3>
                  <span className="text-xs text-gray-500 bg-slate-800/50 px-2 py-1 rounded-full">
                    {claimHistory.length} {claimHistory.length === 1 ? 'change' : 'changes'}
                  </span>
                </div>
                
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {claimHistory.map((entry) => (
                    <div 
                      key={entry._id}
                      className="bg-slate-800/30 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all duration-300"
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className={`p-2 rounded-lg ${
                          entry.action === 'created' ? 'bg-green-500/10 text-green-400' :
                          entry.action === 'updated' ? 'bg-blue-500/10 text-blue-400' :
                          'bg-red-500/10 text-red-400'
                        }`}>
                          {entry.action === 'created' ? <FileText className="w-4 h-4" /> :
                           entry.action === 'updated' ? <Edit3 className="w-4 h-4" /> :
                           <Trash className="w-4 h-4" />}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className={`text-sm font-semibold ${
                              entry.action === 'created' ? 'text-green-400' :
                              entry.action === 'updated' ? 'text-blue-400' :
                              'text-red-400'
                            }`}>
                              {entry.action.toUpperCase()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(entry.createdAt).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>

                          {/* Changed Fields */}
                          {entry.changedFields && entry.changedFields.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-400 mb-1">Modified fields:</p>
                              <div className="flex flex-wrap gap-1">
                                {entry.changedFields.map((field) => (
                                  <span 
                                    key={field}
                                    className="text-xs px-2 py-0.5 bg-cyan-500/10 text-cyan-400 rounded border border-cyan-500/20"
                                  >
                                    {field}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Modified by */}
                          <p className="text-xs text-gray-500 mt-2">
                            Modified by: {entry.modifiedBy || 'System'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="border-t border-white/10 pt-4 grid grid-cols-2 gap-4 text-xs text-gray-500">
              <div>
                <p className="uppercase tracking-wider mb-1">Created</p>
                <p>{new Date(viewingClaim.createdAt).toLocaleString('en-US')}</p>
              </div>
              <div>
                <p className="uppercase tracking-wider mb-1">Last Updated</p>
                <p>{new Date(viewingClaim.updatedAt).toLocaleString('en-US')}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                variant="secondary" 
                className="flex-1"
                onClick={() => {
                  setIsViewModalOpen(false)
                  setClaimHistory([])
                }}
              >
                Close
              </Button>
              <Button 
                variant="primary" 
                className="flex-1"
                onClick={handleEditFromView}
              >
                Edit Claim
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={confirmDialog.handleClose}
        onConfirm={confirmDialog.handleConfirm}
        title={confirmDialog.config.title}
        message={confirmDialog.config.message}
        type={confirmDialog.config.type}
      />
    </Container>
  )
}
