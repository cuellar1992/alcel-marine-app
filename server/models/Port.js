/**
 * Port Model
 * Schema for port definitions
 */

import mongoose from 'mongoose'

const portSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Port name is required'],
    unique: true,
    trim: true
  },
  country: {
    type: String,
    trim: true,
    default: 'Australia'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

const Port = mongoose.model('Port', portSchema)

export default Port

