/**
 * API Service
 * Handles all backend API communications
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('accessToken')
}

// Helper function to refresh token
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken')

  if (!refreshToken) {
    throw new Error('No refresh token available')
  }

  const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  })

  const data = await response.json()

  if (!response.ok) {
    // Si el refresh falla, limpiar todo y redirigir a login
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    window.location.href = '/login'
    throw new Error('Session expired. Please login again.')
  }

  // Guardar nuevo access token
  localStorage.setItem('accessToken', data.data.accessToken)
  return data.data.accessToken
}

// Variable para evitar múltiples intentos simultáneos de refresh
let isRefreshing = false;
let refreshPromise = null;

// Generic API call function with auth
const apiCall = async (endpoint, options = {}) => {
  try {
    const token = getAuthToken()

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    })

    const data = await response.json()

    // Si recibimos 401 (Unauthorized), intentar refrescar el token
    if (response.status === 401) {
      // Solo intentar refresh si el mensaje indica token expirado/inválido
      // No intentar si es "No token provided" (usuario no logueado)
      const shouldRefresh = data.message?.includes('expired') ||
                           data.message?.includes('Invalid or expired')

      if (shouldRefresh && localStorage.getItem('refreshToken')) {
        try {
          // Si ya hay un refresh en progreso, esperar a que termine
          if (isRefreshing) {
            await refreshPromise;
          } else {
            // Iniciar nuevo refresh
            isRefreshing = true;
            refreshPromise = refreshAccessToken().finally(() => {
              isRefreshing = false;
              refreshPromise = null;
            });
            await refreshPromise;
          }

          const newToken = getAuthToken();

          // Reintentar la petición con el nuevo token
          const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${newToken}`,
              ...options.headers,
            },
          })

          const retryData = await retryResponse.json()

          if (!retryResponse.ok) {
            throw new Error(retryData.message || 'API request failed')
          }

          return retryData
        } catch (refreshError) {
          // Si el refresh falla, el usuario será redirigido a login
          console.error('Error refreshing token:', refreshError);
          throw refreshError
        }
      } else {
        // No hay refresh token o el usuario no está logueado
        // Redirigir a login solo si estamos en una página protegida
        if (!window.location.pathname.includes('/login')) {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')
          
          // Mostrar mensaje antes de redirigir
          console.log('⚠️ Sesión expirada, redirigiendo a login...');
          window.location.href = '/login'
        }
        throw new Error(data.message || 'Unauthorized')
      }
    }

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

// Users API (Admin only)
export const usersAPI = {
  // Get all users
  getAll: (page = 1, limit = 10, search = '', role = '', isActive = '') => {
    let url = `/users?page=${page}&limit=${limit}`

    if (search) {
      url += `&search=${encodeURIComponent(search)}`
    }
    if (role) {
      url += `&role=${role}`
    }
    if (isActive !== '') {
      url += `&isActive=${isActive}`
    }

    return apiCall(url)
  },

  // Get single user
  getById: (id) => apiCall(`/users/${id}`),

  // Create new user
  create: (userData) => apiCall('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  // Update user
  update: (id, userData) => apiCall(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),

  // Delete user
  delete: (id) => apiCall(`/users/${id}`, {
    method: 'DELETE',
  }),

  // Change user password
  changePassword: (id, newPassword) => apiCall(`/users/${id}/password`, {
    method: 'PUT',
    body: JSON.stringify({ newPassword }),
  }),

  // Toggle user status (activate/deactivate)
  toggleStatus: (id) => apiCall(`/users/${id}/toggle-status`, {
    method: 'PATCH',
  }),

  // Get user statistics
  getStats: () => apiCall('/users/stats'),
}

// Two-Factor Authentication API
export const twoFactorAPI = {
  // Get 2FA status
  getStatus: () => apiCall('/2fa/status'),

  // Generate 2FA secret and QR code
  generateSecret: () => apiCall('/2fa/generate', {
    method: 'POST',
  }),

  // Enable 2FA with verification token
  enable: (token) => apiCall('/2fa/enable', {
    method: 'POST',
    body: JSON.stringify({ token }),
  }),

  // Disable 2FA
  disable: (password) => apiCall('/2fa/disable', {
    method: 'POST',
    body: JSON.stringify({ password }),
  }),
}

// Health check
export const healthCheck = () => apiCall('/health')

