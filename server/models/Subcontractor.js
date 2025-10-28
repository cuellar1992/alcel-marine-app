/**
 * Subcontractor Model
 * Schema for subcontractor definitions
 */

import mongoose from 'mongoose'

const subcontractorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Subcontractor name is required'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

const Subcontractor = mongoose.model('Subcontractor', subcontractorSchema)

export default Subcontractor
