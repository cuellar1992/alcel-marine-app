/**
 * JobHistory Controller
 * Handles job history operations
 */

import JobHistory from '../models/JobHistory.js'

// @desc    Get history for a specific job
// @route   GET /api/jobs/:jobId/history
// @access  Public
export const getJobHistory = async (req, res) => {
  try {
    const history = await JobHistory.find({ jobId: req.params.jobId })
      .sort({ createdAt: -1 })
    
    res.json({
      success: true,
      count: history.length,
      data: history
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching job history',
      error: error.message
    })
  }
}

// @desc    Create history entry
// @route   POST /api/job-history
// @access  Public
export const createHistoryEntry = async (req, res) => {
  try {
    const entry = await JobHistory.create(req.body)
    
    res.status(201).json({
      success: true,
      data: entry
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating history entry',
      error: error.message
    })
  }
}

