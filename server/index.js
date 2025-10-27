/**
 * Main Server File
 * Express + MongoDB Backend
 *
 * NOTE: Environment variables are loaded by start.js before this file
 */

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './config/database.js'

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
import twoFactorRoutes from './routes/twoFactorRoutes.js'

// Import middleware
import { apiLimiter } from './middleware/rateLimiter.js'

// Create Express app
const app = express()

// Middleware
// Configure Helmet with relaxed CSP for production
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP in production to avoid blocking same-origin requests
  crossOriginEmbedderPolicy: false,
}))
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

// 2FA routes (protected - user must be authenticated)
app.use('/api/2fa', twoFactorRoutes)

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
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  })
})

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist')

  // Serve static files from the dist folder
  app.use(express.static(distPath))

  console.log('📦 Serving static files from:', distPath)
}

// Handle client-side routing in production - MUST be after all API routes
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist')
  app.use((req, res, next) => {
    // If it's not an API route, serve index.html
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'))
    } else {
      next()
    }
  })
}

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

