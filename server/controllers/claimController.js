/**
 * Claim Controller
 * Handle CRUD operations for Marine Claims
 */

import Claim from '../models/Claim.js'
import ClaimHistory from '../models/ClaimHistory.js'

// Generate next claim number (shares same sequence with jobs)
const generateClaimNumber = async (req, res) => {
  try {
    const { default: Job } = await import('../models/Job.js')
    
    // Get the latest job or claim number from both collections
    const latestJob = await Job.findOne().sort({ createdAt: -1 }).limit(1)
    const latestClaim = await Claim.findOne().sort({ createdAt: -1 }).limit(1)
    
    let nextNumber = 1
    const currentYear = new Date().getFullYear().toString().slice(-2)
    
    // Extract number from latest job
    if (latestJob && latestJob.jobNumber) {
      const jobMatch = latestJob.jobNumber.match(/ALCEL-\d{2}-(\d{3})/)
      if (jobMatch) {
        nextNumber = Math.max(nextNumber, parseInt(jobMatch[1], 10) + 1)
      }
    }
    
    // Extract number from latest claim
    if (latestClaim && latestClaim.jobNumber) {
      const claimMatch = latestClaim.jobNumber.match(/ALCEL-\d{2}-(\d{3})/)
      if (claimMatch) {
        nextNumber = Math.max(nextNumber, parseInt(claimMatch[1], 10) + 1)
      }
    }
    
    const jobNumber = `ALCEL-${currentYear}-${String(nextNumber).padStart(3, '0')}`
    
    res.status(200).json({
      success: true,
      data: { jobNumber }
    })
  } catch (error) {
    console.error('Error generating claim number:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to generate claim number',
      error: error.message
    })
  }
}

// Create new claim
const createClaim = async (req, res) => {
  try {
    const claim = await Claim.create(req.body)
    
    // Create history entry
    await ClaimHistory.create({
      claimId: claim._id,
      action: 'created',
      changedFields: [],
      modifiedBy: 'System'
    })
    
    res.status(201).json({
      success: true,
      data: claim,
      message: 'Claim created successfully'
    })
  } catch (error) {
    console.error('Error creating claim:', error)
    res.status(400).json({
      success: false,
      message: 'Failed to create claim',
      error: error.message
    })
  }
}

// Get all claims with pagination, search, and filters
const getAllClaims = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const search = req.query.search || ''
    const skip = (page - 1) * limit

    // Build search query
    let query = {}

    if (search) {
      const searchField = req.query.searchField || 'all'
      
      if (searchField === 'all') {
        query.$or = [
          { jobNumber: { $regex: search, $options: 'i' } },
          { clientName: { $regex: search, $options: 'i' } },
          { claimName: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
          { clientRef: { $regex: search, $options: 'i' } }
        ]
      } else {
        query[searchField] = { $regex: search, $options: 'i' }
      }
    }

    // Advanced filters
    if (req.query.location) {
      query.location = req.query.location
    }
    if (req.query.invoiceIssue) {
      query.invoiceIssue = req.query.invoiceIssue
    }
    if (req.query.dateFrom || req.query.dateTo) {
      query.registrationDate = {}
      if (req.query.dateFrom) {
        query.registrationDate.$gte = new Date(req.query.dateFrom)
      }
      if (req.query.dateTo) {
        query.registrationDate.$lte = new Date(req.query.dateTo)
      }
    }

    const totalItems = await Claim.countDocuments(query)
    const totalPages = Math.ceil(totalItems / limit)
    
    const claims = await Claim.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    res.status(200).json({
      success: true,
      data: claims,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    })
  } catch (error) {
    console.error('Error fetching claims:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch claims',
      error: error.message
    })
  }
}

// Get single claim by ID
const getClaimById = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id)
    
    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found'
      })
    }

    res.status(200).json({
      success: true,
      data: claim
    })
  } catch (error) {
    console.error('Error fetching claim:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch claim',
      error: error.message
    })
  }
}

// Update claim
const updateClaim = async (req, res) => {
  try {
    const oldClaim = await Claim.findById(req.params.id)
    
    if (!oldClaim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found'
      })
    }

    // Track changed fields
    const changedFields = []
    for (const key in req.body) {
      if (JSON.stringify(oldClaim[key]) !== JSON.stringify(req.body[key])) {
        changedFields.push(key)
      }
    }

    const claim = await Claim.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    // Create history entry
    if (changedFields.length > 0) {
      await ClaimHistory.create({
        claimId: claim._id,
        action: 'updated',
        changedFields,
        modifiedBy: 'System'
      })
    }

    res.status(200).json({
      success: true,
      data: claim,
      message: 'Claim updated successfully'
    })
  } catch (error) {
    console.error('Error updating claim:', error)
    res.status(400).json({
      success: false,
      message: 'Failed to update claim',
      error: error.message
    })
  }
}

// Delete claim
const deleteClaim = async (req, res) => {
  try {
    const claim = await Claim.findByIdAndDelete(req.params.id)
    
    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found'
      })
    }

    // Create history entry
    await ClaimHistory.create({
      claimId: claim._id,
      action: 'deleted',
      changedFields: [],
      modifiedBy: 'System'
    })

    res.status(200).json({
      success: true,
      message: 'Claim deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting claim:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete claim',
      error: error.message
    })
  }
}

// Get claim history
const getClaimHistory = async (req, res) => {
  try {
    const history = await ClaimHistory.find({ claimId: req.params.id })
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      data: history
    })
  } catch (error) {
    console.error('Error fetching claim history:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch claim history',
      error: error.message
    })
  }
}

export {
  generateClaimNumber,
  createClaim,
  getAllClaims,
  getClaimById,
  updateClaim,
  deleteClaim,
  getClaimHistory
}

