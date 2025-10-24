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

const router = express.Router()

// Must be before /:id routes
router.get('/generate-number', generateJobNumber)

router.route('/')
  .get(getAllJobs)
  .post(createJob)

router.route('/:id')
  .get(getJobById)
  .put(updateJob)
  .delete(deleteJob)

// Job history
router.get('/:jobId/history', getJobHistory)

export default router

