/**
 * Subcontractor Controller
 * Handles all subcontractor operations
 */

import Subcontractor from '../models/Subcontractor.js'

export const getAllSubcontractors = async (req, res) => {
  try {
    const subcontractors = await Subcontractor.find({ isActive: true }).sort({ name: 1 })

    res.json({
      success: true,
      count: subcontractors.length,
      data: subcontractors
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subcontractors',
      error: error.message
    })
  }
}

export const createSubcontractor = async (req, res) => {
  try {
    const subcontractor = await Subcontractor.create(req.body)

    res.status(201).json({
      success: true,
      message: 'Subcontractor created successfully',
      data: subcontractor
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Subcontractor already exists'
      })
    }

    res.status(400).json({
      success: false,
      message: 'Error creating subcontractor',
      error: error.message
    })
  }
}

export const updateSubcontractor = async (req, res) => {
  try {
    const subcontractor = await Subcontractor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!subcontractor) {
      return res.status(404).json({
        success: false,
        message: 'Subcontractor not found'
      })
    }

    res.json({
      success: true,
      message: 'Subcontractor updated successfully',
      data: subcontractor
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating subcontractor',
      error: error.message
    })
  }
}

export const deleteSubcontractor = async (req, res) => {
  try {
    const subcontractor = await Subcontractor.findByIdAndDelete(req.params.id)

    if (!subcontractor) {
      return res.status(404).json({
        success: false,
        message: 'Subcontractor not found'
      })
    }

    res.json({
      success: true,
      message: 'Subcontractor deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting subcontractor',
      error: error.message
    })
  }
}
