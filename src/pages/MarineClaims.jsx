/**
 * Marine Claims Page
 * Marine cargo claims and inspections
 */

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Container, Card, Input, Select, Textarea, Button, Modal, DatePicker, DateTimePicker, Table, ConfirmDialog, Pagination, SearchBar, TimeSheet } from '../components/ui'
import { claimsAPI, clientsAPI, subcontractorsAPI } from '../services'
import { useConfirm, useCacheInvalidation } from '../hooks'
import { exportClaimsToExcel, sortByJobNumber } from '../utils' // sortByJobNumber still used for export
import { Pencil, Trash2, RotateCw, Clock, Edit3, Trash, FileText, FileSpreadsheet, ArrowUpDown, ArrowUp, ArrowDown, Settings, Info } from 'lucide-react'
import TimeSheetFullScreenModal from '../components/TimeSheetFullScreenModal'

export default function MarineClaims() {
  const confirmDialog = useConfirm()
  const { invalidateCache } = useCacheInvalidation()
  
  const [formData, setFormData] = useState({
    jobNumber: '',
    clientName: '',
    subcontractName: '',
    registrationDate: null,
    clientRef: '',
    claimName: '',
    location: '',
    siteInspectionDateTime: null,
    invoiceIssue: '',
    invoiceAmount: 0,
    subcontractAmount: 0,
    netProfit: 0,
    remark: ''
  })

  // Year selector for job number generation
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString().slice(-2))

  // Claims list
  const [claims, setClaims] = useState([])
  const [editingClaim, setEditingClaim] = useState(null)
  const [viewingClaim, setViewingClaim] = useState(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [claimHistory, setClaimHistory] = useState([])

  // TimeSheet Full Screen Modal
  const [isTimeSheetModalOpen, setIsTimeSheetModalOpen] = useState(false)
  const [timeSheetClaimId, setTimeSheetClaimId] = useState(null)
  const [timeSheetClaimInfo, setTimeSheetClaimInfo] = useState(null)
  const [timeSheetRefreshKey, setTimeSheetRefreshKey] = useState(0)

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

  // Clients Management
  const [clients, setClients] = useState([])
  const [isClientModalOpen, setIsClientModalOpen] = useState(false)
  const [newClient, setNewClient] = useState('')
  const [editingClientIndex, setEditingClientIndex] = useState(null)
  const [editingClientId, setEditingClientId] = useState(null)

  // Subcontractors Management
  const [subcontractors, setSubcontractors] = useState([])
  const [isSubcontractorModalOpen, setIsSubcontractorModalOpen] = useState(false)
  const [newSubcontractor, setNewSubcontractor] = useState('')
  const [editingSubcontractorIndex, setEditingSubcontractorIndex] = useState(null)
  const [editingSubcontractorId, setEditingSubcontractorId] = useState(null)

  const [loading, setLoading] = useState(false)

  // Tooltip for Job Number info
  const [showJobNumberTooltip, setShowJobNumberTooltip] = useState(false)

  // Load claims and clients on mount
  useEffect(() => {
    loadClients()
    loadSubcontractors()
    loadClaims()
  }, [])

  // Load claims from API with pagination and search
  const loadClaims = async () => {
    try {
      const sortByParam = sortOrder ? 'jobNumber' : null
      const response = await claimsAPI.getAll(currentPage, itemsPerPage, searchDebounce, advancedFilters, sortByParam, sortOrder)
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

  // Reload claims when pagination, search, or sort changes
  useEffect(() => {
    loadClaims()
  }, [currentPage, itemsPerPage, searchDebounce, advancedFilters, sortOrder])

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

  // Excel Export Handler
  const handleExportToExcel = async () => {
    try {
      const loadingToast = toast.loading('Fetching all claims for export...')

      // Fetch ALL claims with current filters (using a very large limit)
      const response = await claimsAPI.getAll(1, 999999, searchDebounce, advancedFilters)

      if (!response.success || response.data.length === 0) {
        toast.dismiss(loadingToast)
        toast.error('No claims to export')
        return
      }

      // Sort claims intelligently by year (desc) and sequence (asc)
      const allClaims = sortByJobNumber(response.data, 'desc')

      toast.dismiss(loadingToast)
      const exportingToast = toast.loading('Generating Excel file...')

      await exportClaimsToExcel(allClaims, 'Alcel_Marine_Claims')

      toast.dismiss(exportingToast)

      const filterMessage = hasActiveFilters || searchTerm
        ? ' (filtered results)'
        : ''

      toast.success(`Successfully exported ${allClaims.length} claim${allClaims.length === 1 ? '' : 's'} to Excel!${filterMessage}`)
    } catch (error) {
      toast.error('Failed to export to Excel')
      console.error('Export error:', error)
    }
  }

  // Load clients from API
  const loadClients = async () => {
    try {
      const response = await clientsAPI.getAll()
      if (response.success) {
        setClients(response.data)
      }
    } catch (error) {
      console.error('Error loading clients:', error)
      setClients([])
    }
  }

  // Load subcontractors from API
  const loadSubcontractors = async () => {
    try {
      const response = await subcontractorsAPI.getAll()
      if (response.success) {
        setSubcontractors(response.data)
      }
    } catch (error) {
      console.error('Error loading subcontractors:', error)
      setSubcontractors([])
    }
  }

  // Client modal handlers
  const openClientModal = () => {
    setIsClientModalOpen(true)
    setNewClient('')
    setEditingClientIndex(null)
    setEditingClientId(null)
  }

  const closeClientModal = () => {
    setIsClientModalOpen(false)
    setNewClient('')
    setEditingClientIndex(null)
    setEditingClientId(null)
  }

  // Subcontractor modal handlers
  const openSubcontractorModal = () => {
    setIsSubcontractorModalOpen(true)
    setNewSubcontractor('')
    setEditingSubcontractorIndex(null)
    setEditingSubcontractorId(null)
  }

  const closeSubcontractorModal = () => {
    setIsSubcontractorModalOpen(false)
    setNewSubcontractor('')
    setEditingSubcontractorIndex(null)
    setEditingSubcontractorId(null)
  }

  // Client Management Functions
  const handleAddClient = async () => {
    if (newClient.trim()) {
      setLoading(true)
      try {
        const response = await clientsAPI.create({ name: newClient.trim() })

        if (response.success) {
          await loadClients()
          setNewClient('')
          toast.success('Client added successfully!')
        }
      } catch (error) {
        toast.error(error.message || 'Failed to add client')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleEditClient = (index, id) => {
    setEditingClientIndex(index)
    setEditingClientId(id)
    setNewClient(clients[index].name)
  }

  const handleUpdateClient = async () => {
    if (editingClientId && newClient.trim()) {
      setLoading(true)
      try {
        const response = await clientsAPI.update(editingClientId, { name: newClient.trim() })

        if (response.success) {
          await loadClients()
          setNewClient('')
          setEditingClientIndex(null)
          setEditingClientId(null)
          toast.success('Client updated successfully!')
        }
      } catch (error) {
        toast.error(error.message || 'Failed to update client')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleDeleteClient = (id) => {
    confirmDialog.confirm({
      title: 'Delete Client',
      message: 'Are you sure you want to delete this client? This action cannot be undone.',
      type: 'danger',
      onConfirm: async () => {
        setLoading(true)
        try {
          const response = await clientsAPI.delete(id)

          if (response.success) {
            await loadClients()
            toast.success('Client deleted successfully!')
          }
        } catch (error) {
          toast.error(error.message || 'Failed to delete client')
        } finally {
          setLoading(false)
        }
      }
    })
  }

  // Subcontractor Management Functions
  const handleAddSubcontractor = async () => {
    if (newSubcontractor.trim()) {
      setLoading(true)
      try {
        const response = await subcontractorsAPI.create({ name: newSubcontractor.trim() })
        
        if (response.success) {
          await loadSubcontractors()
          setNewSubcontractor('')
          toast.success('Subcontractor added successfully!')
        }
      } catch (error) {
        toast.error(error.message || 'Failed to add subcontractor')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleEditSubcontractor = (index, id) => {
    setEditingSubcontractorIndex(index)
    setEditingSubcontractorId(id)
    setNewSubcontractor(subcontractors[index].name)
  }

  const handleUpdateSubcontractor = async () => {
    if (editingSubcontractorId && newSubcontractor.trim()) {
      setLoading(true)
      try {
        const response = await subcontractorsAPI.update(editingSubcontractorId, { name: newSubcontractor.trim() })
        
        if (response.success) {
          await loadSubcontractors()
          setNewSubcontractor('')
          setEditingSubcontractorIndex(null)
          setEditingSubcontractorId(null)
          toast.success('Subcontractor updated successfully!')
        }
      } catch (error) {
        toast.error(error.message || 'Failed to update subcontractor')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleDeleteSubcontractor = (id) => {
    confirmDialog.confirm({
      title: 'Delete Subcontractor',
      message: 'Are you sure you want to delete this subcontractor? This action cannot be undone.',
      type: 'danger',
      onConfirm: async () => {
        setLoading(true)
        try {
          const response = await subcontractorsAPI.delete(id)
          
          if (response.success) {
            await loadSubcontractors()
            toast.success('Subcontractor deleted successfully!')
          }
        } catch (error) {
          toast.error(error.message || 'Failed to delete subcontractor')
        } finally {
          setLoading(false)
        }
      }
    })
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
      const response = await claimsAPI.generateNumber(selectedYear)
      if (response.success) {
        setFormData(prev => ({
          ...prev,
          jobNumber: response.data.jobNumber
        }))
      }
    } catch (error) {
      console.error('Error generating job number:', error)
      toast.error('Error generating job number')
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
          invalidateCache() // Invalidate dashboard cache after update
        }
      } else {
        const response = await claimsAPI.create(formData)
        if (response.success) {
          toast.success('Claim created successfully!')
          invalidateCache() // Invalidate dashboard cache after create
        }
      }

      // Clear form and reload claims
      setFormData({
        jobNumber: '',
        clientName: '',
        subcontractName: '',
        registrationDate: null,
        clientRef: '',
        claimName: '',
        location: '',
        siteInspectionDateTime: null,
        invoiceIssue: '',
        invoiceAmount: 0,
        subcontractAmount: 0,
        netProfit: 0,
        remark: ''
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
      clientName: claim.clientName || '',
      subcontractName: claim.subcontractName || '',
      registrationDate: new Date(claim.registrationDate),
      clientRef: claim.clientRef,
      claimName: claim.claimName,
      location: claim.location,
      siteInspectionDateTime: claim.siteInspectionDateTime ? new Date(claim.siteInspectionDateTime) : null,
      invoiceIssue: claim.invoiceIssue,
      invoiceAmount: claim.invoiceAmount || 0,
      subcontractAmount: claim.subcontractAmount || 0,
      netProfit: claim.netProfit || 0,
      remark: claim.remark || ''
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
            invalidateCache() // Invalidate dashboard cache after delete
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
      clientName: '',
      subcontractName: '',
      registrationDate: null,
      clientRef: '',
      claimName: '',
      location: '',
      siteInspectionDateTime: null,
      invoiceIssue: '',
      invoiceAmount: 0,
      subcontractAmount: 0,
      netProfit: 0,
      remark: ''
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
                <div className="flex items-center gap-1.5">
                  <label className="block text-sm font-medium text-gray-300">
                    Job Number
                    <span className="text-cyan-400 ml-1">*</span>
                  </label>
                  {!editingClaim && (
                    <div className="relative">
                      <button
                        type="button"
                        onMouseEnter={() => setShowJobNumberTooltip(true)}
                        onMouseLeave={() => setShowJobNumberTooltip(false)}
                        onClick={() => setShowJobNumberTooltip(!showJobNumberTooltip)}
                        className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                      {showJobNumberTooltip && (
                        <div className="absolute left-0 top-6 z-50 w-64 px-3 py-2 text-xs text-white bg-slate-800 border border-cyan-400/30 rounded-lg shadow-lg shadow-cyan-500/20">
                          <p className="leading-relaxed">Select year and click Generate, or auto-generated when you enter claim name</p>
                          <div className="absolute -top-1 left-4 w-2 h-2 bg-slate-800 border-l border-t border-cyan-400/30 transform rotate-45"></div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {!editingClaim && (
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="text-xs px-2 py-1 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 transition-all duration-200"
                    >
                      {/* Generate years from 2020 to 10 years in the future */}
                      {Array.from({ length: 30 }, (_, i) => {
                        const year = (2020 + i).toString().slice(-2)
                        return (
                          <option key={year} value={year}>
                            20{year}
                          </option>
                        )
                      })}
                    </select>
                    <button
                      type="button"
                      onClick={generateJobNumber}
                      className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors duration-200 flex items-center gap-1"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      Generate
                    </button>
                  </div>
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
            </div>

            {/* Client Name */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-300">
                  Client Name
                  <span className="text-cyan-400 ml-1">*</span>
                </label>
                <button
                  type="button"
                  onClick={openClientModal}
                  className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors duration-200 flex items-center gap-1"
                >
                  <Settings className="w-3.5 h-3.5" />
                  Manage Clients
                </button>
              </div>
              <select
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white
                  focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20
                  transition-all duration-300 backdrop-blur-xl hover:border-white/20 cursor-pointer"
              >
                <option value="" disabled className="bg-slate-800">
                  Select client
                </option>
                {clients.map((client) => (
                  <option
                    key={client._id}
                    value={client.name}
                    className="bg-slate-800"
                  >
                    {client.name}
                  </option>
                ))}
              </select>
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

            {/* Subcontractor Name */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-300">
                  Subcontractor Name
                </label>
                <button
                  type="button"
                  onClick={openSubcontractorModal}
                  className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors duration-200 flex items-center gap-1"
                >
                  <Settings className="w-3.5 h-3.5" />
                  Manage Sub
                </button>
              </div>
              <select
                name="subcontractName"
                value={formData.subcontractName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white 
                  focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 
                  transition-all duration-300 backdrop-blur-xl hover:border-white/20 cursor-pointer"
              >
                <option value="" className="bg-slate-800">
                  Select subcontractor (optional)
                </option>
                {subcontractors.map((subcontractor) => (
                  <option 
                    key={subcontractor._id} 
                    value={subcontractor.name}
                    className="bg-slate-800"
                  >
                    {subcontractor.name}
                  </option>
                ))}
              </select>
            </div>

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

          {/* Remark - Full Width */}
          <div className="mt-6">
            <Textarea
              label="Remark"
              name="remark"
              value={formData.remark}
              onChange={handleChange}
              placeholder="Add any additional notes or remarks..."
              rows={4}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 justify-end mt-8">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setFormData({
                  jobNumber: '',
                  clientName: '',
                  subcontractName: '',
                  registrationDate: null,
                  clientRef: '',
                  claimName: '',
                  location: '',
                  siteInspectionDateTime: null,
                  invoiceIssue: '',
                  invoiceAmount: 0,
                  subcontractAmount: 0,
                  netProfit: 0,
                  remark: ''
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
              className: 'whitespace-nowrap',
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
                <span className="font-mono font-semibold text-cyan-400 whitespace-nowrap">{value}</span>
              )
            },
            {
              key: 'clientName',
              label: 'Client',
              render: (value) => (
                <span className="text-gray-300">{value}</span>
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
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${colors[value] || ''}`}>
                    {value?.replace('-', ' ').toUpperCase()}
                  </span>
                )
              }
            },
          ]}
          data={claims}
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
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Client Name</p>
                <p className="text-lg font-semibold text-white">{viewingClaim.clientName}</p>
              </div>

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

              {viewingClaim.subcontractName && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Subcontractor Name</p>
                  <p className="text-base text-gray-300">{viewingClaim.subcontractName}</p>
                </div>
              )}

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
                key={`timesheet-${viewingClaim._id}-${timeSheetRefreshKey}`}
                claimId={viewingClaim._id}
                isVisible={true}
                onHeaderClick={() => {
                  setTimeSheetClaimId(viewingClaim._id)
                  setTimeSheetClaimInfo({
                    jobNumber: viewingClaim.jobNumber,
                    claimName: viewingClaim.claimName
                  })
                  setIsTimeSheetModalOpen(true)
                }}
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

            {/* Remark - Full Width */}
            {viewingClaim.remark && (
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Remark</p>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{viewingClaim.remark}</p>
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

      {/* TimeSheet Full Screen Modal */}
      <TimeSheetFullScreenModal
        isOpen={isTimeSheetModalOpen}
        onClose={() => {
          setIsTimeSheetModalOpen(false)
          setTimeSheetClaimId(null)
          setTimeSheetClaimInfo(null)
          // Increment refresh key to force TimeSheet reload in view modal
          setTimeSheetRefreshKey(prev => prev + 1)
        }}
        claimId={timeSheetClaimId}
        claimInfo={timeSheetClaimInfo}
      />

      {/* Clients Management Modal */}
      <Modal
        isOpen={isClientModalOpen}
        onClose={closeClientModal}
        title="Manage Clients"
        size="default"
      >
        <div className="space-y-8">
          {/* Add/Edit Form */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
              <p className="text-xs uppercase tracking-widest text-cyan-400/60 font-light">
                {editingClientIndex !== null ? 'Edit Client' : 'New Client'}
              </p>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
            </div>

            <Input
              label="Client Name"
              value={newClient}
              onChange={(e) => setNewClient(e.target.value)}
              placeholder="e.g., Marine Corp"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  if (editingClientIndex !== null) {
                    handleUpdateClient()
                  } else {
                    handleAddClient()
                  }
                }
              }}
            />

            <div className="flex gap-3 pt-2">
              {editingClientIndex !== null ? (
                <>
                  <Button
                    onClick={handleUpdateClient}
                    variant="primary"
                    size="sm"
                    className="flex-1"
                  >
                    Update
                  </Button>
                  <Button
                    onClick={() => {
                      setNewClient('')
                      setEditingClientIndex(null)
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleAddClient}
                  variant="primary"
                  size="sm"
                  className="flex-1"
                >
                  Add Client
                </Button>
              )}
            </div>
          </div>

          {/* Current Clients List */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
              <p className="text-xs uppercase tracking-widest text-blue-400/60 font-light">
                Current Clients
              </p>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
            </div>

            <div className="space-y-2">
              {clients.map((client, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-r from-slate-800/30 to-slate-900/30 hover:from-slate-800/50 hover:to-slate-900/50 hover:border-cyan-500/30 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-cyan-600/0 to-blue-600/0 group-hover:from-blue-600/5 group-hover:via-cyan-600/5 group-hover:to-blue-600/5 transition-all duration-500"></div>

                  <div className="relative p-4 flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium tracking-wide">{client.name}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClient(index, client._id)}
                        className="group/btn relative p-2 text-cyan-400 hover:text-cyan-300 transition-all duration-300 overflow-hidden rounded-lg hover:bg-cyan-500/10"
                        disabled={loading}
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
                      </button>
                      <button
                        onClick={() => handleDeleteClient(client._id)}
                        className="group/btn relative p-2 text-gray-400 hover:text-red-400 transition-all duration-300 overflow-hidden rounded-lg hover:bg-red-500/10"
                        disabled={loading}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Subcontractors Management Modal */}
      <Modal
        isOpen={isSubcontractorModalOpen}
        onClose={closeSubcontractorModal}
        title="Manage Subcontractors"
        size="default"
      >
        <div className="space-y-8">
          {/* Add/Edit Form */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
              <p className="text-xs uppercase tracking-widest text-cyan-400/60 font-light">
                {editingSubcontractorIndex !== null ? 'Edit Subcontractor' : 'New Subcontractor'}
              </p>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
            </div>

            <Input
              label="Subcontractor Name"
              value={newSubcontractor}
              onChange={(e) => setNewSubcontractor(e.target.value)}
              placeholder="e.g., ABC Marine Services"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  if (editingSubcontractorIndex !== null) {
                    handleUpdateSubcontractor()
                  } else {
                    handleAddSubcontractor()
                  }
                }
              }}
            />
            
            <div className="flex gap-3 pt-2">
              {editingSubcontractorIndex !== null ? (
                <>
                  <Button 
                    onClick={handleUpdateSubcontractor}
                    variant="primary"
                    size="sm"
                    className="flex-1"
                  >
                    Update
                  </Button>
                  <Button 
                    onClick={() => {
                      setNewSubcontractor('')
                      setEditingSubcontractorIndex(null)
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={handleAddSubcontractor}
                  variant="primary"
                  size="sm"
                  className="flex-1"
                >
                  Add Subcontractor
                </Button>
              )}
            </div>
          </div>

          {/* Current Subcontractors List */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
              <p className="text-xs uppercase tracking-widest text-blue-400/60 font-light">
                Current Subcontractors
              </p>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
            </div>

            <div className="space-y-2">
              {subcontractors.map((subcontractor, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-r from-slate-800/30 to-slate-900/30 hover:from-slate-800/50 hover:to-slate-900/50 hover:border-cyan-500/30 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-cyan-600/0 to-blue-600/0 group-hover:from-blue-600/5 group-hover:via-cyan-600/5 group-hover:to-blue-600/5 transition-all duration-500"></div>
                  
                  <div className="relative p-4 flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium tracking-wide">{subcontractor.name}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditSubcontractor(index, subcontractor._id)}
                        className="group/btn relative p-2 text-cyan-400 hover:text-cyan-300 transition-all duration-300 overflow-hidden rounded-lg hover:bg-cyan-500/10"
                        disabled={loading}
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
                      </button>
                      <button
                        onClick={() => handleDeleteSubcontractor(subcontractor._id)}
                        className="group/btn relative p-2 text-gray-400 hover:text-red-400 transition-all duration-300 overflow-hidden rounded-lg hover:bg-red-500/10"
                        disabled={loading}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </Container>
  )
}
