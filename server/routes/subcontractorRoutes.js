/**
 * Subcontractor Routes
 * API endpoints for subcontractors
 */

import express from 'express'
import {
  getAllSubcontractors,
  createSubcontractor,
  updateSubcontractor,
  deleteSubcontractor
} from '../controllers/subcontractorController.js'
import { authenticate } from '../middleware/authMiddleware.js'
import { requireAdmin, requireUserOrAdmin } from '../middleware/roleMiddleware.js'

const router = express.Router()

// All routes require authentication
router.use(authenticate)

router.route('/')
  .get(getAllSubcontractors)
  .post(requireUserOrAdmin, createSubcontractor)

router.route('/:id')
  .put(requireUserOrAdmin, updateSubcontractor)
  .delete(requireAdmin, deleteSubcontractor)

export default router
