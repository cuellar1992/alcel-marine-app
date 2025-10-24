/**
 * Job Routes
 * API endpoints for jobs
 */

import express from 'express'
import {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  generateJobNumber
} from '../controllers/jobController.js'
import { getJobHistory } from '../controllers/jobHistoryController.js'
import { authenticate } from '../middleware/authMiddleware.js'
import { requireAdmin, requireUserOrAdmin } from '../middleware/roleMiddleware.js'

const router = express.Router()

// All routes require authentication
router.use(authenticate)

// Must be before /:id routes
router.get('/generate-number', generateJobNumber)

router.route('/')
  .get(getAllJobs) // Everyone can view
  .post(requireUserOrAdmin, createJob) // Only user or admin can create

router.route('/:id')
  .get(getJobById) // Everyone can view
  .put(requireUserOrAdmin, updateJob) // Only user or admin can update
  .delete(requireAdmin, deleteJob) // Only admin can delete

// Job history
router.get('/:jobId/history', getJobHistory)

export default router

