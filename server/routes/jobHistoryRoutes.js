/**
 * JobHistory Routes
 * API endpoints for job history
 */

import express from 'express'
import { getJobHistory, createHistoryEntry } from '../controllers/jobHistoryController.js'
import { authenticate } from '../middleware/authMiddleware.js'

const router = express.Router()

// All routes require authentication
router.use(authenticate)

router.get('/:jobId/history', getJobHistory)
router.post('/', createHistoryEntry)

export default router

