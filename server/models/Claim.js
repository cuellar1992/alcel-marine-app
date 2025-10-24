/**
 * Claim Model
 * Marine Claims and Inspections
 */

import mongoose from 'mongoose'

const claimSchema = new mongoose.Schema({
  jobNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  registrationDate: {
    type: Date,
    required: true
  },
  clientRef: {
    type: String,
    required: true,
    trim: true
  },
  claimName: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  siteInspectionDateTime: {
    type: Date,
    required: false
  },
  invoiceIssue: {
    type: String,
    required: true,
    enum: ['not-issued', 'issued', 'paid'],
    default: 'not-issued'
  },
  invoiceAmount: {
    type: Number,
    default: 0
  },
  subcontractAmount: {
    type: Number,
    default: 0
  },
  netProfit: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// Index for faster queries
claimSchema.index({ jobNumber: 1 })
claimSchema.index({ claimName: 1 })
claimSchema.index({ registrationDate: -1 })

export default mongoose.model('Claim', claimSchema)

