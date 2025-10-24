/**
 * Main Server File
 * Express + MongoDB Backend
 *
 * NOTE: Environment variables are loaded by start.js before this file
 */

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
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
import authRoutes from './routes/authRoutes.js'
import userManagementRoutes from './routes/userManagementRoutes.js'

// Import middleware
import { apiLimiter } from './middleware/rateLimiter.js'

// Create Express app
const app = express()

// Middleware
app.use(helmet()) // Security headers
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter)

// Connect to MongoDB
connectDB()

// Routes
// Auth routes (public - no authentication required)
app.use('/api/auth', authRoutes)

// User management routes (admin only - protected)
app.use('/api/users', userManagementRoutes)

// Business routes (protected)
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

