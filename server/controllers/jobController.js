/**
 * Job Controller
 * Handles all job-related operations
 */

import Job from '../models/Job.js'
import JobHistory from '../models/JobHistory.js'

// @desc    Generate next job number (shared with claims)
// @route   GET /api/jobs/generate-number?year=25
// @access  Public
export const generateJobNumber = async (req, res) => {
  try {
    // Import Claim model dynamically to avoid circular dependency
    const { default: Claim } = await import('../models/Claim.js')

    // Get year from query param or use current year
    const requestedYear = req.query.year
      ? req.query.year.toString().padStart(2, '0')
      : new Date().getFullYear().toString().slice(-2)

    // Validate year format (should be 2 digits)
    if (!/^\d{2}$/.test(requestedYear)) {
      return res.status(400).json({
        success: false,
        message: 'Year must be a 2-digit number (e.g., 23, 24, 25)'
      })
    }

    // Create regex to match job numbers for the specific year
    const yearPattern = new RegExp(`^ALCEL-${requestedYear}-(\\d{3})$`)

    // Find all jobs and claims for this specific year
    const jobsForYear = await Job.find({
      jobNumber: { $regex: `^ALCEL-${requestedYear}-` }
    }).sort({ jobNumber: -1 }).limit(1)

    const claimsForYear = await Claim.find({
      jobNumber: { $regex: `^ALCEL-${requestedYear}-` }
    }).sort({ jobNumber: -1 }).limit(1)

    let nextNumber = 1

    // Extract number from latest job for this year
    if (jobsForYear.length > 0 && jobsForYear[0].jobNumber) {
      const jobMatch = jobsForYear[0].jobNumber.match(yearPattern)
      if (jobMatch) {
        nextNumber = Math.max(nextNumber, parseInt(jobMatch[1], 10) + 1)
      }
    }

    // Extract number from latest claim for this year
    if (claimsForYear.length > 0 && claimsForYear[0].jobNumber) {
      const claimMatch = claimsForYear[0].jobNumber.match(yearPattern)
      if (claimMatch) {
        nextNumber = Math.max(nextNumber, parseInt(claimMatch[1], 10) + 1)
      }
    }

    // Format with leading zeros (3 digits)
    const formattedNumber = nextNumber.toString().padStart(3, '0')
    const jobNumber = `ALCEL-${requestedYear}-${formattedNumber}`

    res.json({
      success: true,
      data: {
        jobNumber,
        nextNumber,
        year: requestedYear
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating job number',
      error: error.message
    })
  }
}

// @desc    Get all jobs with pagination, search, and advanced filters
// @route   GET /api/jobs?page=1&limit=10&search=ocean&searchField=all&jobType=ballast&status=pending
// @access  Public
export const getAllJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit
    const search = req.query.search || ''
    const searchField = req.query.searchField || 'all'
    const sortBy = req.query.sortBy || 'dateTime' // 'dateTime' or 'jobNumber'
    const sortOrder = req.query.sortOrder || 'desc' // 'asc' or 'desc'

    // Build search query
    let query = {}

    // Text search with field selector
    if (search) {
      if (searchField === 'all') {
        query.$or = [
          { vesselName: { $regex: search, $options: 'i' } },
          { jobNumber: { $regex: search, $options: 'i' } },
          { port: { $regex: search, $options: 'i' } },
          { clientName: { $regex: search, $options: 'i' } },
        ]
      } else {
        // Search only in specific field
        query[searchField] = { $regex: search, $options: 'i' }
      }
    }

    // Advanced filters
    if (req.query.jobType) {
      query.jobType = req.query.jobType
    }

    if (req.query.port) {
      query.port = req.query.port
    }

    if (req.query.client) {
      query.clientName = req.query.client
    }

    if (req.query.status) {
      query.status = req.query.status
    }

    if (req.query.invoiceIssue) {
      query.invoiceIssue = req.query.invoiceIssue
    }

    // Date range filter
    if (req.query.dateFrom || req.query.dateTo) {
      query.dateTime = {}
      if (req.query.dateFrom) {
        query.dateTime.$gte = new Date(req.query.dateFrom)
      }
      if (req.query.dateTo) {
        query.dateTime.$lte = new Date(new Date(req.query.dateTo).setHours(23, 59, 59, 999))
      }
    }

    // Get total count with filters
    const total = await Job.countDocuments(query)

    // Determine sort criteria
    if (sortBy === 'jobNumber') {
      // For jobNumber sorting, we need to sort intelligently by year and sequence
      // We'll fetch all matching records, sort in memory, then paginate
      const allJobs = await Job.find(query)

      // Sort intelligently by job number (year then sequence)
      allJobs.sort((a, b) => {
        const parseJobNumber = (jobNum) => {
          if (!jobNum) return { year: 0, sequence: 0 }
          const parts = jobNum.split('-')
          if (parts.length < 3) return { year: 0, sequence: 0 }
          return {
            year: parseInt(parts[1], 10) || 0,
            sequence: parseInt(parts[2], 10) || 0
          }
        }

        const parsedA = parseJobNumber(a.jobNumber)
        const parsedB = parseJobNumber(b.jobNumber)

        // Compare by year
        if (parsedA.year !== parsedB.year) {
          return sortOrder === 'asc'
            ? parsedA.year - parsedB.year
            : parsedB.year - parsedA.year
        }

        // If same year, compare by sequence respecting sortOrder
        return sortOrder === 'asc'
          ? parsedA.sequence - parsedB.sequence
          : parsedB.sequence - parsedA.sequence
      })

      // Apply pagination manually
      const jobs = allJobs.slice(skip, skip + limit)

      res.json({
        success: true,
        data: jobs,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        }
      })
    } else {
      // Default sorting by dateTime or other fields
      const sortCriteria = {}
      sortCriteria[sortBy] = sortOrder === 'asc' ? 1 : -1

      // Get paginated jobs with filters
      const jobs = await Job.find(query)
        .sort(sortCriteria)
        .skip(skip)
        .limit(limit)

      res.json({
        success: true,
        data: jobs,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        }
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: error.message
    })
  }
}

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      })
    }
    
    res.json({
      success: true,
      data: job
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching job',
      error: error.message
    })
  }
}

