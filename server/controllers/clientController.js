/**
 * Client Controller
 * Handles all client operations
 */

import Client from '../models/Client.js'

export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find({ isActive: true }).sort({ name: 1 })
    
    res.json({
      success: true,
      count: clients.length,
      data: clients
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching clients',
      error: error.message
    })
  }
}

export const createClient = async (req, res) => {
  try {
    const client = await Client.create(req.body)
    
    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: client
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Client already exists'
      })
    }
    
    res.status(400).json({
      success: false,
      message: 'Error creating client',
      error: error.message
    })
  }
}

export const updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      })
    }
    
    res.json({
      success: true,
      message: 'Client updated successfully',
      data: client
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating client',
      error: error.message
    })
  }
}

export const deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id)
    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      })
    }
    
    res.json({
      success: true,
      message: 'Client deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting client',
      error: error.message
    })
  }
}

