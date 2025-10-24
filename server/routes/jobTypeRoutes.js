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
import { authenticate } from '../middleware/authMiddleware.js'
import { requireAdmin, requireUserOrAdmin } from '../middleware/roleMiddleware.js'

const router = express.Router()

// All routes require authentication
router.use(authenticate)

router.route('/')
  .get(getAllJobTypes)
  .post(requireUserOrAdmin, createJobType)

router.route('/:id')
  .put(requireUserOrAdmin, updateJobType)
  .delete(requireAdmin, deleteJobType)

export default router

