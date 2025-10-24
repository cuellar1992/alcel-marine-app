/**
 * Job Model
 * Schema for Ballast/Bunker jobs
 */

import mongoose from 'mongoose'

const jobSchema = new mongoose.Schema({
  jobNumber: {
    type: String,
    required: [true, 'Job number is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  vesselName: {
    type: String,
    required: [true, 'Vessel name is required'],
    trim: true
  },
  dateTime: {
    type: Date,
    required: [true, 'Date and time is required']
  },
  etb: {
    type: Date,
    required: false
  },
  etd: {
    type: Date,
    required: false
  },
  port: {
    type: String,
    required: [true, 'Port is required'],
    trim: true
  },
  jobType: {
    type: String,
    required: [true, 'Job type is required']
  },
  clientName: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true
  },
  invoiceIssue: {
    type: String,
    required: [true, 'Invoice status is required'],
    enum: ['not-issued', 'issued', 'paid']
  },
  invoiceAmount: {
    type: Number,
    required: false,
    default: 0
  },
  subcontractAmount: {
    type: Number,
    required: false,
    default: 0
  },
  netProfit: {
    type: Number,
    required: false,
    default: 0
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  remark: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
})

// Indexes for better query performance
jobSchema.index({ dateTime: -1 })
jobSchema.index({ status: 1 })

const Job = mongoose.model('Job', jobSchema)

export default Job

