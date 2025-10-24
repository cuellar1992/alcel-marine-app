/**
 * JobHistory Model
 * Tracks all changes made to jobs (audit trail)
 */

import mongoose from 'mongoose'

const jobHistorySchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
    index: true
  },
  jobNumber: {
    type: String,
    required: true
  },
  action: {
    type: String,
    enum: ['created', 'updated', 'deleted'],
    required: true
  },
  changes: {
    type: mongoose.Schema.Types.Mixed,
    // Stores { field: { old: value, new: value } }
  },
  changedFields: [{
    type: String
  }],
  modifiedBy: {
    type: String,
    default: 'System'
    // When you add auth: store user email/name
  }
}, {
  timestamps: true
})

// Index for fast queries
jobHistorySchema.index({ jobId: 1, createdAt: -1 })

const JobHistory = mongoose.model('JobHistory', jobHistorySchema)

export default JobHistory

