/**
 * ClaimHistory Model
 * Track changes to claims
 */

import mongoose from 'mongoose'

const claimHistorySchema = new mongoose.Schema({
  claimId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Claim',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['created', 'updated', 'deleted']
  },
  changedFields: [{
    type: String
  }],
  modifiedBy: {
    type: String,
    default: 'System'
  }
}, {
  timestamps: true
})

// Index for faster queries
claimHistorySchema.index({ claimId: 1, createdAt: -1 })

export default mongoose.model('ClaimHistory', claimHistorySchema)

