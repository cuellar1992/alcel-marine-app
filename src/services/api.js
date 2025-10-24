/**
 * API Service
 * Handles all backend API communications
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'API request failed')
    }

    return data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// Jobs API
export const jobsAPI = {
  // Get all jobs with pagination, search, and advanced filters
  getAll: (page = 1, limit = 10, search = '', filters = {}) => {
    let url = `/jobs?page=${page}&limit=${limit}`
    
    if (search) {
      url += `&search=${encodeURIComponent(search)}`
    }

    // Add advanced filters
    if (filters.searchField && filters.searchField !== 'all') {
      url += `&searchField=${filters.searchField}`
    }
    if (filters.jobType) {
      url += `&jobType=${filters.jobType}`
    }
    if (filters.port) {
      url += `&port=${encodeURIComponent(filters.port)}`
    }
    if (filters.client) {
      url += `&client=${encodeURIComponent(filters.client)}`
    }
    if (filters.status) {
      url += `&status=${filters.status}`
    }
    if (filters.invoiceIssue) {
      url += `&invoiceIssue=${filters.invoiceIssue}`
    }
    if (filters.dateFrom) {
      // Convert Date object to YYYY-MM-DD format
      const dateFrom = filters.dateFrom instanceof Date 
        ? filters.dateFrom.toISOString().split('T')[0]
        : filters.dateFrom
      url += `&dateFrom=${dateFrom}`
    }
    if (filters.dateTo) {
      // Convert Date object to YYYY-MM-DD format
      const dateTo = filters.dateTo instanceof Date 
        ? filters.dateTo.toISOString().split('T')[0]
        : filters.dateTo
      url += `&dateTo=${dateTo}`
    }
    
    return apiCall(url)
  },

  // Get single job
  getById: (id) => apiCall(`/jobs/${id}`),

  // Generate next job number
  generateNumber: () => apiCall('/jobs/generate-number'),

  // Get job history
  getHistory: (jobId) => apiCall(`/jobs/${jobId}/history`),

  // Create new job
  create: (jobData) => apiCall('/jobs', {
    method: 'POST',
    body: JSON.stringify(jobData),
  }),

  // Update job
  update: (id, jobData) => apiCall(`/jobs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(jobData),
  }),

  // Delete job
  delete: (id) => apiCall(`/jobs/${id}`, {
    method: 'DELETE',
  }),
}

// Job Types API
export const jobTypesAPI = {
  // Get all job types
  getAll: () => apiCall('/job-types'),

  // Create job type
  create: (jobTypeData) => apiCall('/job-types', {
    method: 'POST',
    body: JSON.stringify(jobTypeData),
  }),

  // Update job type
  update: (id, jobTypeData) => apiCall(`/job-types/${id}`, {
    method: 'PUT',
    body: JSON.stringify(jobTypeData),
  }),

  // Delete job type
  delete: (id) => apiCall(`/job-types/${id}`, {
    method: 'DELETE',
  }),
}

// Ports API
export const portsAPI = {
  getAll: () => apiCall('/ports'),
  create: (portData) => apiCall('/ports', {
    method: 'POST',
    body: JSON.stringify(portData),
  }),
  update: (id, portData) => apiCall(`/ports/${id}`, {
    method: 'PUT',
    body: JSON.stringify(portData),
  }),
  delete: (id) => apiCall(`/ports/${id}`, {
    method: 'DELETE',
  }),
}

// Clients API
export const clientsAPI = {
  getAll: () => apiCall('/clients'),
  create: (clientData) => apiCall('/clients', {
    method: 'POST',
    body: JSON.stringify(clientData),
  }),
  update: (id, clientData) => apiCall(`/clients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(clientData),
  }),
  delete: (id) => apiCall(`/clients/${id}`, {
    method: 'DELETE',
  }),
}

// Claims API
export const claimsAPI = {
  // Get all claims with pagination, search, and advanced filters
  getAll: (page = 1, limit = 10, search = '', filters = {}) => {
    let url = `/claims?page=${page}&limit=${limit}`
    
    if (search) {
      url += `&search=${encodeURIComponent(search)}`
    }

    // Add advanced filters
    if (filters.searchField && filters.searchField !== 'all') {
      url += `&searchField=${filters.searchField}`
    }
    if (filters.location) {
      url += `&location=${encodeURIComponent(filters.location)}`
    }
    if (filters.invoiceIssue) {
      url += `&invoiceIssue=${filters.invoiceIssue}`
    }
    if (filters.dateFrom) {
      const dateFrom = filters.dateFrom instanceof Date 
        ? filters.dateFrom.toISOString().split('T')[0]
        : filters.dateFrom
      url += `&dateFrom=${dateFrom}`
    }
    if (filters.dateTo) {
      const dateTo = filters.dateTo instanceof Date 
        ? filters.dateTo.toISOString().split('T')[0]
        : filters.dateTo
      url += `&dateTo=${dateTo}`
    }
    
    return apiCall(url)
  },

  // Get single claim
  getById: (id) => apiCall(`/claims/${id}`),

  // Generate next claim number (shares same sequence with jobs)
  generateNumber: () => apiCall('/claims/generate-number'),

  // Get claim history
  getHistory: (claimId) => apiCall(`/claims/${claimId}/history`),

  // Create new claim
  create: (claimData) => apiCall('/claims', {
    method: 'POST',
    body: JSON.stringify(claimData),
  }),

  // Update claim
  update: (id, claimData) => apiCall(`/claims/${id}`, {
    method: 'PUT',
    body: JSON.stringify(claimData),
  }),

  // Delete claim
  delete: (id) => apiCall(`/claims/${id}`, {
    method: 'DELETE',
  }),
}

// TimeSheet API
export const timeSheetAPI = {
  // Get all timesheet entries for a claim
  getEntries: (claimId) => apiCall(`/timesheet/${claimId}`),

  // Get timesheet summary for a claim
  getSummary: (claimId) => apiCall(`/timesheet/${claimId}/summary`),

  // Create new timesheet entry
  create: (entryData) => apiCall('/timesheet', {
    method: 'POST',
    body: JSON.stringify(entryData),
  }),

  // Update timesheet entry
  update: (id, entryData) => apiCall(`/timesheet/${id}`, {
    method: 'PUT',
    body: JSON.stringify(entryData),
  }),

  // Delete timesheet entry
  delete: (id) => apiCall(`/timesheet/${id}`, {
    method: 'DELETE',
  }),
}

// Dashboard API
export const dashboardAPI = {
  // Get general dashboard stats
  getStats: () => apiCall('/dashboard/stats'),
  
  // Get jobs by status
  getJobsByStatus: () => apiCall('/dashboard/jobs-by-status'),
  
  // Get revenue trends
  getRevenueTrends: (months = 6) => apiCall(`/dashboard/revenue-trends?months=${months}`),
  
  // Get top clients
  getTopClients: (limit = 5, sortBy = 'revenue') => 
    apiCall(`/dashboard/top-clients?limit=${limit}&sortBy=${sortBy}`),
  
  // Get jobs by type
  getJobsByType: () => apiCall('/dashboard/jobs-by-type'),
  
  // Get ships by port
  getShipsByPort: () => apiCall('/dashboard/ships-by-port'),
  
  // Get recent activity
  getRecentActivity: (limit = 10) => apiCall(`/dashboard/recent-activity?limit=${limit}`),
  
  // Get invoice overview
  getInvoiceOverview: () => apiCall('/dashboard/invoice-overview'),
  
  // Get vessel schedule
  getVesselSchedule: (days = 7) => apiCall(`/dashboard/vessel-schedule?days=${days}`),
  
  // Get jobs per month
  getJobsPerMonth: (year = new Date().getFullYear()) => 
    apiCall(`/dashboard/jobs-per-month?year=${year}`),
  
  // Get jobs by client
  getJobsByClient: () => apiCall('/dashboard/jobs-by-client'),
}

// Health check
export const healthCheck = () => apiCall('/health')

