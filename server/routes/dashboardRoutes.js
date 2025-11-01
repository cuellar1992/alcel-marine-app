/**
 * Dashboard Routes
 * API routes for dashboard statistics and analytics
 */

import express from 'express'
import {
  getDashboardStats,
  getJobsByStatus,
  getRevenueTrends,
  getTopClients,
  getJobsByType,
  getShipsByPort,
  getRecentActivity,
  getInvoiceOverview,
  getVesselSchedule,
  getJobsPerMonth,
  getJobsByClient,
  getJobsByMonthGrouped
} from '../controllers/dashboardController.js'
import { authenticate } from '../middleware/authMiddleware.js'

const router = express.Router()

// All dashboard routes require authentication
router.use(authenticate)

// Dashboard routes
router.get('/stats', getDashboardStats)
router.get('/jobs-by-status', getJobsByStatus)
router.get('/revenue-trends', getRevenueTrends)
router.get('/top-clients', getTopClients)
router.get('/jobs-by-type', getJobsByType)
router.get('/ships-by-port', getShipsByPort)
router.get('/recent-activity', getRecentActivity)
router.get('/invoice-overview', getInvoiceOverview)
router.get('/vessel-schedule', getVesselSchedule)
router.get('/jobs-per-month', getJobsPerMonth)
router.get('/jobs-by-client', getJobsByClient)
router.get('/jobs-by-month-grouped', getJobsByMonthGrouped)

export default router

