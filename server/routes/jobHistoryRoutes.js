/**
 * JobHistory Routes
 * API endpoints for job history
 */

import express from 'express'
import { getJobHistory, createHistoryEntry } from '../controllers/jobHistoryController.js'

const router = express.Router()

router.get('/:jobId/history', getJobHistory)
router.post('/', createHistoryEntry)

export default router

