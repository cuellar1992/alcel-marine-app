/**
 * TimeSheet Controller
 * Handles all timesheet-related operations
 */

import TimeSheet from '../models/TimeSheet.js'

// @desc    Get all timesheet entries for a claim
// @route   GET /api/timesheet/:claimId
// @access  Public
export const getTimeSheetEntries = async (req, res) => {
  try {
    const { claimId } = req.params
    
    const entries = await TimeSheet.find({ claimId })
      .sort({ date: -1, createdAt: -1 })
    
    res.status(200).json({
      success: true,
      data: entries
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching timesheet entries',
      error: error.message
    })
  }
}

// @desc    Create a new timesheet entry
// @route   POST /api/timesheet
// @access  Public
export const createTimeSheetEntry = async (req, res) => {
  try {
    const { claimId, date, timeMinutes, description } = req.body
    
    // Validaciones
    if (!claimId || !date || !timeMinutes || !description) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      })
    }
    
    if (timeMinutes < 0) {
      return res.status(400).json({
        success: false,
        message: 'Time minutes must be positive'
      })
    }
    
    const timeSheetEntry = new TimeSheet({
      claimId,
      date: new Date(date),
      timeMinutes: parseInt(timeMinutes),
      description: description.trim()
    })
    
    const savedEntry = await timeSheetEntry.save()
    
    res.status(201).json({
      success: true,
      data: savedEntry
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating timesheet entry',
      error: error.message
    })
  }
}

// @desc    Update a timesheet entry
// @route   PUT /api/timesheet/:id
// @access  Public
export const updateTimeSheetEntry = async (req, res) => {
  try {
    const { id } = req.params
    const { date, timeMinutes, description } = req.body
    
    // Validaciones
    if (!date || !timeMinutes || !description) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      })
    }
    
    if (timeMinutes < 0) {
      return res.status(400).json({
        success: false,
        message: 'Time minutes must be positive'
      })
    }
    
    const updatedEntry = await TimeSheet.findByIdAndUpdate(
      id,
      {
        date: new Date(date),
        timeMinutes: parseInt(timeMinutes),
        description: description.trim()
      },
      { new: true, runValidators: true }
    )
    
    if (!updatedEntry) {
      return res.status(404).json({
        success: false,
        message: 'TimeSheet entry not found'
      })
    }
    
    res.status(200).json({
      success: true,
      data: updatedEntry
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating timesheet entry',
      error: error.message
    })
  }
}

// @desc    Delete a timesheet entry
// @route   DELETE /api/timesheet/:id
// @access  Public
export const deleteTimeSheetEntry = async (req, res) => {
  try {
    const { id } = req.params
    
    const deletedEntry = await TimeSheet.findByIdAndDelete(id)
    
    if (!deletedEntry) {
      return res.status(404).json({
        success: false,
        message: 'TimeSheet entry not found'
      })
    }
    
    res.status(200).json({
      success: true,
      message: 'TimeSheet entry deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting timesheet entry',
      error: error.message
    })
  }
}

// @desc    Get timesheet summary for a claim
// @route   GET /api/timesheet/:claimId/summary
// @access  Public
export const getTimeSheetSummary = async (req, res) => {
  try {
    const { claimId } = req.params
    
    const entries = await TimeSheet.find({ claimId })
    
    const totalMinutes = entries.reduce((sum, entry) => sum + entry.timeMinutes, 0)
    const totalHours = Math.floor(totalMinutes / 60)
    const remainingMinutes = totalMinutes % 60
    
    const summary = {
      totalEntries: entries.length,
      totalMinutes,
      totalHours,
      remainingMinutes,
      formattedTotal: `${totalHours}h ${remainingMinutes}m`
    }
    
    res.status(200).json({
      success: true,
      data: summary
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching timesheet summary',
      error: error.message
    })
  }
}
