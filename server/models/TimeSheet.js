import mongoose from 'mongoose'

const timeSheetSchema = new mongoose.Schema({
  claimId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Claim',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  timeMinutes: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
})

// Índices para optimizar consultas
timeSheetSchema.index({ claimId: 1, date: -1 })
timeSheetSchema.index({ claimId: 1, createdAt: -1 })

export default mongoose.model('TimeSheet', timeSheetSchema)
