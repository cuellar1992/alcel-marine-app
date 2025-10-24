/**
 * Claim Routes
 * API routes for marine claims operations
 */

import express from 'express'
import {
  generateClaimNumber,
  createClaim,
  getAllClaims,
  getClaimById,
  updateClaim,
  deleteClaim,
  getClaimHistory
} from '../controllers/claimController.js'
import { authenticate } from '../middleware/authMiddleware.js'
import { requireAdmin, requireUserOrAdmin } from '../middleware/roleMiddleware.js'

const router = express.Router()

// All routes require authentication
router.use(authenticate)

// Generate claim number
router.get('/generate-number', generateClaimNumber)

// CRUD routes
router.post('/', requireUserOrAdmin, createClaim)
router.get('/', getAllClaims)
router.get('/:id', getClaimById)
router.put('/:id', requireUserOrAdmin, updateClaim)
router.delete('/:id', requireAdmin, deleteClaim)

// History
router.get('/:id/history', getClaimHistory)

export default router