// @desc    Create new job
// @route   POST /api/jobs
// @access  Public
export const createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body)
    
    // Create history entry
    await JobHistory.create({
      jobId: job._id,
      jobNumber: job.jobNumber,
      action: 'created',
      changes: req.body,
      changedFields: Object.keys(req.body)
    })
    
    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: job
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Job number already exists'
      })
    }
    
    res.status(400).json({
      success: false,
      message: 'Error creating job',
      error: error.message
    })
  }
}

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Public
export const updateJob = async (req, res) => {
  try {
    // Get old job data before update
    const oldJob = await Job.findById(req.params.id)
    
    if (!oldJob) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      })
    }

    // Update the job
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    
    // Track what changed
    const changes = {}
    const changedFields = []
    
    Object.keys(req.body).forEach(field => {
      if (JSON.stringify(oldJob[field]) !== JSON.stringify(req.body[field])) {
        changes[field] = {
          old: oldJob[field],
          new: req.body[field]
        }
        changedFields.push(field)
      }
    })

    // Create history entry if there were changes
    if (changedFields.length > 0) {
      await JobHistory.create({
        jobId: job._id,
        jobNumber: job.jobNumber,
        action: 'updated',
        changes,
        changedFields
      })
    }
    
    res.json({
      success: true,
      message: 'Job updated successfully',
      data: job
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating job',
      error: error.message
    })
  }
}

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Public
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id)
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      })
    }

    // Create history entry for deletion
    await JobHistory.create({
      jobId: job._id,
      jobNumber: job.jobNumber,
      action: 'deleted',
      changes: job.toObject(),
      changedFields: ['deleted']
    })
    
    res.json({
      success: true,
      message: 'Job deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting job',
      error: error.message
    })
  }
}

