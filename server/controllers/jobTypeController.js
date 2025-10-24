/**
 * JobType Controller
 * Handles all job type operations
 */

import JobType from '../models/JobType.js'

// @desc    Get all job types
// @route   GET /api/job-types
// @access  Public
export const getAllJobTypes = async (req, res) => {
  try {
    const jobTypes = await JobType.find({ isActive: true }).sort({ label: 1 })
    
    res.json({
      success: true,
      count: jobTypes.length,
      data: jobTypes
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching job types',
      error: error.message
    })
  }
}

// @desc    Create job type
// @route   POST /api/job-types
// @access  Public
export const createJobType = async (req, res) => {
  try {
    const jobType = await JobType.create(req.body)
    
    res.status(201).json({
      success: true,
      message: 'Job type created successfully',
      data: jobType
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Job type already exists'
      })
    }
    
    res.status(400).json({
      success: false,
      message: 'Error creating job type',
      error: error.message
    })
  }
}

// @desc    Update job type
// @route   PUT /api/job-types/:id
// @access  Public
export const updateJobType = async (req, res) => {
  try {
    const jobType = await JobType.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    
    if (!jobType) {
      return res.status(404).json({
        success: false,
        message: 'Job type not found'
      })
    }
    
    res.json({
      success: true,
      message: 'Job type updated successfully',
      data: jobType
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating job type',
      error: error.message
    })
  }
}

// @desc    Delete job type
// @route   DELETE /api/job-types/:id
// @access  Public
export const deleteJobType = async (req, res) => {
  try {
    const jobType = await JobType.findByIdAndDelete(req.params.id)
    
    if (!jobType) {
      return res.status(404).json({
        success: false,
        message: 'Job type not found'
      })
    }
    
    res.json({
      success: true,
      message: 'Job type deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting job type',
      error: error.message
    })
  }
}

