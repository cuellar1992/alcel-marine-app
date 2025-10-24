/**
 * Dashboard Controller
 * Handles all dashboard statistics and analytics
 */

import Job from '../models/Job.js'
import Claim from '../models/Claim.js'

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Public
export const getDashboardStats = async (req, res) => {
  try {
    // Get total jobs and claims
    const totalJobs = await Job.countDocuments()
    const totalClaims = await Claim.countDocuments()
    const totalRecords = totalJobs + totalClaims

    // Get jobs by status
    const jobsByStatus = await Job.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])

    // Get pending jobs
    const pendingJobs = await Job.countDocuments({ status: 'pending' })

    // Calculate total invoice amount (from both jobs and claims)
    const jobsInvoiceAmount = await Job.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: { $toDouble: { $ifNull: ['$invoiceAmount', 0] } } }
        }
      }
    ])

    const claimsInvoiceAmount = await Claim.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: { $toDouble: { $ifNull: ['$invoiceAmount', 0] } } }
        }
      }
    ])

    const totalInvoiceAmount =
      (jobsInvoiceAmount[0]?.total || 0) +
      (claimsInvoiceAmount[0]?.total || 0)

    // Get invoice statistics
    // Note: Models use 'not-issued', 'issued', 'paid' with hyphens
    const issuedInvoices = await Job.countDocuments({ invoiceIssue: 'issued' }) + 
                          await Claim.countDocuments({ invoiceIssue: 'issued' })
    
    const paidInvoices = await Job.countDocuments({ invoiceIssue: 'paid' }) + 
                        await Claim.countDocuments({ invoiceIssue: 'paid' })
    
    // Count "not issued" - using 'not-issued' with hyphen as per model definition
    const notIssuedInvoices = await Job.countDocuments({ 
      $or: [
        { invoiceIssue: { $exists: false } },
        { invoiceIssue: null },
        { invoiceIssue: '' },
        { invoiceIssue: 'not-issued' },  // With hyphen
        { invoiceIssue: 'not issued' }   // Without hyphen (legacy support)
      ]
    }) + await Claim.countDocuments({ 
      $or: [
        { invoiceIssue: { $exists: false } },
        { invoiceIssue: null },
        { invoiceIssue: '' },
        { invoiceIssue: 'not-issued' },  // With hyphen
        { invoiceIssue: 'not issued' }   // Without hyphen (legacy support)
      ]
    })

    res.json({
      success: true,
      data: {
        totalRecords,
        totalJobs,
        totalClaims,
        pendingJobs,
        totalInvoiceAmount,
        jobsByStatus,
        issuedInvoices,
        notIssuedInvoices,
        paidInvoices
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats',
      error: error.message
    })
  }
}

// @desc    Get jobs by status distribution
// @route   GET /api/dashboard/jobs-by-status
// @access  Public
export const getJobsByStatus = async (req, res) => {
  try {
    const jobsByStatus = await Job.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ])

    res.json({
      success: true,
      data: jobsByStatus
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs by status',
      error: error.message
    })
  }
}

// @desc    Get revenue trends by month
// @route   GET /api/dashboard/revenue-trends?months=6
// @access  Public
export const getRevenueTrends = async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 6

    // Calculate date range
    // Use UTC methods to avoid timezone issues
    const endDate = new Date()
    endDate.setUTCHours(23, 59, 59, 999) // End of today in UTC
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - months)
    startDate.setUTCHours(0, 0, 0, 0) // Start of day in UTC

    // Get jobs revenue by month (using netProfit)
    const jobsRevenue = await Job.aggregate([
      {
        $match: {
          dateTime: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$dateTime' },
            month: { $month: '$dateTime' }
          },
          revenue: { $sum: { $toDouble: { $ifNull: ['$netProfit', 0] } } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ])

    // Get claims revenue by month (using netProfit)
    const claimsRevenue = await Claim.aggregate([
      {
        $match: {
          registrationDate: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$registrationDate' },
            month: { $month: '$registrationDate' }
          },
          revenue: { $sum: { $toDouble: { $ifNull: ['$netProfit', 0] } } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ])

    // Merge both revenues
    const revenueMap = new Map()
    
    jobsRevenue.forEach(item => {
      const key = `${item._id.year}-${item._id.month}`
      revenueMap.set(key, {
        year: item._id.year,
        month: item._id.month,
        revenue: item.revenue,
        count: item.count
      })
    })

    claimsRevenue.forEach(item => {
      const key = `${item._id.year}-${item._id.month}`
      if (revenueMap.has(key)) {
        const existing = revenueMap.get(key)
        existing.revenue += item.revenue
        existing.count += item.count
      } else {
        revenueMap.set(key, {
          year: item._id.year,
          month: item._id.month,
          revenue: item.revenue,
          count: item.count
        })
      }
    })

    const trends = Array.from(revenueMap.values()).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year
      return a.month - b.month
    })

    res.json({
      success: true,
      data: trends
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching revenue trends',
      error: error.message
    })
  }
}

