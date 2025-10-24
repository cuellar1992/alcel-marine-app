/**
 * Port Controller
 * Handles all port operations
 */

import Port from '../models/Port.js'

export const getAllPorts = async (req, res) => {
  try {
    const ports = await Port.find({ isActive: true }).sort({ name: 1 })
    
    res.json({
      success: true,
      count: ports.length,
      data: ports
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching ports',
      error: error.message
    })
  }
}

export const createPort = async (req, res) => {
  try {
    const port = await Port.create(req.body)
    
    res.status(201).json({
      success: true,
      message: 'Port created successfully',
      data: port
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Port already exists'
      })
    }
    
    res.status(400).json({
      success: false,
      message: 'Error creating port',
      error: error.message
    })
  }
}

export const updatePort = async (req, res) => {
  try {
    const port = await Port.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    
    if (!port) {
      return res.status(404).json({
        success: false,
        message: 'Port not found'
      })
    }
    
    res.json({
      success: true,
      message: 'Port updated successfully',
      data: port
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating port',
      error: error.message
    })
  }
}

export const deletePort = async (req, res) => {
  try {
    const port = await Port.findByIdAndDelete(req.params.id)
    
    if (!port) {
      return res.status(404).json({
        success: false,
        message: 'Port not found'
      })
    }
    
    res.json({
      success: true,
      message: 'Port deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting port',
      error: error.message
    })
  }
}

