import express from 'express'
import {
  getTimeSheetEntries,
  createTimeSheetEntry,
  updateTimeSheetEntry,
  deleteTimeSheetEntry,
  getTimeSheetSummary
} from '../controllers/timeSheetController.js'
import { authenticate } from '../middleware/authMiddleware.js'
import { requireAdmin, requireUserOrAdmin } from '../middleware/roleMiddleware.js'

const router = express.Router()

// All routes require authentication
router.use(authenticate)

// Get all timesheet entries for a claim
router.get('/:claimId', getTimeSheetEntries)

// Get timesheet summary for a claim
router.get('/:claimId/summary', getTimeSheetSummary)

// Create a new timesheet entry
router.post('/', requireUserOrAdmin, createTimeSheetEntry)

// Update a timesheet entry
router.put('/:id', requireUserOrAdmin, updateTimeSheetEntry)

// Delete a timesheet entry
router.delete('/:id', requireAdmin, deleteTimeSheetEntry)

export default router
