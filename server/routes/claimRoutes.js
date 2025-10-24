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

const router = express.Router()

// Generate claim number
router.get('/generate-number', generateClaimNumber)

// CRUD routes
router.post('/', createClaim)
router.get('/', getAllClaims)
router.get('/:id', getClaimById)
router.put('/:id', updateClaim)
router.delete('/:id', deleteClaim)

// History
router.get('/:id/history', getClaimHistory)

export default router

