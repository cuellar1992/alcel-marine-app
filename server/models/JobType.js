/**
 * JobType Model
 * Schema for job type definitions
 */

import mongoose from 'mongoose'

const jobTypeSchema = new mongoose.Schema({
  value: {
    type: String,
    required: [true, 'Value is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  label: {
    type: String,
    required: [true, 'Label is required'],
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

const JobType = mongoose.model('JobType', jobTypeSchema)

export default JobType

