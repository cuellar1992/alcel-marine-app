import express from 'express'
import {
  getTimeSheetEntries,
  createTimeSheetEntry,
  updateTimeSheetEntry,
  deleteTimeSheetEntry,
  getTimeSheetSummary
} from '../controllers/timeSheetController.js'

const router = express.Router()

// Get all timesheet entries for a claim
router.get('/:claimId', getTimeSheetEntries)

// Get timesheet summary for a claim
router.get('/:claimId/summary', getTimeSheetSummary)

// Create a new timesheet entry
router.post('/', createTimeSheetEntry)

// Update a timesheet entry
router.put('/:id', updateTimeSheetEntry)

// Delete a timesheet entry
router.delete('/:id', deleteTimeSheetEntry)

export default router