// @desc    Get top clients by revenue or job count
// @route   GET /api/dashboard/top-clients?limit=5&sortBy=revenue
// @access  Public
export const getTopClients = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5
    const sortBy = req.query.sortBy || 'revenue' // revenue or count

    // Get jobs by client
    const jobsByClient = await Job.aggregate([
      {
        $group: {
          _id: '$clientName',
          count: { $sum: 1 },
          revenue: { $sum: { $toDouble: { $ifNull: ['$invoiceAmount', 0] } } }
        }
      },
      {
        $sort: sortBy === 'revenue' ? { revenue: -1 } : { count: -1 }
      },
      {
        $limit: limit
      }
    ])

    res.json({
      success: true,
      data: jobsByClient
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching top clients',
      error: error.message
    })
  }
}

// @desc    Get jobs distribution by job type (including Claims)
// @route   GET /api/dashboard/jobs-by-type
// @access  Public
export const getJobsByType = async (req, res) => {
  try {
    // Get jobs grouped by job type
    const jobsByType = await Job.aggregate([
      {
        $group: {
          _id: '$jobType',
          count: { $sum: 1 }
        }
      }
    ])

    // Get total claims count
    const claimsCount = await Claim.countDocuments()

    // Combine jobs by type with claims
    const allJobTypes = [
      ...jobsByType,
      {
        _id: 'Claims',
        count: claimsCount
      }
    ]

    // Sort by count descending
    allJobTypes.sort((a, b) => b.count - a.count)

    res.json({
      success: true,
      data: allJobTypes
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs by type',
      error: error.message
    })
  }
}

// @desc    Get ships count by port
// @route   GET /api/dashboard/ships-by-port
// @access  Public
export const getShipsByPort = async (req, res) => {
  try {
    const shipsByPort = await Job.aggregate([
      {
        $group: {
          _id: '$port',
          ships: { $addToSet: '$vesselName' }
        }
      },
      {
        $project: {
          _id: 1,
          count: { $size: '$ships' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ])

    res.json({
      success: true,
      data: shipsByPort
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching ships by port',
      error: error.message
    })
  }
}

// @desc    Get recent activity (latest jobs and claims)
// @route   GET /api/dashboard/recent-activity?limit=10
// @access  Public
export const getRecentActivity = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10

    // Get recent jobs
    const recentJobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('jobNumber vesselName clientName status dateTime createdAt')
      .lean()

    // Get recent claims
    const recentClaims = await Claim.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('jobNumber location date createdAt')
      .lean()

    // Add type identifier
    const jobs = recentJobs.map(job => ({ ...job, type: 'job' }))
    const claims = recentClaims.map(claim => ({ ...claim, type: 'claim' }))

    // Merge and sort by creation date
    const allActivity = [...jobs, ...claims]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit)

    res.json({
      success: true,
      data: allActivity
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recent activity',
      error: error.message
    })
  }
}

