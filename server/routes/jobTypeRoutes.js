/**
 * JobType Routes
 * API endpoints for job types
 */

import express from 'express'
import {
  getAllJobTypes,
  createJobType,
  updateJobType,
  deleteJobType
} from '../controllers/jobTypeController.js'

const router = express.Router()

router.route('/')
  .get(getAllJobTypes)
  .post(createJobType)

router.route('/:id')
  .put(updateJobType)
  .delete(deleteJobType)

export default router

