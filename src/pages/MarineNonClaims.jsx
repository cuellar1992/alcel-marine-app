/**
 * Marine Non-Claims Page
 * Marine non-claims services with job form
 */

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Container, Card, Input, Select, Textarea, Button, Modal, DateTimePicker, Table, ConfirmDialog, Pagination, SearchBar, AdvancedFilters } from '../components/ui'
import { jobsAPI, jobTypesAPI, portsAPI, clientsAPI } from '../services'
import { useConfirm, useCacheInvalidation } from '../hooks'
import { exportJobsToExcel, sortByJobNumber } from '../utils'
import { Pencil, Trash2, Plus, RotateCw, Settings, Clock, Edit3, Trash, FileText, FileSpreadsheet, ArrowUpDown, ArrowUp, ArrowDown, Info } from 'lucide-react'

export default function MarineNonClaims() {
  const confirmDialog = useConfirm()
  const { invalidateCache } = useCacheInvalidation()
  
  const [formData, setFormData] = useState({
    jobNumber: '',
    vesselName: '',
    dateTime: null,
    etb: null,
    etd: null,
    port: '',
    jobType: '',
    clientName: '',
    subcontractName: '',
    invoiceIssue: '',
    invoiceAmount: 0,
    subcontractAmount: 0,
    netProfit: 0,
    remark: '',
    status: ''
  })

  // Year selector for job number generation
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString().slice(-2))

  // Jobs list
  const [jobs, setJobs] = useState([])
  const [editingJob, setEditingJob] = useState(null)
  const [viewingJob, setViewingJob] = useState(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [jobHistory, setJobHistory] = useState([])
  
  // Sorting
  const [sortOrder, setSortOrder] = useState(null) // null, 'asc', 'desc'
  
  // Validation
  const [etdError, setEtdError] = useState('')
  
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
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false)

  // Job Types Management
  const [jobTypes, setJobTypes] = useState([])
  const [isJobTypeModalOpen, setIsJobTypeModalOpen] = useState(false)
  const [newJobType, setNewJobType] = useState('')
  const [editingJobTypeIndex, setEditingJobTypeIndex] = useState(null)
  const [editingJobTypeId, setEditingJobTypeId] = useState(null)

  // Ports Management
  const [ports, setPorts] = useState([])
  const [isPortModalOpen, setIsPortModalOpen] = useState(false)
  const [newPort, setNewPort] = useState('')
  const [editingPortIndex, setEditingPortIndex] = useState(null)
  const [editingPortId, setEditingPortId] = useState(null)

  // Clients Management
  const [clients, setClients] = useState([])
  const [isClientModalOpen, setIsClientModalOpen] = useState(false)
  const [newClient, setNewClient] = useState('')
  const [editingClientIndex, setEditingClientIndex] = useState(null)
  const [editingClientId, setEditingClientId] = useState(null)

  const [loading, setLoading] = useState(false)

  // Tooltip for Job Number info
  const [showJobNumberTooltip, setShowJobNumberTooltip] = useState(false)

  // Load all data from backend on mount
  useEffect(() => {
    loadJobTypes()
    loadPorts()
    loadClients()
    loadJobs()
  }, [])

  // Load job types from API
  const loadJobTypes = async () => {
    try {
      const response = await jobTypesAPI.getAll()
      if (response.success) {
        setJobTypes(response.data)
      }
    } catch (error) {
      console.error('Error loading job types:', error)
      // Fallback to default types
      setJobTypes([
        { _id: '1', value: 'ballast', label: 'Ballast Water' },
        { _id: '2', value: 'bunker', label: 'Bunker Survey' },
      ])
    }
  }

  // Load jobs from API with pagination, search, and advanced filters
  const loadJobs = async () => {
    try {
      const sortByParam = sortOrder ? 'jobNumber' : null
      const response = await jobsAPI.getAll(currentPage, itemsPerPage, searchDebounce, advancedFilters, sortByParam, sortOrder)
      if (response.success) {
        setJobs(response.data)
        setPagination(response.pagination)
      }
    } catch (error) {
      console.error('Error loading jobs:', error)
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

  // Reload jobs when pagination, search, filters, or sort change
  useEffect(() => {
    loadJobs()
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

  // Validate ETD is greater than ETB
  useEffect(() => {
    if (formData.etb && formData.etd) {
      const etbDate = new Date(formData.etb)
      const etdDate = new Date(formData.etd)
      
      if (etdDate <= etbDate) {
        setEtdError('ETD must be greater than ETB')
      } else {
        setEtdError('')
      }
    } else {
      setEtdError('')
    }
  }, [formData.etb, formData.etd])

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleItemsPerPageChange = (items) => {
    setItemsPerPage(items)
    setCurrentPage(1) // Reset to first page
  }

  // Advanced Filters Handlers
  const handleApplyFilters = (filters) => {
    setAdvancedFilters(filters)
    setCurrentPage(1)
    
    // Check if any filters are active (excluding 'all' for searchField)
    const isActive = 
      (filters.searchField && filters.searchField !== 'all') ||
      filters.jobType ||
      filters.port ||
      filters.client ||
      filters.status ||
      filters.invoiceIssue ||
      filters.dateFrom ||
      filters.dateTo
    
    setHasActiveFilters(isActive)
    setIsAdvancedFiltersOpen(false) // Close panel after apply
    
    if (isActive) {
      toast.success('Advanced filters applied!')
    }
  }

  const handleClearFilters = () => {
    setAdvancedFilters({})
    setHasActiveFilters(false)
    setCurrentPage(1)
    toast.info('All filters cleared')
  }

  const handleToggleAdvancedFilters = () => {
    setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)
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
      const loadingToast = toast.loading('Fetching all jobs for export...')

      // Fetch ALL jobs with current filters (using a very large limit)
      const response = await jobsAPI.getAll(1, 999999, searchDebounce, advancedFilters)

      if (!response.success || response.data.length === 0) {
        toast.dismiss(loadingToast)
        toast.error('No jobs to export')
        return
      }

      // Sort jobs intelligently by year (desc) and sequence (asc)
      const allJobs = sortByJobNumber(response.data, 'desc')

      toast.dismiss(loadingToast)
      const exportingToast = toast.loading('Generating Excel file...')

      // Export ALL filtered/searched jobs
      await exportJobsToExcel(allJobs, 'Alcel_Marine_Jobs')

      toast.dismiss(exportingToast)

      // Show message based on filters/search
      const filterMessage = hasActiveFilters || searchTerm
        ? ' (filtered results)'
        : ''

      toast.success(`Successfully exported ${allJobs.length} job${allJobs.length === 1 ? '' : 's'} to Excel!${filterMessage}`)
    } catch (error) {
      toast.error('Failed to export to Excel')
      console.error('Export error:', error)
    }
  }

  // Load ports from API
  const loadPorts = async () => {
    try {
      const response = await portsAPI.getAll()
      if (response.success) {
        setPorts(response.data)
      }
    } catch (error) {
      console.error('Error loading ports:', error)
      setPorts([
        { _id: '1', name: 'Sydney' },
        { _id: '2', name: 'Melbourne' },
      ])
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

  const handleChange = async (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Auto-generate job number when vessel name is entered
    if (name === 'vesselName' && value.trim() && !editingJob && !formData.jobNumber) {
      await generateJobNumber()
    }
  }

  // Generate next job number
  const generateJobNumber = async () => {
    try {
      const response = await jobsAPI.generateNumber(selectedYear)
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
    
    // Validate ETD > ETB before submitting
    if (etdError) {
      toast.error('Please fix validation errors before submitting')
      return
    }
    
    setLoading(true)
    
    try {
      if (editingJob) {
        const response = await jobsAPI.update(editingJob._id, formData)
        if (response.success) {
          toast.success('Job updated successfully!')
          setEditingJob(null)
          invalidateCache() // Invalidate dashboard cache after update
        }
      } else {
        const response = await jobsAPI.create(formData)
        if (response.success) {
          toast.success('Job created successfully!')
          invalidateCache() // Invalidate dashboard cache after create
        }
      }

      // Clear form and reload jobs
      setEtdError('')
      setFormData({
        jobNumber: '',
        vesselName: '',
        dateTime: null,
        etb: null,
        etd: null,
        port: '',
        jobType: '',
        clientName: '',
        subcontractName: '',
        invoiceIssue: '',
        invoiceAmount: 0,
        subcontractAmount: 0,
        netProfit: 0,
        remark: '',
        status: ''
      })
      await loadJobs()
      
    } catch (error) {
      toast.error(error.message || 'Failed to save job')
    } finally {
      setLoading(false)
    }
  }

  const handleViewJob = async (job) => {
    setViewingJob(job)
    setIsViewModalOpen(true)
    
    // Load job history
    try {
      const response = await jobsAPI.getHistory(job._id)
      if (response.success) {
        setJobHistory(response.data)
      }
    } catch (error) {
      console.error('Error loading job history:', error)
      setJobHistory([])
    }
  }

  const handleEditFromView = () => {
    if (viewingJob) {
      setIsViewModalOpen(false)
      handleEditJob(viewingJob)
    }
  }

  const handleEditJob = (job) => {
    setEditingJob(job)
    setFormData({
      jobNumber: job.jobNumber,
      vesselName: job.vesselName,
      dateTime: new Date(job.dateTime),
      etb: job.etb ? new Date(job.etb) : null,
      etd: job.etd ? new Date(job.etd) : null,
      port: job.port,
      jobType: job.jobType,
      clientName: job.clientName,
      subcontractName: job.subcontractName || '',
      invoiceIssue: job.invoiceIssue,
      invoiceAmount: job.invoiceAmount || 0,
      subcontractAmount: job.subcontractAmount || 0,
      netProfit: job.netProfit || 0,
      remark: job.remark || '',
      status: job.status
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
    toast('Editing job - modify the form above')
  }

  const handleDeleteJob = (id) => {
    confirmDialog.confirm({
      title: 'Delete Job',
      message: 'Are you sure you want to delete this job? This action cannot be undone.',
      type: 'danger',
      onConfirm: async () => {
        setLoading(true)
        try {
          const response = await jobsAPI.delete(id)
          if (response.success) {
            toast.success('Job deleted successfully!')
            invalidateCache() // Invalidate dashboard cache after delete
            await loadJobs()
          }
        } catch (error) {
          toast.error(error.message || 'Failed to delete job')
        } finally {
          setLoading(false)
        }
      }
    })
  }

  const handleCancelEdit = () => {
    setEditingJob(null)
    setEtdError('')
    setFormData({
      jobNumber: '',
      vesselName: '',
      dateTime: null,
      etb: null,
      etd: null,
      port: '',
      jobType: '',
      clientName: '',
      subcontractName: '',
      invoiceIssue: '',
      invoiceAmount: 0,
      subcontractAmount: 0,
      netProfit: 0,
      remark: '',
      status: ''
    })
    toast.info('Edit cancelled')
  }

  // Generate value from label (lowercase, replace spaces with hyphens)
  const generateValue = (label) => {
    return label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }

  // Job Type Modal Functions
  const openJobTypeModal = () => {
    setIsJobTypeModalOpen(true)
    setNewJobType('')
    setEditingJobTypeIndex(null)
    setEditingJobTypeId(null)
  }

  const closeJobTypeModal = () => {
    setIsJobTypeModalOpen(false)
    setNewJobType('')
    setEditingJobTypeIndex(null)
    setEditingJobTypeId(null)
  }

  // Port Modal Functions
  const openPortModal = () => {
    setIsPortModalOpen(true)
    setNewPort('')
    setEditingPortIndex(null)
    setEditingPortId(null)
  }

  const closePortModal = () => {
    setIsPortModalOpen(false)
    setNewPort('')
    setEditingPortIndex(null)
    setEditingPortId(null)
  }

  // Client Modal Functions
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

  const handleAddJobType = async () => {
    if (newJobType.trim()) {
      setLoading(true)
      try {
        const newType = {
          value: generateValue(newJobType),
          label: newJobType.trim()
        }
        const response = await jobTypesAPI.create(newType)
        
        if (response.success) {
          await loadJobTypes()
          setNewJobType('')
          toast.success('Job type added successfully!')
        }
      } catch (error) {
        toast.error(error.message || 'Failed to add job type')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleEditJobType = (index, id) => {
    setEditingJobTypeIndex(index)
    setEditingJobTypeId(id)
    setNewJobType(jobTypes[index].label)
  }

  const handleUpdateJobType = async () => {
    if (editingJobTypeId && newJobType.trim()) {
      setLoading(true)
      try {
        const updated = {
          value: generateValue(newJobType),
          label: newJobType.trim()
        }
        const response = await jobTypesAPI.update(editingJobTypeId, updated)
        
        if (response.success) {
          await loadJobTypes()
          setNewJobType('')
          setEditingJobTypeIndex(null)
          setEditingJobTypeId(null)
          toast.success('Job type updated successfully!')
        }
      } catch (error) {
        toast.error(error.message || 'Failed to update job type')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleDeleteJobType = (id) => {
    confirmDialog.confirm({
      title: 'Delete Job Type',
      message: 'Are you sure you want to delete this job type? This action cannot be undone.',
      type: 'danger',
      onConfirm: async () => {
        setLoading(true)
        try {
          const response = await jobTypesAPI.delete(id)
          
          if (response.success) {
            await loadJobTypes()
            toast.success('Job type deleted successfully!')
          }
        } catch (error) {
          toast.error(error.message || 'Failed to delete job type')
        } finally {
          setLoading(false)
        }
      }
    })
  }

  // Port Management Functions
  const handleAddPort = async () => {
    if (newPort.trim()) {
      setLoading(true)
      try {
        const response = await portsAPI.create({ name: newPort.trim() })
        
        if (response.success) {
          await loadPorts()
          setNewPort('')
          toast.success('Port added successfully!')
        }
      } catch (error) {
        toast.error(error.message || 'Failed to add port')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleEditPort = (index, id) => {
    setEditingPortIndex(index)
    setEditingPortId(id)
    setNewPort(ports[index].name)
  }

  const handleUpdatePort = async () => {
    if (editingPortId && newPort.trim()) {
      setLoading(true)
      try {
        const response = await portsAPI.update(editingPortId, { name: newPort.trim() })
        
        if (response.success) {
          await loadPorts()
          setNewPort('')
          setEditingPortIndex(null)
          setEditingPortId(null)
          toast.success('Port updated successfully!')
        }
      } catch (error) {
        toast.error(error.message || 'Failed to update port')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleDeletePort = (id) => {
    confirmDialog.confirm({
      title: 'Delete Port',
      message: 'Are you sure you want to delete this port? This action cannot be undone.',
      type: 'danger',
      onConfirm: async () => {
        setLoading(true)
        try {
          const response = await portsAPI.delete(id)
          
          if (response.success) {
            await loadPorts()
            toast.success('Port deleted successfully!')
          }
        } catch (error) {
          toast.error(error.message || 'Failed to delete port')
        } finally {
          setLoading(false)
        }
      }
    })
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

  const jobTypeOptions = jobTypes

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ]

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
          <div className="text-5xl">🚢</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
            Marine Non-Claims Services
          </h1>
        </div>
      </div>

      {/* Form Card */}
      <Card variant="gradient" className="p-8 mb-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {editingJob ? 'Edit Job' : 'New Job Entry'}
            </h2>
            <p className="text-gray-400 text-sm">
              {editingJob ? 'Update the job details below' : 'Fill in the details below to create a new job'}
            </p>
          </div>
          {editingJob && (
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
                  {!editingJob && (
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
                          <p className="leading-relaxed">Select year and click Generate, or auto-generated when you enter vessel name</p>
                          <div className="absolute -top-1 left-4 w-2 h-2 bg-slate-800 border-l border-t border-cyan-400/30 transform rotate-45"></div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {!editingJob && (
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
                readOnly={!editingJob}
                required
                className={`w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500
                  focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20
                  transition-all duration-300 backdrop-blur-xl hover:border-white/20 font-mono font-semibold text-cyan-400
                  ${!editingJob ? 'cursor-not-allowed opacity-80' : ''}`}
              />
            </div>

            {/* Vessel Name */}
            <Input
              label="Vessel Name"
              name="vesselName"
              value={formData.vesselName}
              onChange={handleChange}
              placeholder="Enter vessel name"
              required
            />

            {/* Inspection Date & Time */}
            <DateTimePicker
              label="Inspection Date & Time"
              selected={formData.dateTime}
              onChange={(date) => setFormData({ ...formData, dateTime: date })}
              required
            />

            {/* ETB - Estimated Time of Berthing */}
            <DateTimePicker
              label="ETB (Estimated Time of Berthing)"
              selected={formData.etb}
              onChange={(date) => setFormData({ ...formData, etb: date })}
              required={false}
            />

            {/* ETD - Estimated Time of Departure */}
            <div className="space-y-2">
              <DateTimePicker
                label="ETD (Estimated Time of Departure)"
                selected={formData.etd}
                onChange={(date) => setFormData({ ...formData, etd: date })}
                minDate={formData.etb || null}
                required={false}
              />
              {etdError && (
                <p className="text-sm text-red-400 flex items-center gap-1 animate-fade-in">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {etdError}
                </p>
              )}
            </div>

            {/* Port */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-300">
                  Port
                  <span className="text-cyan-400 ml-1">*</span>
                </label>
                <button
                  type="button"
                  onClick={openPortModal}
                  className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors duration-200 flex items-center gap-1"
                >
                  <Settings className="w-3.5 h-3.5" />
                  Manage Ports
                </button>
              </div>
              <select
                name="port"
                value={formData.port}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white 
                  focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 
                  transition-all duration-300 backdrop-blur-xl hover:border-white/20 cursor-pointer"
              >
                <option value="" disabled className="bg-slate-800">
                  Select port
                </option>
                {ports.map((port) => (
                  <option 
                    key={port._id} 
                    value={port.name}
                    className="bg-slate-800"
                  >
                    {port.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Job Type */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-300">
                  Job Type
                  <span className="text-cyan-400 ml-1">*</span>
                </label>
                <button
                  type="button"
                  onClick={openJobTypeModal}
                  className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors duration-200 flex items-center gap-1"
                >
                  <Settings className="w-3.5 h-3.5" />
                  Manage Types
                </button>
              </div>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white 
                  focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 
                  transition-all duration-300 backdrop-blur-xl hover:border-white/20 cursor-pointer"
              >
                <option value="" disabled className="bg-slate-800">
                  Select job type
                </option>
                {jobTypeOptions.map((option) => (
                  <option 
                    key={option.value} 
                    value={option.value}
                    className="bg-slate-800"
                  >
                    {option.label}
                  </option>
                ))}
              </select>
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

            {/* Subcontract Name */}
            <Input
              label="Subcontract Name"
              name="subcontractName"
              value={formData.subcontractName}
              onChange={handleChange}
              placeholder="Enter subcontract name"
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

            {/* Status */}
            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={statusOptions}
              placeholder="Select status"
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
                setEtdError('')
                setFormData({
                  jobNumber: '',
                  vesselName: '',
                  dateTime: null,
                  etb: null,
                  etd: null,
                  port: '',
                  jobType: '',
                  clientName: '',
                  subcontractName: '',
                  invoiceIssue: '',
                  invoiceAmount: 0,
                  subcontractAmount: 0,
                  netProfit: 0,
                  remark: '',
                  status: ''
                })
              }}
            >
              Clear Form
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Saving...' : (editingJob ? 'Update Job' : 'Create Job')}
            </Button>
          </div>
        </form>
      </Card>

      {/* Search Bar with Integrated Advanced Filters */}
      <div className="space-y-4 mb-8">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm('')}
          placeholder="Search by vessel name, job number, port, or client..."
          showAdvancedToggle={true}
          isAdvancedOpen={isAdvancedFiltersOpen}
          onAdvancedToggle={handleToggleAdvancedFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Advanced Filters Panel */}
        <AdvancedFilters
          isOpen={isAdvancedFiltersOpen}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
          jobTypes={jobTypes}
          ports={ports}
          clients={clients}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {/* Jobs Table */}
      <Card variant="gradient" className="p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">All Jobs</h2>
            <p className="text-gray-400 text-sm">
              {searchTerm ? `Searching for "${searchTerm}"` : 'View and manage all ballast/bunker jobs'}
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
            {jobs.length > 0 && (
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
              key: 'vesselName', 
              label: 'Vessel Name',
              render: (value) => (
                <span className="font-semibold text-white">{value}</span>
              )
            },
            {
              key: 'dateTime',
              label: 'Inspection Date & Time',
              render: (value) => (
                <div className="text-sm">
                  <div className="text-gray-300 font-medium">
                    {new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {new Date(value).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              )
            },
            { 
              key: 'port', 
              label: 'Port',
              render: (value) => (
                <span className="text-gray-300">{value}</span>
              )
            },
            { 
              key: 'jobType', 
              label: 'Job Type',
              render: (value) => {
                const type = jobTypes.find(t => t.value === value)
                return (
                  <span className="text-cyan-400 text-sm font-medium">
                    {type ? type.label : value}
                  </span>
                )
              }
            },
            { 
              key: 'clientName', 
              label: 'Client',
              render: (value) => (
                <span className="text-gray-300">{value}</span>
              )
            },
            { 
              key: 'status', 
              label: 'Status',
              render: (value) => {
                const colors = {
                  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
                  'in-progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
                  completed: 'bg-green-500/20 text-green-400 border-green-500/30',
                  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30'
                }
                return (
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colors[value] || ''}`}>
                    {value?.replace('-', ' ').toUpperCase()}
                  </span>
                )
              }
            },
          ]}
          data={jobs}
          onView={handleViewJob}
          onEdit={handleEditJob}
          onDelete={handleDeleteJob}
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

      {/* Job Details View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Job Details"
        size="default"
      >
        {viewingJob && (
          <div className="space-y-6">
            {/* Job Number - Highlighted */}
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl p-6 border border-cyan-500/20">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Job Number</p>
              <p className="text-3xl font-bold font-mono text-cyan-400">{viewingJob.jobNumber}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Vessel Name</p>
                <p className="text-lg font-semibold text-white">{viewingJob.vesselName}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Inspection Date & Time</p>
                <p className="text-base text-gray-300">
                  {new Date(viewingJob.dateTime).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
                <p className="text-sm text-gray-400">
                  {new Date(viewingJob.dateTime).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              {viewingJob.etb && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">ETB (Est. Time of Berthing)</p>
                  <p className="text-base text-gray-300">
                    {new Date(viewingJob.etb).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(viewingJob.etb).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}

              {viewingJob.etd && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">ETD (Est. Time of Departure)</p>
                  <p className="text-base text-gray-300">
                    {new Date(viewingJob.etd).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(viewingJob.etd).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Port</p>
                <p className="text-base text-gray-300">{viewingJob.port}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Job Type</p>
                <p className="text-base text-cyan-400 font-medium">
                  {jobTypes.find(t => t.value === viewingJob.jobType)?.label || viewingJob.jobType}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Client Name</p>
                <p className="text-base text-gray-300">{viewingJob.clientName}</p>
              </div>

              {viewingJob.subcontractName && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Subcontract Name</p>
                  <p className="text-base text-gray-300">{viewingJob.subcontractName}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Status</p>
                <div className="inline-block">
                  {(() => {
                    const colors = {
                      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
                      'in-progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
                      completed: 'bg-green-500/20 text-green-400 border-green-500/30',
                      cancelled: 'bg-red-500/20 text-red-400 border-red-500/30'
                    }
                    return (
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${colors[viewingJob.status] || ''}`}>
                        {viewingJob.status?.replace('-', ' ').toUpperCase()}
                      </span>
                    )
                  })()}
                </div>
              </div>

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
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${colors[viewingJob.invoiceIssue] || ''}`}>
                        {viewingJob.invoiceIssue?.replace('-', ' ').toUpperCase()}
                      </span>
                    )
                  })()}
                </div>
              </div>
            </div>

            {/* Financial Details - Only show if invoice is issued or paid */}
            {(viewingJob.invoiceIssue === 'issued' || viewingJob.invoiceIssue === 'paid') && (
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
                      ${(viewingJob.invoiceAmount || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      <span className="text-sm text-gray-400 ml-2">AUD</span>
                    </p>
                  </div>

                  <div className="bg-slate-800/30 rounded-xl p-4 border border-white/5">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Subcontract Amount</p>
                    <p className="text-2xl font-bold text-white">
                      ${(viewingJob.subcontractAmount || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      <span className="text-sm text-gray-400 ml-2">AUD</span>
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-xl p-4 border border-emerald-500/30">
                    <p className="text-xs text-emerald-400 uppercase tracking-wider mb-2">Net Profit</p>
                    <p className="text-2xl font-bold text-emerald-400">
                      ${(viewingJob.netProfit || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      <span className="text-sm text-emerald-300 ml-2">AUD</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Remark - Full Width */}
            {viewingJob.remark && (
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Remark</p>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{viewingJob.remark}</p>
                </div>
              </div>
            )}

            {/* Change History */}
            {jobHistory.length > 0 && (
              <div className="border-t border-white/10 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-semibold text-white">Change History</h3>
                  <span className="text-xs text-gray-500 bg-slate-800/50 px-2 py-1 rounded-full">
                    {jobHistory.length} {jobHistory.length === 1 ? 'change' : 'changes'}
                  </span>
                </div>
                
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {jobHistory.map((entry, index) => (
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
                <p>{new Date(viewingJob.createdAt).toLocaleString('en-US')}</p>
              </div>
              <div>
                <p className="uppercase tracking-wider mb-1">Last Updated</p>
                <p>{new Date(viewingJob.updatedAt).toLocaleString('en-US')}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                variant="secondary" 
                className="flex-1"
                onClick={() => {
                  setIsViewModalOpen(false)
                  setJobHistory([])
                }}
              >
                Close
              </Button>
              <Button 
                variant="primary" 
                className="flex-1"
                onClick={handleEditFromView}
              >
                Edit Job
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

      {/* Job Types Management Modal */}
      <Modal
        isOpen={isJobTypeModalOpen}
        onClose={closeJobTypeModal}
        title="Manage Job Types"
        size="default"
      >
        <div className="space-y-8">
          {/* Add/Edit Form */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
              <p className="text-xs uppercase tracking-widest text-cyan-400/60 font-light">
                {editingJobTypeIndex !== null ? 'Edit Type' : 'New Type'}
              </p>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
            </div>

            <Input
              label="Job Type Name"
              value={newJobType}
              onChange={(e) => setNewJobType(e.target.value)}
              placeholder="e.g., Ballast Water"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  if (editingJobTypeIndex !== null) {
                    handleUpdateJobType()
                  } else {
                    handleAddJobType()
                  }
                }
              }}
            />
            
            <div className="flex gap-3 pt-2">
              {editingJobTypeIndex !== null ? (
                <>
                  <Button 
                    onClick={handleUpdateJobType}
                    variant="primary"
                    size="sm"
                    className="flex-1"
                  >
                    Update
                  </Button>
                  <Button 
                    onClick={() => {
                      setNewJobType('')
                      setEditingJobTypeIndex(null)
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={handleAddJobType}
                  variant="primary"
                  size="sm"
                  className="flex-1"
                >
                  Add Type
                </Button>
              )}
            </div>
          </div>

          {/* Current Job Types List - Elegant */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
              <p className="text-xs uppercase tracking-widest text-blue-400/60 font-light">
                Current Types
              </p>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
            </div>

            <div className="space-y-2">
              {jobTypes.map((type, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-r from-slate-800/30 to-slate-900/30 hover:from-slate-800/50 hover:to-slate-900/50 hover:border-cyan-500/30 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-cyan-600/0 to-blue-600/0 group-hover:from-blue-600/5 group-hover:via-cyan-600/5 group-hover:to-blue-600/5 transition-all duration-500"></div>
                  
                  <div className="relative p-4 flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium tracking-wide">{type.label}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditJobType(index, type._id)}
                        className="group/btn relative p-2 text-cyan-400 hover:text-cyan-300 transition-all duration-300 overflow-hidden rounded-lg hover:bg-cyan-500/10"
                        disabled={loading}
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
                      </button>
                      <button
                        onClick={() => handleDeleteJobType(type._id)}
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

      {/* Ports Management Modal */}
      <Modal
        isOpen={isPortModalOpen}
        onClose={closePortModal}
        title="Manage Ports"
        size="default"
      >
        <div className="space-y-8">
          {/* Add/Edit Form */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
              <p className="text-xs uppercase tracking-widest text-cyan-400/60 font-light">
                {editingPortIndex !== null ? 'Edit Port' : 'New Port'}
              </p>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
            </div>

            <Input
              label="Port Name"
              value={newPort}
              onChange={(e) => setNewPort(e.target.value)}
              placeholder="e.g., Sydney"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  if (editingPortIndex !== null) {
                    handleUpdatePort()
                  } else {
                    handleAddPort()
                  }
                }
              }}
            />
            
            <div className="flex gap-3 pt-2">
              {editingPortIndex !== null ? (
                <>
                  <Button 
                    onClick={handleUpdatePort}
                    variant="primary"
                    size="sm"
                    className="flex-1"
                  >
                    Update
                  </Button>
                  <Button 
                    onClick={() => {
                      setNewPort('')
                      setEditingPortIndex(null)
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={handleAddPort}
                  variant="primary"
                  size="sm"
                  className="flex-1"
                >
                  Add Port
                </Button>
              )}
            </div>
          </div>

          {/* Current Ports List */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
              <p className="text-xs uppercase tracking-widest text-blue-400/60 font-light">
                Current Ports
              </p>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
            </div>

            <div className="space-y-2">
              {ports.map((port, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-r from-slate-800/30 to-slate-900/30 hover:from-slate-800/50 hover:to-slate-900/50 hover:border-cyan-500/30 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-cyan-600/0 to-blue-600/0 group-hover:from-blue-600/5 group-hover:via-cyan-600/5 group-hover:to-blue-600/5 transition-all duration-500"></div>
                  
                  <div className="relative p-4 flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium tracking-wide">{port.name}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditPort(index, port._id)}
                        className="group/btn relative p-2 text-cyan-400 hover:text-cyan-300 transition-all duration-300 overflow-hidden rounded-lg hover:bg-cyan-500/10"
                        disabled={loading}
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
                      </button>
                      <button
                        onClick={() => handleDeletePort(port._id)}
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
    </Container>
  )
}