// @desc    Get invoice status overview
// @route   GET /api/dashboard/invoice-overview
// @access  Public
export const getInvoiceOverview = async (req, res) => {
  try {
    // Jobs invoice status
    const jobsInvoiceStatus = await Job.aggregate([
      {
        $group: {
          _id: '$invoiceIssue',
          count: { $sum: 1 },
          amount: { $sum: { $toDouble: { $ifNull: ['$invoiceAmount', 0] } } }
        }
      }
    ])

    // Claims invoice status
    const claimsInvoiceStatus = await Claim.aggregate([
      {
        $group: {
          _id: '$invoiceIssue',
          count: { $sum: 1 },
          amount: { $sum: { $toDouble: { $ifNull: ['$invoiceAmount', 0] } } }
        }
      }
    ])

    // Normalize status values (handle null, undefined, hyphens, and case variations)
    const normalizeStatus = (status) => {
      if (!status) return 'not issued'
      const normalized = status.toLowerCase().trim().replace(/-/g, ' ')  // Replace hyphens with spaces
      
      // Map variations to standard values
      if (normalized === 'issued') return 'issued'
      if (normalized === 'paid') return 'paid'
      if (normalized === 'not issued') return 'not issued'
      // Default to 'not issued' for anything else
      return 'not issued'
    }

    // Merge results with normalized keys (using spaces for display)
    const invoiceMap = new Map([
      ['not issued', { status: 'not issued', count: 0, amount: 0 }],
      ['issued', { status: 'issued', count: 0, amount: 0 }],
      ['paid', { status: 'paid', count: 0, amount: 0 }]
    ])
    
    jobsInvoiceStatus.forEach(item => {
      const status = normalizeStatus(item._id)
      const existing = invoiceMap.get(status)
      existing.count += item.count
      existing.amount += item.amount
    })

    claimsInvoiceStatus.forEach(item => {
      const status = normalizeStatus(item._id)
      const existing = invoiceMap.get(status)
      existing.count += item.count
      existing.amount += item.amount
    })

    const overview = Array.from(invoiceMap.values())

    res.json({
      success: true,
      data: overview
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching invoice overview',
      error: error.message
    })
  }
}

// @desc    Get upcoming ETB/ETD schedule
// @route   GET /api/dashboard/vessel-schedule?days=7
// @access  Public
export const getVesselSchedule = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7

    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + days)

    const schedule = await Job.find({
      $or: [
        { etb: { $gte: startDate, $lte: endDate } },
        { etd: { $gte: startDate, $lte: endDate } }
      ]
    })
      .sort({ etb: 1 })
      .select('jobNumber vesselName port etb etd status')
      .lean()

    res.json({
      success: true,
      data: schedule
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching vessel schedule',
      error: error.message
    })
  }
}

// @desc    Get jobs per month (including both jobs and claims)
// @route   GET /api/dashboard/jobs-per-month?year=2024
// @access  Public
export const getJobsPerMonth = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear()
    
    // Use UTC to avoid timezone issues
    const startDate = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0))
    const endDate = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999))

    // Jobs by month
    const jobsByMonth = await Job.aggregate([
      {
        $match: {
          dateTime: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { 
            month: { $month: '$dateTime' },
            jobType: '$jobType'
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.month': 1 }
      }
    ])

    // Claims by month (using registrationDate, not date)
    const claimsByMonth = await Claim.aggregate([
      {
        $match: {
          registrationDate: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { 
            month: { $month: '$registrationDate' },
            jobType: 'Claims'
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.month': 1 }
      }
    ])

    // Combine results
    const allJobs = [...jobsByMonth, ...claimsByMonth]

    res.json({
      success: true,
      data: allJobs
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs per month',
      error: error.message
    })
  }
}

// @desc    Get jobs by each client
// @route   GET /api/dashboard/jobs-by-client
// @access  Public
export const getJobsByClient = async (req, res) => {
  try {
    const jobsByClient = await Job.aggregate([
      {
        $group: {
          _id: '$clientName',
          jobs: { $sum: 1 },
          revenue: { $sum: { $toDouble: { $ifNull: ['$invoiceAmount', 0] } } },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'in progress'] }, 1, 0] }
          }
        }
      },
      {
        $sort: { jobs: -1 }
      }
    ])

    res.json({
      success: true,
      data: jobsByClient
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs by client',
      error: error.message
    })
  }
}

