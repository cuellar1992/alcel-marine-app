/**
 * Main Server File
 * Express + MongoDB Backend
 */

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/database.js'

// Import routes
import jobRoutes from './routes/jobRoutes.js'
import jobTypeRoutes from './routes/jobTypeRoutes.js'
import portRoutes from './routes/portRoutes.js'
import clientRoutes from './routes/clientRoutes.js'
import jobHistoryRoutes from './routes/jobHistoryRoutes.js'
import claimRoutes from './routes/claimRoutes.js'
import timeSheetRoutes from './routes/timeSheetRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'

// Load environment variables
dotenv.config()

// Create Express app
const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Connect to MongoDB
connectDB()

// Routes
app.use('/api/jobs', jobRoutes)
app.use('/api/job-types', jobTypeRoutes)
app.use('/api/ports', portRoutes)
app.use('/api/clients', clientRoutes)
app.use('/api/job-history', jobHistoryRoutes)
app.use('/api/claims', claimRoutes)
app.use('/api/timesheet', timeSheetRoutes)
app.use('/api/dashboard', dashboardRoutes)

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Alcel Marine API is running',
    timestamp: new Date().toISOString()
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📡 API available at http://localhost:${PORT}/api`)
})

